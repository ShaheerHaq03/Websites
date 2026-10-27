import { useState } from 'react';
import CodeEditor from '../editors/CodeEditor';
import {
  useTask,
  Panel,
  EditorToolbar,
  Feedback,
  CopyButton,
  DownloadButton,
  RunButton,
} from './shared';
const samples = {
  email: {
    pattern: '(?<name>[\\w.+-]+)@(?<domain>[\\w.-]+\\.[A-Za-z]{2,})',
    text: 'Contact ada@example.org or lin@dev.tools for a code review.',
    replacement: '$<name> [at] $<domain>',
  },
  digits: {
    pattern: '(\\d+)',
    text: 'Build 1042 passed 98 tests in 12 seconds.',
    replacement: '[$1]',
  },
  hex: {
    pattern: '#(?<hex>[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b',
    text: 'Colors: #2563EB, #FFF, #16A34A',
    replacement: 'color($<hex>)',
  },
};
export default function RegexTool() {
  const [pattern, setPattern] = useState(samples.email.pattern),
    [text, setText] = useState(samples.email.text),
    [replacement, setReplacement] = useState(samples.email.replacement),
    [flags, setFlags] = useState('g');
  const state = useTask();
  const highlighted = () => {
    const parts = [];
    let offset = 0;
    for (const [index, match] of (state.result?.matches || []).entries()) {
      parts.push(
        <span key={`text-${index}`}>{text.slice(offset, match.index)}</span>,
      );
      parts.push(
        <mark
          key={`match-${index}`}
          title={`Match ${index + 1} at ${match.index}`}
        >
          {match.value || '│'}
        </mark>,
      );
      offset = match.index + match.value.length;
    }
    parts.push(<span key="tail">{text.slice(offset)}</span>);
    return parts;
  };
  return (
    <div className="tool-workspace">
      <div className="workspace-toolbar">
        <EditorToolbar
          sample={() => {
            setPattern(samples.email.pattern);
            setText(samples.email.text);
            setReplacement(samples.email.replacement);
            setFlags('g');
            state.reset();
          }}
          clear={() => {
            setPattern('');
            setText('');
            setReplacement('');
            state.reset();
          }}
        />
        <label className="inline-select">
          Common patterns
          <select
            aria-label="Common patterns"
            defaultValue="email"
            onChange={(e) => {
              const sample = samples[e.target.value as keyof typeof samples];
              setPattern(sample.pattern);
              setText(sample.text);
              setReplacement(sample.replacement);
              state.reset();
            }}
          >
            <option value="email">Email extraction</option>
            <option value="digits">Capture numbers</option>
            <option value="hex">Hex colors</option>
          </select>
        </label>
      </div>
      <div className="regex-pattern-row">
        <label className="field">
          JavaScript pattern
          <input
            className="mono-input"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              state.reset();
            }}
            placeholder="(?<name>\\w+)"
          />
        </label>
        <label className="field flags-field">
          Flags
          <input
            className="mono-input"
            value={flags}
            onChange={(e) => {
              setFlags(e.target.value);
              state.reset();
            }}
            placeholder="gim"
          />
        </label>
        <CopyButton text={`/${pattern}/${flags}`} label="Copy pattern" />
      </div>
      <div className="editor-grid">
        <Panel title="Test string" tag="EDITABLE">
          <CodeEditor
            label="Test string"
            value={text}
            onChange={(value) => {
              setText(value);
              state.reset();
            }}
          />
        </Panel>
        <Panel title="Match highlights" tag="RESULT">
          <pre className="match-preview">
            {state.result ? (
              highlighted()
            ) : (
              <span className="muted">
                Run your pattern to see matching text.
              </span>
            )}
          </pre>
        </Panel>
      </div>
      <label className="field replacement-field">
        Replacement text
        <input
          className="mono-input"
          value={replacement}
          onChange={(e) => {
            setReplacement(e.target.value);
            state.reset();
          }}
          placeholder="Use $1 or $<name> for groups"
        />
      </label>
      <div className="action-row">
        <RunButton
          busy={state.busy}
          onClick={() =>
            state.run({
              kind: 'regex',
              input: pattern,
              second: text,
              options: { flags, replacement },
            })
          }
        >
          Test expression
        </RunButton>
        <span className="local-note">
          JavaScript RegExp · 1.5 second worker timeout
        </span>
      </div>
      <Feedback state={state} />
      {state.result && (
        <>
          <Panel title="Captures & positions" tag="UTF-16 OFFSETS">
            <div className="captures">
              {state.result.matches?.length ? (
                state.result.matches.map((match, index) => (
                  <details key={index}>
                    <summary>
                      Match {index + 1} · position {match.index}–
                      {match.index + match.value.length}
                      <code>{match.value || '(empty match)'}</code>
                    </summary>
                    <pre>
                      {JSON.stringify(
                        { numbered: match.groups, named: match.named },
                        null,
                        2,
                      )}
                    </pre>
                  </details>
                ))
              ) : (
                <p className="empty-state">
                  No matches found. Check your pattern, flags, and sample text.
                </p>
              )}
            </div>
          </Panel>
          <Panel
            title="Replacement preview"
            actions={
              <>
                <CopyButton text={state.result.output} />
                <DownloadButton
                  text={state.result.output}
                  filename="replacement.txt"
                />
              </>
            }
          >
            <pre className="match-preview">{state.result.output}</pre>
          </Panel>
        </>
      )}
    </div>
  );
}
