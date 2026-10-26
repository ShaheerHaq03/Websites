import { useId, useState, type ReactNode } from 'react';
export function NumericInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 'any',
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  help?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={help ? `${id}-help` : undefined}
      />
      {help && <small id={`${id}-help`}>{help}</small>}
    </div>
  );
}
export function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export function TextInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'date';
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <div className="error-message" role="alert">
      <strong>Let’s check those inputs</strong>
      <p>{message}</p>
    </div>
  ) : null;
}
export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="button button-quiet" onClick={onClick}>
      Reset
    </button>
  );
}
export function CopyResultButton({ text, onCopied }: { text: string; onCopied?: () => void }) {
  const [status, setStatus] = useState('');
  return (
    <>
      <button
        type="button"
        className="button copy-button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus('Copied to clipboard');
            onCopied?.();
          } catch {
            setStatus('Copy unavailable. Select the result text to copy it.');
          }
        }}
      >
        Copy result <span aria-hidden="true">↗</span>
      </button>
      <span className="copy-status" role="status">
        {status}
      </span>
    </>
  );
}
export interface ResultSummary {
  value: string;
  label: string;
  detail: string;
  stats?: { label: string; value: string }[];
  warning?: boolean;
  extra?: ReactNode;
}
export function ResultPanel({
  result,
  onCopied,
}: {
  result: ResultSummary | null;
  onCopied: () => void;
}) {
  return (
    <aside
      className={`result-panel ${result?.warning ? 'result-warning' : ''}`}
      aria-label="Calculation result"
    >
      <div className="eyebrow">
        <span className="status-dot" /> YOUR RESULT
      </div>
      <div aria-live="polite" aria-atomic="true">
        {result ? (
          <>
            <div className="result-number">{result.value}</div>
            <h3>{result.label}</h3>
            <p>{result.detail}</p>
            {result.stats && (
              <dl className="result-stats">
                {result.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        ) : (
          <div className="empty-result">
            <div className="result-symbol" aria-hidden="true" aria-hidden="true">
              ∑
            </div>
            <h3>A little clarity starts here.</h3>
            <p>Enter your details and calculate to see your result, with the math explained.</p>
          </div>
        )}
      </div>
      {result && (
        <CopyResultButton
          text={`${result.label}: ${result.value}\n${result.detail}\n${result.stats?.map((s) => `${s.label}: ${s.value}`).join('\n') || ''}`}
          onCopied={onCopied}
        />
      )}
      <div className="private-note">
        <span aria-hidden="true">◇</span> Calculated on your device. Never uploaded.
      </div>
    </aside>
  );
}
export function CalculatorCard({
  children,
  result,
  onCopied,
}: {
  children: ReactNode;
  result: ResultSummary | null;
  onCopied: () => void;
}) {
  return (
    <div className="calculator-card">
      <div className="calculator-fields">{children}</div>
      <ResultPanel result={result} onCopied={onCopied} />
    </div>
  );
}
export function DynamicRows({
  children,
  onAdd,
  label,
}: {
  children: ReactNode;
  onAdd: () => void;
  label: string;
}) {
  return (
    <div className="dynamic-rows">
      {children}
      <button type="button" className="add-row" onClick={onAdd}>
        <span aria-hidden="true">＋</span> {label}
      </button>
    </div>
  );
}
