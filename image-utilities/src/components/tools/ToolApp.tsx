import {
  useCallback,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from 'react';
import type { ToolId } from '../../data/tools';
import {
  defaults,
  limits,
  type ImageInfo,
  type ImageSettings,
  type ProcessResult,
  type Format,
} from '../../lib/types';
import { allowedFor } from '../../lib/validation';
import {
  batchCheck,
  centeredCrop,
  linkedSize,
  percentageSize,
  rotatedSize,
  formatBytes,
  savings,
  outputName,
  compressionPolicy,
} from '../../lib/math';
import { imageTask, buildZip } from '../../lib/client';
import { socialPresets, reviewed } from '../../data/social-presets';
import {
  ImageDropzone,
  Select,
  NumberField,
  Check,
  QualitySlider,
  FormatSelector,
  BackgroundColorPicker,
  DownloadButton,
  download,
} from './controls';
const CropStage = lazy(() => import('./CropStage'));
const MetadataPanel = lazy(() => import('./MetadataPanel'));
type Entry = {
  file: File;
  info: ImageInfo;
  url: string;
  result?: ProcessResult;
  resultUrl?: string;
  error?: string;
};
const fixedFormats: Partial<Record<ToolId, Format>> = {
  'png-to-jpg': 'image/jpeg',
  'jpg-to-png': 'image/png',
  'image-to-webp': 'image/webp',
  'webp-to-png': 'image/png',
};
function initial(id: ToolId): ImageSettings {
  return {
    ...defaults,
    transparent: true,
    format:
      fixedFormats[id] ||
      (id === 'image-compressor' ? 'image/webp' : 'image/png'),
    action:
      id === 'image-resizer'
        ? 'resize'
        : id === 'image-compressor'
          ? 'compress'
          : id === 'image-cropper'
            ? 'crop'
            : id === 'image-metadata-viewer'
              ? 'metadata'
              : [
                    'aspect-ratio-converter',
                    'social-media-image-resizer',
                  ].includes(id)
                ? 'ratio'
                : 'convert',
  };
}
export default function ToolApp({
  id,
  initialFiles,
}: {
  id: ToolId;
  initialFiles?: File[];
}) {
  const [entries, setEntries] = useState<Entry[]>([]),
    [active, setActive] = useState(0),
    [settings, setSettings] = useState<ImageSettings>(() => initial(id));
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [completed, setCompleted] = useState(0),
    [zipBusy, setZipBusy] = useState(false);
  const [lock, setLock] = useState(true),
    [percent, setPercent] = useState(100),
    [cropRatio, setCropRatio] = useState('free'),
    [zoom, setZoom] = useState(1),
    [ratio, setRatio] = useState('1:1'),
    [customRatio, setCustomRatio] = useState({ width: 1, height: 1 }),
    [socialIndex, setSocialIndex] = useState(0);
  const controller = useRef<AbortController | null>(null),
    epoch = useRef(0),
    urls = useRef(new Set<string>());
  const entry = entries[active];
  const batch = [
    'image-compressor',
    'png-to-jpg',
    'jpg-to-png',
    'image-to-webp',
    'webp-to-png',
  ].includes(id);
  const isResize = id === 'image-resizer',
    isCompress = id === 'image-compressor',
    isCrop = id === 'image-cropper',
    isRatio = id === 'aspect-ratio-converter',
    isSocial = id === 'social-media-image-resizer',
    isMetadata = id === 'image-metadata-viewer';
  const release = useCallback(() => {
    for (const url of urls.current) URL.revokeObjectURL(url);
    urls.current.clear();
  }, []);
  useEffect(
    () => () => {
      epoch.current++;
      controller.current?.abort();
      release();
    },
    [release],
  );
  const selectFiles = useCallback(
    async (files: File[]) => {
      controller.current?.abort();
      const current = ++epoch.current;
      release();
      setEntries([]);
      setActive(0);
      setError('');
      setCompleted(0);
      setZipBusy(false);
      setMessage('');
      try {
        batchCheck(files);
        if (
          ![
            'image-compressor',
            'png-to-jpg',
            'jpg-to-png',
            'image-to-webp',
            'webp-to-png',
          ].includes(id) &&
          files.length > 1
        )
          throw new Error(
            'This workspace accepts one image at a time. Use a converter or compressor for batches.',
          );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid selection');
        return;
      }
      const abort = new AbortController();
      controller.current = abort;
      setBusy(true);
      const next: Entry[] = [];
      try {
        for (const [fileIndex, file] of files.entries()) {
          setMessage(`Checking image ${fileIndex + 1} of ${files.length}`);
          const info = await imageTask<ImageInfo>(
            file,
            'inspect',
            undefined,
            abort.signal,
          );
          if (!allowedFor(id).includes(info.format))
            throw new Error(
              `This tool expects ${allowedFor(id)
                .map((v) => v.split('/')[1]!.toUpperCase())
                .join(' or ')} input.`,
            );
          if (current !== epoch.current) return;
          const url = URL.createObjectURL(file);
          urls.current.add(url);
          next.push({ file, info, url });
        }
        if (current !== epoch.current) return;
        const info = next[0]!.info;
        const s = initial(id);
        s.width = info.width;
        s.height = info.height;
        s.crop = centeredCrop(info, info.width / info.height);
        if (id === 'aspect-ratio-converter') {
          s.width = Math.min(1200, info.width);
          s.height = s.width;
        }
        if (id === 'social-media-image-resizer') {
          s.width = socialPresets[0]!.width;
          s.height = socialPresets[0]!.height;
          setSocialIndex(0);
        }
        setSettings(s);
        setEntries(next);
        setPercent(100);
        setZoom(1);
        setCropRatio('free');
        setRatio('1:1');
        setMessage(
          `${next.length} image${next.length === 1 ? '' : 's'} ready. Original files stay unchanged.`,
        );
      } catch (e) {
        if (
          current === epoch.current &&
          !(e instanceof DOMException && e.name === 'AbortError')
        )
          setError(e instanceof Error ? e.message : 'Unable to read image.');
      } finally {
        if (current === epoch.current) setBusy(false);
      }
    },
    [id, release],
  );
  useEffect(() => {
    if (initialFiles?.length) void selectFiles(initialFiles);
  }, [initialFiles, selectFiles]);
  const clearResults = () => {
    controller.current?.abort();
    setZipBusy(false);
    setEntries((items) =>
      items.map((item) => {
        if (item.resultUrl) {
          URL.revokeObjectURL(item.resultUrl);
          urls.current.delete(item.resultUrl);
        }
        return {
          ...item,
          result: undefined,
          resultUrl: undefined,
          error: undefined,
        };
      }),
    );
    setError('');
    setCompleted(0);
    setMessage('Settings updated. Process again to preview the result.');
  };
  const update = (patch: Partial<ImageSettings>) => {
    clearResults();
    setSettings((s) => ({ ...s, ...patch }));
  };
  const reset = () => {
    controller.current?.abort();
    epoch.current++;
    release();
    setEntries([]);
    setActive(0);
    setSettings(initial(id));
    setError('');
    setMessage('');
    setBusy(false);
    setZipBusy(false);
    setCompleted(0);
  };
  const sample = async () => {
    const intent = ++epoch.current;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetch('/images/sample-landscape.png', {
        signal: abort.signal,
      });
      if (!response.ok) throw new Error('Sample could not be loaded.');
      const blob = await response.blob();
      if (intent === epoch.current)
        void selectFiles([
          new File([blob], 'mountain-study.png', { type: 'image/png' }),
        ]);
    } catch (error) {
      if (
        intent === epoch.current &&
        !(error instanceof DOMException && error.name === 'AbortError')
      )
        setError(
          error instanceof Error ? error.message : 'Unable to load sample.',
        );
    }
  };
  const run = async (strip = false) => {
    if (!entries.length) return;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    const current = ++epoch.current;
    setBusy(true);
    setError('');
    setCompleted(0);
    let total = 0;
    try {
      for (const [index, item] of entries.entries()) {
        try {
          const result = await imageTask<ProcessResult>(
            item.file,
            'process',
            strip
              ? {
                  ...settings,
                  action: 'strip',
                  format: 'image/png',
                  rotation: 0,
                }
              : settings,
            abort.signal,
            (text) => {
              if (current === epoch.current)
                setMessage(`${index + 1} / ${entries.length} · ${text}`);
            },
          );
          if (current !== epoch.current) return;
          if (result.blob) {
            total += result.blob.size;
            if (total > limits.batchBytes)
              throw new Error(
                'Results exceed the 60 MB batch limit. Use a smaller batch or output.',
              );
          }
          const resultUrl = result.blob
            ? URL.createObjectURL(result.blob)
            : undefined;
          if (resultUrl) urls.current.add(resultUrl);
          setEntries((items) =>
            items.map((entry, i) => {
              if (i !== index) return entry;
              if (entry.resultUrl) {
                URL.revokeObjectURL(entry.resultUrl);
                urls.current.delete(entry.resultUrl);
              }
              return { ...entry, result, resultUrl, error: undefined };
            }),
          );
          setCompleted(index + 1);
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') throw e;
          if (current !== epoch.current) return;
          setEntries((items) =>
            items.map((entry, i) =>
              i === index
                ? {
                    ...entry,
                    error:
                      e instanceof Error ? e.message : 'Processing failed.',
                  }
                : entry,
            ),
          );
          setError(e instanceof Error ? e.message : 'Processing failed.');
        }
      }
      if (current === epoch.current)
        setMessage('Processing finished. Review the actual results below.');
    } catch (e) {
      if (current === epoch.current)
        setMessage(
          e instanceof DOMException && e.name === 'AbortError'
            ? 'Processing cancelled.'
            : 'Unable to complete this operation.',
        );
    } finally {
      if (current === epoch.current) setBusy(false);
    }
  };
  const ratios = [
    ['free', 'Freeform'],
    ['1:1', '1:1 · Square'],
    ['4:3', '4:3 · Landscape'],
    ['3:4', '3:4 · Portrait'],
    ['16:9', '16:9 · Widescreen'],
    ['9:16', '9:16 · Vertical'],
  ] as const;
  const numericRatio = (value: string) => {
    const [a, b] = value.split(':').map(Number);
    return a! / b!;
  };
  const setCropPreset = (value: string) => {
    setCropRatio(value);
    setZoom(1);
    if (entry) {
      const size = rotatedSize(entry.info, settings.rotation);
      update({
        crop: centeredCrop(
          size,
          value === 'free' ? size.width / size.height : numericRatio(value),
        ),
      });
    }
  };
  const ratioValue =
    ratio === 'custom'
      ? customRatio.width / customRatio.height
      : numericRatio(ratio);
  const setRatioPreset = (value: string) => {
    setRatio(value);
    const r =
      value === 'custom'
        ? customRatio.width / customRatio.height
        : numericRatio(value);
    update({ height: Math.max(1, Math.round(settings.width / r)) });
  };
  const output = entry?.result;
  const successful = entries.filter((e) => e.result?.blob);
  const actionLabel = isCompress
    ? 'Compress image'
    : isCrop
      ? 'Crop image'
      : isMetadata
        ? 'Inspect metadata'
        : isResize
          ? 'Resize image'
          : isRatio || isSocial
            ? 'Create image'
            : 'Convert image';
  return (
    <div className="image-workspace" data-workspace>
      <div className="workspace-topline">
        <span className="step-label">
          <b>01</b> CHOOSE YOUR IMAGE
        </span>
        <div className="button-row">
          <button className="text-button" disabled={busy} onClick={sample}>
            Try a sample
          </button>
          {entries.length > 0 && (
            <button className="btn small" onClick={reset}>
              Reset workspace
            </button>
          )}
        </div>
      </div>
      {!entries.length ? (
        <ImageDropzone
          onFiles={(files) => void selectFiles(files)}
          multiple={batch}
          busy={busy}
        />
      ) : (
        <>
          <div className="file-strip">
            <span className="file-thumb-icon" aria-hidden="true">
              ▧
            </span>
            <div>
              <strong>{entry!.file.name}</strong>
              <small>
                {entry!.info.width} × {entry!.info.height} px ·{' '}
                {formatBytes(entry!.file.size)} ·{' '}
                {entry!.info.format.split('/')[1]!.toUpperCase()}
              </small>
            </div>
            <button
              className="btn small"
              disabled={busy}
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>('[data-replace-input]')
                  ?.click()
              }
            >
              Change image
            </button>
            <input
              data-replace-input
              tabIndex={-1}
              className="sr-only"
              aria-label="Change image files"
              type="file"
              multiple={batch}
              accept=".jpg,.jpeg,.png,.webp"
              disabled={busy}
              onChange={(e) => {
                void selectFiles([...(e.target.files || [])]);
                e.target.value = '';
              }}
            />
          </div>
          {entries.length > 1 && (
            <div className="batch-queue" role="group" aria-label="Batch queue">
              {entries.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === active ? 'active' : ''}
                  onClick={() => setActive(index)}
                  aria-pressed={index === active}
                >
                  <span>{index + 1}</span>
                  {item.file.name}
                  <small>
                    {item.error ? 'Error' : item.result ? 'Ready' : 'Waiting'}
                  </small>
                </button>
              ))}
            </div>
          )}
          <div
            className={`workspace-grid ${isMetadata ? 'metadata-layout' : ''}`}
          >
            <section className="settings-panel">
              <div className="section-heading">
                <h2>
                  <b>02</b> Make it yours
                </h2>
                <span>SETTINGS</span>
              </div>
              <fieldset disabled={busy}>
                {isResize && (
                  <>
                    <div className="two-fields">
                      <NumberField
                        label="Width"
                        value={settings.width}
                        onChange={(width) =>
                          update(
                            lock
                              ? linkedSize(entry!.info, width, 'width')
                              : { width },
                          )
                        }
                      />
                      <NumberField
                        label="Height"
                        value={settings.height}
                        onChange={(height) =>
                          update(
                            lock
                              ? linkedSize(entry!.info, height, 'height')
                              : { height },
                          )
                        }
                      />
                    </div>
                    <Check
                      label="Maintain original aspect ratio"
                      checked={lock}
                      onChange={setLock}
                    />
                    {!lock && (
                      <p className="inline-warning">
                        Unlocked dimensions may stretch the image.
                      </p>
                    )}
                    <Select
                      label="Size preset"
                      value=""
                      onChange={(v) => {
                        const [width, height] = v.split('x').map(Number);
                        if (lock) {
                          const scale = Math.min(
                            width! / entry!.info.width,
                            height! / entry!.info.height,
                          );
                          update({
                            width: Math.max(
                              1,
                              Math.round(entry!.info.width * scale),
                            ),
                            height: Math.max(
                              1,
                              Math.round(entry!.info.height * scale),
                            ),
                          });
                        } else update({ width: width!, height: height! });
                      }}
                      options={[
                        ['', 'Fit within a common canvas…'],
                        ['1200x630', '1200 × 630'],
                        ['1920x1080', '1920 × 1080'],
                        ['1080x1080', '1080 × 1080'],
                        ['800x600', '800 × 600'],
                      ]}
                    />
                    <label className="field">
                      Resize percentage
                      <div className="percent-control">
                        <input
                          aria-label="Resize percentage"
                          type="number"
                          min="1"
                          max="400"
                          value={percent}
                          onChange={(e) => setPercent(Number(e.target.value))}
                        />
                        <span>%</span>
                        <button
                          type="button"
                          className="btn small"
                          onClick={() => {
                            try {
                              update(percentageSize(entry!.info, percent));
                            } catch (e) {
                              setError(
                                e instanceof Error
                                  ? e.message
                                  : 'Invalid percentage.',
                              );
                            }
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </label>
                    <p className="fine-print">
                      Presets fit inside the chosen canvas while the ratio is
                      locked. Percentage is relative to the original.
                    </p>
                  </>
                )}
                {isCompress && (
                  <>
                    <Select
                      label="Compression mode"
                      value={settings.mode}
                      onChange={(mode) =>
                        update({ mode: mode as ImageSettings['mode'] })
                      }
                      options={[
                        ['quality', 'Quality-focused'],
                        ['balanced', 'Balanced'],
                        ['smallest', 'Smallest file'],
                      ]}
                    />
                    <Select
                      label="Target file size"
                      value={
                        [
                          0, 20000, 50000, 100000, 200000, 500000, 1000000,
                        ].includes(settings.targetBytes)
                          ? String(settings.targetBytes)
                          : 'custom'
                      }
                      onChange={(v) =>
                        update({
                          targetBytes: v === 'custom' ? 75000 : Number(v),
                        })
                      }
                      options={[
                        ['0', 'No size target'],
                        ['20000', '20 KB'],
                        ['50000', '50 KB'],
                        ['100000', '100 KB'],
                        ['200000', '200 KB'],
                        ['500000', '500 KB'],
                        ['1000000', '1 MB'],
                        ['custom', 'Custom target'],
                      ]}
                    />
                    <label className="field">
                      Custom target (KB)
                      <input
                        type="number"
                        min="0"
                        max="20000"
                        value={settings.targetBytes / 1000}
                        onChange={(e) =>
                          update({ targetBytes: Number(e.target.value) * 1000 })
                        }
                      />
                    </label>
                    <Check
                      label="Allow dimension reduction to reach the target"
                      checked={settings.allowReduction}
                      onChange={(allowReduction) => update({ allowReduction })}
                    />
                    <p className="fine-print">
                      A target is a goal, not a guarantee. 1 KB = 1,000 bytes.{' '}
                      {settings.allowReduction
                        ? 'Up to four resolutions may be tried.'
                        : 'Original dimensions will be preserved.'}
                    </p>
                  </>
                )}
                {isCrop && (
                  <>
                    <Select
                      label="Crop aspect ratio"
                      value={cropRatio}
                      onChange={setCropPreset}
                      options={ratios}
                    />
                    <div className="button-row">
                      <button
                        type="button"
                        className="btn small"
                        onClick={() => {
                          const rotation = (settings.rotation + 90) % 360;
                          const size = rotatedSize(entry!.info, rotation);
                          setZoom(1);
                          update({
                            rotation,
                            crop: centeredCrop(
                              size,
                              cropRatio === 'free'
                                ? size.width / size.height
                                : numericRatio(cropRatio),
                            ),
                          });
                        }}
                      >
                        Rotate 90° ↻
                      </button>
                      <span className="fine-print">
                        {settings.rotation}° clockwise
                      </span>
                    </div>
                    <label className="quality-field">
                      <span>
                        Crop zoom<strong>{zoom.toFixed(1)}×</strong>
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step=".1"
                        value={zoom}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setZoom(value);
                          const size = rotatedSize(
                            entry!.info,
                            settings.rotation,
                          );
                          update({
                            crop: centeredCrop(
                              size,
                              cropRatio === 'free'
                                ? size.width / size.height
                                : numericRatio(cropRatio),
                              value,
                            ),
                          });
                        }}
                      />
                    </label>
                    <div className="two-fields">
                      {(['x', 'y', 'width', 'height'] as const).map((key) => (
                        <NumberField
                          key={key}
                          label={`Crop ${key}`}
                          value={settings.crop[key]}
                          min={key === 'x' || key === 'y' ? 0 : 1}
                          onChange={(value) =>
                            update({ crop: { ...settings.crop, [key]: value } })
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
                {isRatio && (
                  <>
                    <Select
                      label="Aspect ratio"
                      value={ratio}
                      onChange={setRatioPreset}
                      options={[
                        ['1:1', '1:1 · Square'],
                        ['4:5', '4:5 · Portrait'],
                        ['3:2', '3:2 · Photo'],
                        ['4:3', '4:3 · Classic'],
                        ['16:9', '16:9 · Wide'],
                        ['9:16', '9:16 · Vertical'],
                        ['custom', 'Custom ratio'],
                      ]}
                    />
                    {ratio === 'custom' && (
                      <div className="two-fields">
                        <NumberField
                          label="Ratio width"
                          value={customRatio.width}
                          onChange={(width) => {
                            setCustomRatio((r) => ({ ...r, width }));
                            update({
                              height: Math.round(
                                (settings.width * customRatio.height) / width,
                              ),
                            });
                          }}
                        />
                        <NumberField
                          label="Ratio height"
                          value={customRatio.height}
                          onChange={(height) => {
                            setCustomRatio((r) => ({ ...r, height }));
                            update({
                              height: Math.round(
                                (settings.width * height) / customRatio.width,
                              ),
                            });
                          }}
                        />
                      </div>
                    )}
                    <NumberField
                      label="Output width"
                      value={settings.width}
                      onChange={(width) =>
                        update({
                          width,
                          height: Math.max(1, Math.round(width / ratioValue)),
                        })
                      }
                    />
                    <p className="fine-print">
                      Result canvas: {settings.width} × {settings.height}{' '}
                      pixels.
                    </p>
                  </>
                )}
                {isSocial && (
                  <>
                    <Select
                      label="Platform"
                      value={socialPresets[socialIndex]!.platform}
                      onChange={(platform) => {
                        const index = socialPresets.findIndex(
                          (p) => p.platform === platform,
                        );
                        setSocialIndex(index);
                        update({
                          width: socialPresets[index]!.width,
                          height: socialPresets[index]!.height,
                        });
                      }}
                      options={[
                        ...new Set(socialPresets.map((p) => p.platform)),
                      ].map((p) => [p, p])}
                    />
                    <Select
                      label="Placement"
                      value={String(socialIndex)}
                      onChange={(v) => {
                        const index = Number(v);
                        setSocialIndex(index);
                        update({
                          width: socialPresets[index]!.width,
                          height: socialPresets[index]!.height,
                        });
                      }}
                      options={socialPresets.flatMap((p, i) =>
                        p.platform === socialPresets[socialIndex]!.platform
                          ? [
                              [
                                String(i),
                                `${p.name} · ${p.width} × ${p.height}`,
                              ] as [string, string],
                            ]
                          : [],
                      )}
                    />
                    <p className="preset-note">
                      {socialPresets[socialIndex]!.verified
                        ? 'Official recommendation verified'
                        : 'General-purpose starting size; verify placement rules.'}
                      <br />
                      Reviewed {reviewed}
                      {socialPresets[socialIndex]!.source && (
                        <a
                          href={socialPresets[socialIndex]!.source}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Official source ↗
                        </a>
                      )}
                    </p>
                  </>
                )}
                {(isRatio || isSocial) && (
                  <>
                    <Select
                      label="Adjustment mode"
                      value={settings.fit}
                      onChange={(fit) =>
                        update({ fit: fit as ImageSettings['fit'] })
                      }
                      options={
                        isSocial
                          ? [
                              ['crop', 'Crop · fill canvas, trim edges'],
                              ['fit', 'Fit · keep whole image, add padding'],
                            ]
                          : [
                              ['crop', 'Crop · fill canvas, trim edges'],
                              ['fit', 'Fit · keep whole image, add padding'],
                              ['stretch', 'Stretch · may distort image'],
                            ]
                      }
                    />
                    {settings.fit === 'stretch' && (
                      <p className="inline-warning">
                        Stretching changes proportions and may distort the
                        image.
                      </p>
                    )}
                  </>
                )}
                {!isMetadata && (
                  <>
                    {fixedFormats[id] ? (
                      <div className="format-label">
                        OUTPUT FORMAT{' '}
                        <strong>
                          {fixedFormats[id]!.split('/')[1]!.toUpperCase()}
                        </strong>
                      </div>
                    ) : (
                      <FormatSelector
                        value={settings.format}
                        onChange={(format) => update({ format })}
                      />
                    )}
                    <QualitySlider
                      quality={settings.quality}
                      onChange={(quality) => update({ quality })}
                      disabled={settings.format === 'image/png'}
                    />
                    {isCompress && (
                      <p className="fine-print">
                        Mode floor:{' '}
                        {Math.round(
                          compressionPolicy(settings.mode).minimumQuality * 100,
                        )}
                        %. Effective quality ceiling:{' '}
                        {Math.round(
                          Math.max(
                            settings.quality,
                            compressionPolicy(settings.mode).minimumQuality,
                          ) * 100,
                        )}
                        %.
                      </p>
                    )}
                    <BackgroundColorPicker
                      value={settings.background}
                      onChange={(background) => update({ background })}
                    />
                    {settings.format !== 'image/jpeg' ? (
                      <Check
                        label="Preserve alpha / use transparent padding"
                        checked={settings.transparent}
                        onChange={(transparent) => update({ transparent })}
                      />
                    ) : (
                      <p className="inline-warning">
                        JPG has no transparency. Transparent pixels use the
                        selected background.
                      </p>
                    )}
                  </>
                )}
                {isMetadata && (
                  <div className="metadata-intro">
                    <span aria-hidden="true">◈</span>
                    <h3>The details behind the picture.</h3>
                    <p>
                      Read available EXIF fields and inspect the file without
                      sending it anywhere.
                    </p>
                    <p>
                      Missing fields will say “Unavailable”. Location data is
                      hidden until you choose to reveal it.
                    </p>
                  </div>
                )}
              </fieldset>
              <div className="process-controls">
                <button
                  type="button"
                  className="btn primary process-button"
                  disabled={busy || zipBusy || !entry}
                  onClick={() => void run()}
                >
                  {busy
                    ? 'Working locally…'
                    : `${actionLabel}${entries.length > 1 ? `s (${entries.length})` : ''}`}
                  <span aria-hidden="true">→</span>
                </button>
                {isMetadata && (
                  <button
                    className="btn"
                    disabled={busy}
                    onClick={() => void run(true)}
                  >
                    Re-encode PNG without original EXIF
                  </button>
                )}
                {busy && (
                  <button
                    className="btn small"
                    onClick={() => controller.current?.abort()}
                  >
                    Cancel processing
                  </button>
                )}
                <span className="local-label">
                  <span></span> Only your browser does the work.
                </span>
              </div>
            </section>
            <section className="preview-panel">
              <div className="preview-heading">
                <h2>
                  <b>03</b> See the difference
                </h2>
                <span>{isCrop ? 'INTERACTIVE CROP' : 'IMAGE PREVIEW'}</span>
              </div>
              {isCrop ? (
                <Suspense fallback={<p>Preparing crop controls…</p>}>
                  <CropStage
                    url={entry!.url}
                    size={entry!.info}
                    rotation={settings.rotation}
                    zoom={zoom}
                    rect={settings.crop}
                    onChange={(crop) => update({ crop })}
                    ratio={
                      cropRatio === 'free' ? null : numericRatio(cropRatio)
                    }
                  />
                </Suspense>
              ) : (
                <div className="before-after">
                  <div>
                    <span className="preview-label">ORIGINAL</span>
                    <div className="checkerboard image-frame">
                      <img src={entry!.url} alt="Original selected image" />
                    </div>
                    <div className="preview-stats">
                      <strong>{formatBytes(entry!.file.size)}</strong>
                      <span>
                        {entry!.info.width} × {entry!.info.height} px
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="preview-label">
                      {isMetadata ? 'LOCAL INSPECTION' : 'YOUR RESULT'}
                    </span>
                    <div className="checkerboard image-frame">
                      {entry!.resultUrl ? (
                        <img src={entry!.resultUrl} alt="Processed result" />
                      ) : (
                        <div className="preview-empty">
                          <span aria-hidden="true">
                            {isMetadata ? '◈' : '✧'}
                          </span>
                          <p>
                            {isMetadata
                              ? 'Your metadata will appear below.'
                              : 'A little adjustment goes a long way.'}
                          </p>
                          <small>
                            {isMetadata
                              ? 'Select Inspect metadata to begin.'
                              : 'Choose your settings, then process your image.'}
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="preview-stats">
                      <strong>
                        {output?.blob
                          ? formatBytes(output.blob.size)
                          : 'Your next version'}
                      </strong>
                      <span>
                        {output?.blob
                          ? `${output.width} × ${output.height} px`
                          : 'Ready when you are.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {isCrop && entry!.resultUrl && (
                <div className="crop-result">
                  <h3>
                    Crop result · {output!.width} × {output!.height} px
                  </h3>
                  <div className="checkerboard image-frame">
                    <img src={entry!.resultUrl} alt="Processed result" />
                  </div>
                </div>
              )}
              {output?.blob && (
                <div className="result-summary" data-result>
                  <div>
                    <span className="result-kicker">ACTUAL OUTPUT</span>
                    <strong>
                      {formatBytes(output.blob.size)}
                      <small>
                        {savings(entry!.file.size, output.blob.size) >= 0
                          ? `${savings(entry!.file.size, output.blob.size).toFixed(1)}% smaller`
                          : `${(-savings(entry!.file.size, output.blob.size)).toFixed(1)}% larger`}
                      </small>
                    </strong>
                    <p>
                      {output.blob.size.toLocaleString()} bytes · {output.width}{' '}
                      × {output.height} px ·{' '}
                      {output.blob.type.split('/')[1]!.toUpperCase()}
                      {output.targetAchieved !== undefined && (
                        <span
                          className={
                            output.targetAchieved ? 'goal-met' : 'goal-missed'
                          }
                        >
                          {output.targetAchieved
                            ? 'Target reached'
                            : 'Target not reached'}
                        </span>
                      )}
                    </p>
                  </div>
                  <DownloadButton
                    blob={output.blob}
                    name={outputName(
                      entry!.file.name,
                      output.blob.type as Format,
                    )}
                  />
                </div>
              )}
              {output?.warnings.map((warning, index) => (
                <p className="notice subtle" key={index}>
                  {warning}
                </p>
              ))}
              <div className="preview-footer">
                <span aria-hidden="true">♧</span> No accounts. No server
                transfers. Just your pixels.
              </div>
            </section>
          </div>
        </>
      )}
      {busy && (
        <div className="progress-indicator">
          <progress
            aria-label="Image processing progress"
            max={entries.length || 1}
            value={completed}
          />
        </div>
      )}
      <p role="status" className="processing-status">
        {message}
      </p>
      {error && (
        <p role="alert" className="notice error">
          {error}
        </p>
      )}
      {isMetadata && output?.info.metadata && (
        <Suspense fallback={<p>Preparing metadata table…</p>}>
          <MetadataPanel
            key={`${active}-${entry!.file.size}`}
            info={output.info}
            name={entry!.file.name}
          />
        </Suspense>
      )}
      {successful.length > 1 && (
        <section className="batch-results">
          <div className="section-heading">
            <div>
              <h2>Your images, ready to go.</h2>
              <p>
                {successful.length} real encoded results. ZIP creation also
                happens locally.
              </p>
            </div>
            <button
              className="btn primary"
              disabled={zipBusy || busy}
              onClick={async () => {
                controller.current?.abort();
                const abort = new AbortController();
                controller.current = abort;
                const current = epoch.current;
                setZipBusy(true);
                try {
                  const blob = await buildZip(
                    successful.map((item, index) => ({
                      name: outputName(
                        item.file.name,
                        item.result!.blob!.type as Format,
                        index,
                      ),
                      blob: item.result!.blob!,
                    })),
                    abort.signal,
                  );
                  if (current === epoch.current && !abort.signal.aborted)
                    download(blob, 'pixeltools-images.zip');
                } catch (e) {
                  if (
                    current === epoch.current &&
                    !(e instanceof DOMException && e.name === 'AbortError')
                  )
                    setError(
                      e instanceof Error ? e.message : 'ZIP creation failed.',
                    );
                } finally {
                  if (current === epoch.current) setZipBusy(false);
                }
              }}
            >
              {zipBusy ? 'Creating ZIP…' : 'Download all as ZIP ↓'}
            </button>
          </div>
          {entries.map((item, index) => (
            <div className="batch-result-row" key={index}>
              <div>
                <strong>{item.file.name}</strong>
                <small>
                  {item.error ||
                    (item.result?.blob
                      ? `${formatBytes(item.result.blob.size)} · ${item.result.width} × ${item.result.height} px`
                      : 'No result')}
                </small>
              </div>
              {item.result?.blob && (
                <DownloadButton
                  blob={item.result.blob}
                  name={outputName(
                    item.file.name,
                    item.result.blob.type as Format,
                    index,
                  )}
                >
                  Download
                </DownloadButton>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
