import { useState } from 'react';
import type { ToolId } from '../../data/tools';
import { editUrl } from '../../lib/encoding';
import CodeEditor from '../editors/CodeEditor';
import {
  useTask,
  Panel,
  EditorToolbar,
  OutputPanel,
  Feedback,
  Select,
  Check,
  RunButton,
  SizeIndicator,
} from './shared';
const jwtSample =
  'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJkZW1vLXVzZXIiLCJuYW1lIjoiQWRhIExvdmVsYWNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.';
export default function EncodingTools({ id }: { id: ToolId }) {
  const jwt = id === 'jwt-decoder',
    urlTool = id === 'url-encoder-decoder';
  const initial = jwt
    ? jwtSample
    : urlTool
      ? 'https://example.org/search?q=hello+world&tag=tools&tag=web#results'
      : 'Hello, 世界 👋';
  const [input, setInput] = useState(initial),
    [url, setUrl] = useState(false),
    [mode, setMode] = useState('component');
  const [parameters, setParameters] = useState<[string, string][]>([]);
  const [inspected, setInspected] = useState('');
  const state = useTask();
  const update = (text: string) => {
    setInput(text);
    setInspected('');
    setParameters([]);
    state.reset();
  };
  const run = (action: string) => {
    setInspected('');
    state.run({
      kind: jwt ? 'jwt' : urlTool ? `url-${action}` : `base64-${action}`,
      input,
      options: { url, mode },
    });
  };
  const query = state.result?.parameters;
  const editing = inspected === input ? parameters : query || [];
  return (
    <div className="tool-workspace">
      {jwt && (
        <div className="security-notice">
          <strong>Decoded only. Signature has not been verified.</strong>
          <p>
            Use demonstration or disposable development tokens. Avoid production
            authentication secrets.
          </p>
        </div>
      )}
      <div className="workspace-toolbar">
        <EditorToolbar
          sample={() => update(initial)}
          clear={() => update('')}
        />
        <SizeIndicator value={input} />
      </div>
      {!jwt && (
        <div className="tool-options">
          {urlTool ? (
            <Select
              label="Encoding mode"
              value={mode}
              onChange={setMode}
              options={[
                ['component', 'URL component · encodeURIComponent'],
                ['uri', 'Full URI · encodeURI'],
                ['form', 'Form query · spaces as +'],
              ]}
            />
          ) : (
            <Check
              label="Use Base64URL alphabet (URL-safe, no output padding)"
              checked={url}
              onChange={setUrl}
            />
          )}
        </div>
      )}
      <div className="editor-grid">
        <Panel title={jwt ? 'JWT input' : 'Input'} tag="EDITABLE">
          <CodeEditor
            label={jwt ? 'JWT input' : 'Input'}
            value={input}
            onChange={update}
            minHeight={jwt ? 310 : 260}
          />
        </Panel>
        <OutputPanel
          state={state}
          title={jwt ? 'Decoded token' : 'Output'}
          filename={jwt ? 'decoded-token.json' : 'output.txt'}
          language={jwt ? 'json' : 'text'}
        />
      </div>
      <div className="action-row">
        <RunButton busy={state.busy} onClick={() => run('encode')}>
          {jwt ? 'Decode JWT' : 'Encode'}
        </RunButton>
        {!jwt && (
          <>
            <button
              className="btn"
              disabled={state.busy}
              onClick={() => run('decode')}
            >
              Decode
            </button>
            {urlTool ? (
              <button
                className="btn"
                disabled={state.busy}
                onClick={() => run('inspect')}
              >
                Inspect URL
              </button>
            ) : (
              <button
                className="btn"
                disabled={!state.result?.output}
                onClick={() => update(state.result?.output || '')}
              >
                Swap input / output
              </button>
            )}
          </>
        )}
        <span className="local-note">◇ No data leaves this tool</span>
      </div>
      <Feedback state={state} />
      {urlTool && query && (
        <section className="query-editor">
          <div className="section-heading">
            <h2>Query parameters</h2>
            <button
              className="btn btn-small"
              onClick={() => {
                setInspected(input);
                setParameters([...editing, ['', '']]);
              }}
            >
              Add parameter
            </button>
          </div>
          <p className="muted">
            Repeated keys are preserved. Rebuilding uses form query encoding and
            never fetches the URL.
          </p>
          {editing.map(([key, value], index) => (
            <div className="query-row" key={index}>
              <label className="field">
                Key {index + 1}
                <input
                  value={key}
                  onChange={(e) => {
                    const next = [...editing] as [string, string][];
                    next[index] = [e.target.value, value];
                    setInspected(input);
                    setParameters(next);
                  }}
                />
              </label>
              <label className="field">
                Value {index + 1}
                <input
                  value={value}
                  onChange={(e) => {
                    const next = [...editing] as [string, string][];
                    next[index] = [key, e.target.value];
                    setInspected(input);
                    setParameters(next);
                  }}
                />
              </label>
              <button
                className="btn btn-small"
                aria-label={`Remove parameter ${index + 1}`}
                onClick={() => {
                  setInspected(input);
                  setParameters(editing.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-primary"
            onClick={() => {
              try {
                state.setResult({
                  ...state.result!,
                  output: editUrl(input, editing),
                  message: 'URL rebuilt locally · Not fetched',
                });
              } catch {
                state.setError('Unable to rebuild this URL.');
              }
            }}
          >
            Rebuild URL
          </button>
        </section>
      )}
    </div>
  );
}
