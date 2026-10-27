import { useRef, useState, type ReactNode } from 'react';
import type { Format } from '../../lib/types';
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly (readonly [string, string])[];
}) {
  return (
    <label className="field">
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
export function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 8192,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="field">
      {label}
      <div className="number-field">
        <input
          aria-label={label}
          type="number"
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? 0 : Number(e.target.value))
          }
          min={min}
          max={max}
        />
        <span>px</span>
      </div>
    </label>
  );
}
export function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
export function QualitySlider({
  quality,
  onChange,
  disabled = false,
}: {
  quality: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="quality-field">
      <span>
        Output quality{' '}
        <strong>
          {disabled ? 'PNG · lossless pixels' : `${Math.round(quality * 100)}%`}
        </strong>
      </span>
      <input
        type="range"
        min="10"
        max="100"
        step="1"
        value={Math.round(quality * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        disabled={disabled}
      />
      <small>
        {disabled ? 'Canvas PNG ignores quality settings.' : 'Smaller file'}
        <span>{disabled ? '' : 'Higher quality'}</span>
      </small>
    </label>
  );
}
export function FormatSelector({
  value,
  onChange,
}: {
  value: Format;
  onChange: (format: Format) => void;
}) {
  return (
    <Select
      label="Output format"
      value={value}
      onChange={(v) => onChange(v as Format)}
      options={[
        ['image/jpeg', 'JPG · great for photos'],
        ['image/png', 'PNG · lossless pixel encoding'],
        ['image/webp', 'WebP · modern, lossy encoding'],
      ]}
    />
  );
}
export function BackgroundColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      Background color
      <div className="color-picker">
        <input
          aria-label="Background color"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{value.toUpperCase()}</span>
      </div>
    </label>
  );
}
export function DownloadButton({
  blob,
  name,
  children = 'Download image',
}: {
  blob: Blob;
  name: string;
  children?: ReactNode;
}) {
  return (
    <button
      className="btn primary"
      type="button"
      onClick={() => download(blob, name)}
    >
      {children}
      <span aria-hidden="true">↓</span>
    </button>
  );
}
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
export function CopyButton({
  text,
  label = 'Copy selected',
}: {
  text: string;
  label?: string;
}) {
  const [state, setState] = useState('');
  return (
    <>
      <button
        type="button"
        className="btn small"
        disabled={!text}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState('Copied');
          } catch {
            setState('Copy unavailable. Save the JSON instead.');
          }
        }}
      >
        {state === 'Copied' ? 'Copied!' : label}
      </button>
      <span className="sr-only" role="status">
        {state}
      </span>
    </>
  );
}
export function ImageDropzone({
  onFiles,
  multiple = false,
  accept = '.jpg,.jpeg,.png,.webp',
  compact = false,
  busy = false,
}: {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  compact?: boolean;
  busy?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      className={`dropzone ${compact ? 'compact' : ''} ${drag ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!busy) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (!busy) onFiles([...e.dataTransfer.files]);
      }}
    >
      <input
        ref={ref}
        tabIndex={-1}
        className="sr-only"
        type="file"
        aria-label="Choose image files"
        accept={accept}
        multiple={multiple}
        disabled={busy}
        onChange={(e) => {
          onFiles([...(e.target.files || [])]);
          e.target.value = '';
        }}
      />
      <span className="upload-icon" aria-hidden="true">
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="8" cy="9" r="1.5" />
          <path d="m4 17 5-5 4 4 3-3 5 5" />
          <path d="M17 1v6m-3-3h6" />
        </svg>
      </span>
      <h2>
        {compact ? 'Ready for a new image?' : 'A fresh start for your image.'}
      </h2>
      <p>
        Drop {multiple ? 'images' : 'an image'} here, or choose from your
        device.
      </p>
      <button
        type="button"
        className="btn primary"
        disabled={busy}
        onClick={() => ref.current?.click()}
      >
        Choose {multiple ? 'images' : 'image'} <span aria-hidden="true">↑</span>
      </button>
      <small>
        JPG, PNG, WebP · 20 MB per image{multiple ? ' · up to 10 files' : ''}
      </small>
      <span className="local-label">
        <span></span> Local selection. Nothing is sent to a server.
      </span>
    </div>
  );
}
