import { useState } from 'react';
import type { ToolId } from '../../data/tools';
import {
  useTask,
  Panel,
  EditorToolbar,
  OutputPanel,
  Feedback,
  Select,
  RunButton,
  CopyButton,
} from './shared';
const zones: [string, string][] = [
  ['UTC', 'UTC'],
  ['America/New_York', 'America/New_York'],
  ['America/Los_Angeles', 'America/Los_Angeles'],
  ['Europe/London', 'Europe/London'],
  ['Europe/Berlin', 'Europe/Berlin'],
  ['Asia/Karachi', 'Asia/Karachi'],
  ['Asia/Kolkata', 'Asia/Kolkata'],
  ['Asia/Tokyo', 'Asia/Tokyo'],
  ['Australia/Sydney', 'Australia/Sydney'],
];
const presets: [string, string][] = [
  ['*/15 * * * *', 'Every 15 minutes'],
  ['0 * * * *', 'Every hour'],
  ['0 9 * * 1-5', 'Weekdays at 09:00'],
  ['0 0 1 * *', 'First of each month'],
];
export default function TimeTools({ id }: { id: ToolId }) {
  const cron = id === 'cron-expression-builder';
  const initial = cron ? '0 9 * * 1-5' : '1700000000';
  const [input, setInput] = useState(initial),
    [units, setUnits] = useState('seconds'),
    [zone, setZone] = useState('UTC');
  const state = useTask();
  const update = (value: string) => {
    setInput(value);
    state.reset();
  };
  const fields = input.trim().split(/\s+/);
  const changeField = (index: number, value: string) => {
    const next = fields.length === 5 ? [...fields] : ['*', '*', '*', '*', '*'];
    next[index] = value;
    update(next.join(' '));
  };
  return (
    <div className="tool-workspace">
      <div className="workspace-toolbar">
        <EditorToolbar
          sample={() => {
            update(initial);
            setUnits('seconds');
            setZone('UTC');
          }}
          clear={() => update('')}
        />
        <span className="local-note">
          {cron ? 'Numeric five-field cron' : 'Explicit units. No guessing.'}
        </span>
      </div>
      <div className="editor-grid">
        <Panel
          title={cron ? 'Build your schedule' : 'Convert a timestamp'}
          tag="INPUT"
        >
          <div className="form-panel">
            {cron ? (
              <>
                <Select
                  label="Schedule preset"
                  value={
                    presets.some(([value]) => value === input) ? input : ''
                  }
                  onChange={update}
                  options={[['', 'Custom schedule'], ...presets]}
                />
                <div className="cron-fields">
                  {[
                    'Minute',
                    'Hour',
                    'Day of month',
                    'Month',
                    'Day of week',
                  ].map((label, index) => (
                    <label className="field" key={label}>
                      {label}
                      <input
                        aria-label={label}
                        value={fields.length === 5 ? fields[index] : ''}
                        onChange={(e) => changeField(index, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
                <label className="field">
                  Cron expression
                  <input
                    className="mono-input"
                    value={input}
                    onChange={(e) => update(e.target.value)}
                    placeholder="0 9 * * 1-5"
                  />
                </label>
                <CopyButton text={input} label="Copy expression" />
              </>
            ) : (
              <>
                <Select
                  label="Input type"
                  value={units}
                  onChange={(value) => {
                    setUnits(value);
                    state.reset();
                  }}
                  options={[
                    ['seconds', 'Unix seconds'],
                    ['milliseconds', 'Unix milliseconds'],
                    ['date', 'ISO 8601 date with offset'],
                  ]}
                />
                <label className="field">
                  {units === 'date' ? 'ISO date' : 'Unix timestamp'}
                  <input
                    className="mono-input"
                    value={input}
                    onChange={(e) => update(e.target.value)}
                    placeholder={
                      units === 'date' ? '2026-01-15T09:30:00Z' : '1700000000'
                    }
                  />
                </label>
                <button
                  className="btn"
                  onClick={() =>
                    update(
                      units === 'date'
                        ? new Date().toISOString()
                        : String(
                            units === 'seconds'
                              ? Math.floor(Date.now() / 1000)
                              : Date.now(),
                          ),
                    )
                  }
                >
                  Use current timestamp
                </button>
              </>
            )}
            <Select
              label="Display timezone"
              value={zone}
              onChange={(value) => {
                setZone(value);
                state.reset();
              }}
              options={
                zones.some(([value]) => value === zone)
                  ? zones
                  : [...zones, [zone, zone]]
              }
            />
            <button
              className="text-button"
              onClick={() => {
                const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setZone(local);
                state.reset();
              }}
            >
              Use browser timezone
            </button>
            {!zones.some(([value]) => value === zone) && (
              <p className="muted">Browser timezone: {zone}</p>
            )}
          </div>
        </Panel>
        <OutputPanel
          state={state}
          title={cron ? 'Next 5 executions' : 'Converted date'}
          filename={cron ? 'cron-next-runs.txt' : 'timestamp.json'}
          language={cron ? 'text' : 'json'}
        />
      </div>
      <div className="action-row">
        <RunButton
          busy={state.busy}
          onClick={() =>
            state.run({
              kind: cron ? 'cron' : 'timestamp',
              input,
              options: { units, zone },
            })
          }
        >
          {cron ? 'Validate & preview' : 'Convert timestamp'}
        </RunButton>
        <span className="local-note">
          {cron
            ? 'Preview starts after the current instant'
            : 'ISO output is always UTC'}
        </span>
      </div>
      <Feedback state={state} />
      {cron && (
        <p className="inline-help">
          Field order: minute (0–59), hour (0–23), day (1–31), month (1–12),
          weekday (0–7; Sunday 0 or 7). Both restricted day fields use OR
          semantics. No seconds or Quartz extensions.
        </p>
      )}
    </div>
  );
}
