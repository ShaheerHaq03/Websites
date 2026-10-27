import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  keymap,
  drawSelection,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  HighlightStyle,
  syntaxHighlighting,
  bracketMatching,
} from '@codemirror/language';
import { json } from '@codemirror/lang-json';
import { tags } from '@lezer/highlight';

const highlightStyle = HighlightStyle.define([
  { tag: tags.propertyName, color: 'var(--code-key)' },
  { tag: tags.string, color: 'var(--code-string)' },
  { tag: [tags.bool, tags.null], color: 'var(--code-keyword)' },
  { tag: tags.number, color: 'var(--code-number)' },
]);

type Props = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  language?: 'json' | 'text';
  readOnly?: boolean;
  minHeight?: number;
};
export default function CodeEditor({
  label,
  value,
  onChange,
  language = 'text',
  readOnly = false,
  minHeight = 260,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const callback = useRef(onChange);
  const [plain, setPlain] = useState(false);
  useEffect(() => {
    callback.current = onChange;
  }, [onChange]);
  useEffect(() => {
    if (!host.current || plain) return;
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: '',
        extensions: [
          lineNumbers(),
          drawSelection(),
          history(),
          highlightActiveLine(),
          bracketMatching(),
          syntaxHighlighting(highlightStyle),
          ...(language === 'json' ? [json()] : []),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
          EditorView.contentAttributes.of({
            'aria-label': label,
            'aria-multiline': 'true',
            role: 'textbox',
            ...(readOnly ? { 'aria-readonly': 'true' } : {}),
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged)
              callback.current?.(update.state.doc.toString());
          }),
          EditorView.theme({
            '&': {
              backgroundColor: 'var(--editor)',
              color: 'var(--text)',
              fontSize: '13px',
              minHeight: `${minHeight}px`,
            },
            '.cm-content': {
              fontFamily: 'var(--mono)',
              padding: '18px 0',
              minHeight: `${minHeight}px`,
            },
            '.cm-scroller': {
              overflow: 'auto',
              fontFamily: 'var(--mono)',
              maxHeight: '520px',
            },
            '.cm-gutters': {
              backgroundColor: 'var(--editor)',
              color: 'var(--muted)',
              border: 'none',
              paddingRight: '10px',
            },
            '.cm-activeLine, .cm-activeLineGutter': {
              backgroundColor: 'var(--subtle)',
            },
            '.cm-cursor': { borderLeftColor: 'var(--text)' },
            '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
              backgroundColor: 'var(--selection)',
            },
            '&.cm-focused': {
              outline: '2px solid var(--primary)',
              outlineOffset: '-2px',
            },
          }),
        ],
      }),
    });
    editor.scrollDOM.tabIndex = 0;
    editor.scrollDOM.setAttribute('role', 'region');
    editor.scrollDOM.setAttribute('aria-label', `${label} editor viewport`);
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
  }, [plain, language, label, readOnly, minHeight]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      });
  }, [value, plain]);
  return (
    <div className="code-editor">
      <div className="editor-mode">
        <span>{language === 'json' ? 'JSON' : 'PLAIN TEXT'}</span>
        <button
          type="button"
          onClick={() => setPlain(!plain)}
          aria-pressed={plain}
        >
          {plain ? 'Use code editor' : 'Use plain textarea'}
        </button>
      </div>
      {plain ? (
        <textarea
          aria-label={label}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          style={{ minHeight }}
        />
      ) : (
        <div ref={host} />
      )}
    </div>
  );
}
