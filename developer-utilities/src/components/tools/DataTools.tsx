import { useState } from 'react';
import type { ToolId } from '../../data/tools';
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
  TablePreview,
  SizeIndicator,
  CopyButton,
  DownloadButton,
} from './shared';
const jsonSample =
  '{\n  "name": "Ada Lovelace",\n  "role": "Developer",\n  "active": true,\n  "skills": ["JavaScript", "TypeScript"],\n  "projects": 12\n}';
const records =
  '[\n  {"name": "Ada", "email": "ada@example.org", "location": {"city": "London"}},\n  {"name": "Lin", "email": "lin@example.org", "location": {"city": "Taipei"}}\n]';
const csvSample =
  'name,email,note\nAda,ada@example.org,"Hello, world"\nLin,lin@example.org,"Build things that matter"';
export default function DataTools({ id }: { id: ToolId }) {
  const diff = id === 'json-diff',
    toCsv = id === 'json-to-csv',
    fromCsv = id === 'csv-to-json';
  const initial = fromCsv ? csvSample : toCsv ? records : jsonSample;
  const [input, setInput] = useState(initial),
    [second, setSecond] = useState(
      jsonSample
        .replace('12', '14')
        .replace('"active": true', '"active": false'),
    );
  const [indent, setIndent] = useState('2'),
    [delimiter, setDelimiter] = useState(','),
    [separator, setSeparator] = useState('.');
  const [ignoreProperties, setIgnoreProperties] = useState(true),
    [ignoreArrays, setIgnoreArrays] = useState(false),
    [headers, setHeaders] = useState(true),
    [trim, setTrim] = useState(false),
    [safeFormulas, setSafeFormulas] = useState(true);
  const state = useTask();
  const update = (text: string) => {
    setInput(text);
    state.reset();
  };
  const sample = () => {
    update(initial);
    setSecond(
      jsonSample
        .replace('12', '14')
        .replace('"active": true', '"active": false'),
    );
  };
  const run = (kind: string) =>
    state.run({
      kind,
      input,
      second,
      options: {
        indent,
        delimiter,
        separator,
        ignoreProperties,
        ignoreArrays,
        headers,
        trim,
        safeFormulas,
      },
    });
  return (
    <div className="tool-workspace">
      <div className="workspace-toolbar">
        <EditorToolbar
          sample={sample}
          clear={() => {
            update('');
            setSecond('');
          }}
          upload={update}
          error={state.setError}
          accept={fromCsv ? '.csv,.txt' : '.json,.txt'}
        />
        <SizeIndicator value={input} />
      </div>
      <div className="tool-options">
        {!toCsv && !diff && (
          <Select
            label="Indentation"
            value={indent}
            onChange={setIndent}
            options={
              fromCsv
                ? [
                    ['2', '2 spaces'],
                    ['4', '4 spaces'],
                  ]
                : [
                    ['2', '2 spaces'],
                    ['4', '4 spaces'],
                    ['tab', 'Tab'],
                  ]
            }
          />
        )}
        {(toCsv || fromCsv) && (
          <Select
            label="Delimiter"
            value={delimiter}
            onChange={setDelimiter}
            options={[
              [',', 'Comma ,'],
              [';', 'Semicolon ;'],
              ['\t', 'Tab'],
              ['|', 'Pipe |'],
            ]}
          />
        )}
        {toCsv && (
          <>
            <label className="field">
              Flattening separator
              <input
                value={separator}
                maxLength={5}
                onChange={(e) => setSeparator(e.target.value)}
              />
            </label>
            <Check
              label="Protect spreadsheet formulas"
              checked={safeFormulas}
              onChange={setSafeFormulas}
            />
          </>
        )}
        {fromCsv && (
          <>
            <Check
              label="First row is a header"
              checked={headers}
              onChange={setHeaders}
            />
            <Check label="Trim whitespace" checked={trim} onChange={setTrim} />
          </>
        )}
        {diff && (
          <>
            <Check
              label="Ignore property order"
              checked={ignoreProperties}
              onChange={setIgnoreProperties}
            />
            <Check
              label="Ignore array order (preserve duplicates)"
              checked={ignoreArrays}
              onChange={setIgnoreArrays}
            />
          </>
        )}
      </div>
      <div className="editor-grid">
        <Panel
          title={diff ? 'Original JSON' : fromCsv ? 'CSV input' : 'JSON input'}
          tag="EDITABLE"
        >
          <CodeEditor
            label={
              diff ? 'Original JSON' : fromCsv ? 'CSV input' : 'JSON input'
            }
            value={input}
            onChange={update}
            language={fromCsv ? 'text' : 'json'}
          />
        </Panel>
        {diff ? (
          <Panel title="Updated JSON" tag="EDITABLE">
            <CodeEditor
              label="Updated JSON"
              value={second}
              onChange={(text) => {
                setSecond(text);
                state.reset();
              }}
              language="json"
            />
          </Panel>
        ) : (
          <OutputPanel
            state={state}
            filename={toCsv ? 'converted.csv' : 'formatted.json'}
            language={toCsv ? 'text' : 'json'}
          />
        )}
      </div>
      <div className="action-row">
        <RunButton
          busy={state.busy}
          onClick={() =>
            run(
              diff
                ? 'json-diff'
                : toCsv
                  ? 'json-to-csv'
                  : fromCsv
                    ? 'csv-to-json'
                    : 'json-format',
            )
          }
        >
          {diff
            ? 'Compare JSON'
            : toCsv
              ? 'Convert to CSV'
              : fromCsv
                ? 'Convert to JSON'
                : 'Format JSON'}
        </RunButton>
        {!diff && !toCsv && !fromCsv && (
          <>
            <button
              className="btn"
              onClick={() => run('json-minify')}
              disabled={state.busy}
            >
              Minify
            </button>
            <button
              className="btn"
              onClick={() => run('json-validate')}
              disabled={state.busy}
            >
              Validate
            </button>
          </>
        )}
        <span className="local-note">
          <span aria-hidden="true">◇</span> Processed in your browser
        </span>
      </div>
      <Feedback state={state} />
      {diff && state.result && (
        <section className="diff-results">
          <div className="section-heading">
            <h2>Structural differences</h2>
            <div className="toolbar">
              <CopyButton text={state.result.output} label="Copy differences" />
              <DownloadButton
                text={state.result.output}
                filename="differences.json"
              />
            </div>
          </div>
          {!state.result.changes?.length ? (
            <p className="empty-state">
              No differences. These documents match with the selected options.
            </p>
          ) : (
            state.result.changes?.map((change, index) => (
              <details className={`diff-change ${change.type}`} key={index}>
                <summary>
                  <span className="change-type">{change.type}</span>
                  <code>{change.path}</code>
                </summary>
                <div className="diff-values">
                  {change.before !== undefined && (
                    <div>
                      <h3>Before</h3>
                      <pre>{JSON.stringify(change.before, null, 2)}</pre>
                    </div>
                  )}
                  {change.after !== undefined && (
                    <div>
                      <h3>After</h3>
                      <pre>{JSON.stringify(change.after, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </details>
            ))
          )}
        </section>
      )}
      <TablePreview table={state.result?.table} />
    </div>
  );
}
