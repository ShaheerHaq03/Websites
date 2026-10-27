import { useState } from 'react';
import type { ImageInfo } from '../../lib/types';
import { ratioLabel, formatBytes } from '../../lib/math';
import { CopyButton, download } from './controls';
export default function MetadataPanel({
  info,
  name,
}: {
  info: ImageInfo;
  name: string;
}) {
  const [showGps, setShowGps] = useState(false);
  const [selected, setSelected] = useState([
    'Filename',
    'Format',
    'Dimensions',
    'File size',
    'Aspect ratio',
  ]);
  const rows: Record<string, string | number | boolean | null> = {
    Filename: name,
    Format: info.format,
    Dimensions: `${info.width} × ${info.height} px`,
    'File size': formatBytes(info.size),
    'Aspect ratio': ratioLabel(info),
    'Bit depth': info.bitDepth ?? null,
    'Original alpha channel': info.alpha ?? null,
    ...info.metadata,
  };
  const data = Object.fromEntries(
    Object.entries(rows).filter(([key]) => selected.includes(key)),
  );
  const text = JSON.stringify(data, null, 2);
  const hasGps =
    (rows.latitude !== null && rows.latitude !== undefined) ||
    (rows.longitude !== null && rows.longitude !== undefined);
  return (
    <section className="metadata-panel">
      <div className="section-heading">
        <div>
          <h2>What’s in this image?</h2>
          <p>
            Check the fields you want to copy or save. Unavailable values are
            never inferred.
          </p>
        </div>
        <div className="button-row">
          <CopyButton text={text} />
          <button
            className="btn small"
            onClick={() =>
              download(
                new Blob([text], { type: 'application/json' }),
                'pixeltools-metadata.json',
              )
            }
          >
            Save selected JSON ↓
          </button>
        </div>
      </div>
      {hasGps && (
        <div className="notice warning">
          <strong>Location metadata is present.</strong>
          <button
            className="text-button"
            onClick={() => {
              if (showGps)
                setSelected((keys) =>
                  keys.filter(
                    (key) =>
                      !['latitude', 'longitude', 'GPSAltitude'].includes(key),
                  ),
                );
              setShowGps(!showGps);
            }}
          >
            {showGps ? 'Hide GPS fields' : 'Reveal GPS fields'}
          </button>
        </div>
      )}
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Image metadata"
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Include</th>
              <th scope="col">Field</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rows)
              .filter(
                ([key]) =>
                  showGps ||
                  !['latitude', 'longitude', 'GPSAltitude'].includes(key),
              )
              .map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <input
                      aria-label={`Include ${key}`}
                      type="checkbox"
                      checked={selected.includes(key)}
                      onChange={(e) =>
                        setSelected((values) =>
                          e.target.checked
                            ? [...values, key]
                            : values.filter((v) => v !== key),
                        )
                      }
                    />
                  </td>
                  <th scope="row">{key}</th>
                  <td>
                    {value === null || value === undefined ? (
                      <span className="muted">Unavailable</span>
                    ) : (
                      String(value)
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="fine-print">
        Capture timestamps may not include a timezone. Color-space and EXIF
        interpretation depend on the source format and parser. GPS is never
        turned into a map link.
      </p>
    </section>
  );
}
