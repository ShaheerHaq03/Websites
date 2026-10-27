import { useState } from 'react';
import { generateUuids, validateUuid } from '../../lib/uuid';
import {
  Panel,
  CopyButton,
  DownloadButton,
  Check,
  EditorToolbar,
} from './shared';
export default function UuidTool() {
  const [count, setCount] = useState('5'),
    [uppercase, setUppercase] = useState(false),
    [output, setOutput] = useState(''),
    [error, setError] = useState(''),
    [candidate, setCandidate] = useState('');
  const [validation, setValidation] = useState('');
  const reset = () => {
    setOutput('');
    setError('');
    setCandidate('');
    setValidation('');
  };
  return (
    <div className="tool-workspace">
      <div className="workspace-toolbar">
        <EditorToolbar
          sample={() => {
            setCount('5');
            setCandidate('6d5ea54e-a7df-4a83-9773-594c01714db3');
            setValidation('');
          }}
          clear={reset}
        />
        <span className="local-note">crypto.randomUUID() · UUID v4</span>
      </div>
      <div className="tool-options">
        <label className="field">
          Number of UUIDs
          <input
            type="number"
            min="1"
            max="1000"
            step="1"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </label>
        <Check
          label="Uppercase letters"
          checked={uppercase}
          onChange={setUppercase}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            try {
              setOutput(generateUuids(Number(count), uppercase));
              setError('');
            } catch (e) {
              setError(
                e instanceof Error
                  ? e.message
                  : 'Secure UUID generation is unavailable. Use HTTPS or localhost.',
              );
            }
          }}
        >
          Generate UUIDs <span aria-hidden="true">→</span>
        </button>
      </div>
      {error && (
        <p className="error-panel" role="alert">
          {error}
        </p>
      )}
      <Panel
        title="Generated UUIDs"
        tag="SECURE RANDOM"
        actions={
          <>
            <CopyButton text={output} label="Copy all" />
            <DownloadButton text={output} filename="uuids.txt" />
          </>
        }
      >
        <div className="uuid-list" aria-live="polite">
          {output ? (
            output.split('\n').map((uuid, index) => (
              <div key={index} className="uuid-row">
                <span className="uuid-index">{index + 1}</span>
                <code>{uuid}</code>
                <CopyButton text={uuid} label={`Copy UUID ${index + 1}`} />
              </div>
            ))
          ) : (
            <p className="empty-state">
              Your next identifiers start here. Choose a count and generate.
            </p>
          )}
        </div>
      </Panel>
      <p className="status-message" role="status">
        {output
          ? `${output.split('\n').length} UUIDs generated locally`
          : 'Ready to generate · Maximum 1,000 per batch'}
      </p>
      <section className="validation-box">
        <h2>Validate a UUID v4</h2>
        <p className="muted">
          Check formatting, version bits, and variant. This does not prove
          uniqueness or randomness.
        </p>
        <div className="validation-row">
          <label className="field">
            UUID to validate
            <input
              value={candidate}
              placeholder="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
              onChange={(e) => {
                setCandidate(e.target.value);
                setValidation('');
              }}
            />
          </label>
          <button
            className="btn"
            onClick={() =>
              setValidation(
                validateUuid(candidate)
                  ? 'Valid UUID v4 format'
                  : 'Invalid UUID v4 format',
              )
            }
          >
            Validate UUID
          </button>
        </div>
        <p
          role="status"
          className={
            validation.startsWith('Invalid') ? 'error-panel' : 'success-message'
          }
        >
          {validation}
        </p>
      </section>
    </div>
  );
}
