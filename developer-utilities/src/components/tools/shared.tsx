import {
  useCallback,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  type ReactNode,
} from 'react';
import type { Task, TaskResult } from '../../lib/shared';
import { MAX_BYTES } from '../../lib/shared';
const CodeEditor = lazy(() => import('../editors/CodeEditor'));
export function useTask() {
  const [result, setResult] = useState<TaskResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const active = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = useCallback(() => {
    active.current?.terminate();
    active.current = null;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => cancel, [cancel]);
  const reset = useCallback(() => {
    cancel();
    setResult(null);
    setError('');
    setBusy(false);
  }, [cancel]);
  const run = useCallback(
    (task: Task) => {
      cancel();
      setResult(null);
      setError('');
      setBusy(true);
      if (
        new TextEncoder().encode(task.input).length > MAX_BYTES ||
        new TextEncoder().encode(task.second || '').length > MAX_BYTES
      ) {
        setBusy(false);
        setError('Input exceeds the 1 MB limit.');
        return;
      }
      const worker = new Worker(
        new URL('../../workers/tool.worker.ts', import.meta.url),
        { type: 'module' },
      );
      active.current = worker;
      const finish = () => {
        cancel();
        setBusy(false);
      };
      worker.onmessage = (
        event: MessageEvent<{ result?: TaskResult; error?: string }>,
      ) => {
        setResult(event.data.result || null);
        setError(event.data.error || '');
        finish();
      };
      worker.onerror = () => {
        setError(
          'The worker could not complete the operation. Retry with a smaller input or check browser support.',
        );
        finish();
      };
      timer.current = setTimeout(
        () => {
          setError(
            task.kind === 'regex'
              ? 'Regex timed out after 1.5 seconds. Simplify the pattern or reduce the input.'
              : 'Operation exceeded the 5 second limit. Use a smaller input.',
          );
          finish();
        },
        task.kind === 'regex' ? 1500 : 5000,
      );
      worker.postMessage(task);
    },
    [cancel],
  );
  return { result, error, busy, run, reset, setResult, setError };
}
export type TaskState = ReturnType<typeof useTask>;
export function CopyButton({
  text,
  label = 'Copy output',
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState('');
  return (
    <span className="copy-wrap">
      <button
        className="btn btn-small"
        type="button"
        disabled={!text}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus('Copied');
          } catch {
            setStatus('Select the output to copy manually');
          }
        }}
        aria-label={label}
      >
        <span aria-hidden="true">▢</span>{' '}
        {status === 'Copied' ? 'Copied!' : label}
      </button>
      <span className="sr-only" role="status">
        {status}
      </span>
    </span>
  );
}
export function DownloadButton({
  text,
  filename,
  type = 'text/plain',
}: {
  text: string;
  filename: string;
  type?: string;
}) {
  return (
    <button
      className="btn btn-small"
      disabled={!text}
      type="button"
      onClick={() => {
        const blob = new Blob([text], { type: `${type};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}
    >
      <span aria-hidden="true">↓</span> Download
    </button>
  );
}
export function UploadButton({
  onLoad,
  onError,
  accept = '.json,.csv,.txt',
}: {
  onLoad: (text: string) => void;
  onError: (error: string) => void;
  accept?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        className="btn btn-small"
        type="button"
        onClick={() => input.current?.click()}
      >
        <span aria-hidden="true">↑</span> Open file
      </button>
      <input
        ref={input}
        type="file"
        className="sr-only"
        aria-label="Open local file"
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          if (file.size > MAX_BYTES) {
            onError('File exceeds the 1 MB limit.');
            return;
          }
          try {
            onLoad(await file.text());
          } catch {
            onError('Unable to read this local file.');
          }
        }}
      />
    </>
  );
}
export function EditorToolbar({
  sample,
  clear,
  upload,
  error,
  accept,
}: {
  sample: () => void;
  clear: () => void;
  upload?: (text: string) => void;
  error?: (text: string) => void;
  accept?: string;
}) {
  return (
    <div className="toolbar">
      <button className="btn btn-small" type="button" onClick={sample}>
        Load sample
      </button>
      {upload && (
        <UploadButton
          onLoad={upload}
          onError={error || (() => {})}
          accept={accept}
        />
      )}
      <button className="btn btn-small btn-quiet" type="button" onClick={clear}>
        Clear
      </button>
    </div>
  );
}
export function Panel({
  title,
  tag,
  children,
  actions,
}: {
  title: string;
  tag?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        {tag && <span className="panel-tag">{tag}</span>}
        {actions && <div className="panel-actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
export function Feedback({ state }: { state: TaskState }) {
  return (
    <div aria-live="polite" className="feedback">
      {state.busy && <p className="status-message">Processing locally…</p>}
      {state.error && (
        <p className="error-panel" role="alert">
          {state.error}
        </p>
      )}
      {state.result?.message && (
        <p className="success-message">
          <span aria-hidden="true">✓</span> {state.result.message}
        </p>
      )}
      {state.result?.warnings?.map((warning, index) => (
        <p className="warning-panel" key={index}>
          {warning}
        </p>
      ))}
    </div>
  );
}
export function OutputPanel({
  state,
  filename = 'output.json',
  title = 'Output',
  language = 'json',
}: {
  state: TaskState;
  filename?: string;
  title?: string;
  language?: 'json' | 'text';
}) {
  return (
    <Panel
      title={title}
      tag="READ ONLY"
      actions={
        <>
          <CopyButton text={state.result?.output || ''} />
          <DownloadButton
            text={state.result?.output || ''}
            filename={filename}
          />
        </>
      }
    >
      <Suspense
        fallback={
          <pre className="match-preview">
            {state.result?.output || 'Preparing output editor…'}
          </pre>
        }
      >
        <CodeEditor
          label={title}
          value={state.result?.output || ''}
          readOnly
          language={language}
        />
      </Suspense>
    </Panel>
  );
}
export function TablePreview({ table }: { table?: string[][] }) {
  if (!table?.length) return null;
  return (
    <div className="table-preview">
      <h3>
        Table preview <span>First 20 records</span>
      </h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {table[0]!.map((cell, index) => (
                <th key={index} scope="col">
                  {cell || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="field">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([value, title]) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </select>
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
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
export function RunButton({
  busy,
  children,
  onClick,
}: {
  busy: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      disabled={busy}
    >
      {busy ? 'Processing…' : children}
      <span aria-hidden="true">→</span>
    </button>
  );
}
export function SizeIndicator({ value }: { value: string }) {
  return (
    <span className="size-indicator">
      {new TextEncoder().encode(value).length.toLocaleString()} bytes · 1 MB
      limit
    </span>
  );
}
