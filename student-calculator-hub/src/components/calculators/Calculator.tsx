import { useEffect, useState, type SubmitEvent, type ReactNode } from 'react';
import { type CalculatorId } from '../../data/calculators';
import * as calc from '../../lib/calculations';
import { track } from '../../lib/analytics';
import {
  CalculatorCard,
  DynamicRows,
  NumericInput,
  SelectInput,
  TextInput,
  ErrorMessage,
  ResetButton,
  type ResultSummary,
} from '../ui/CalculatorUI';
const n = (value: string) => (value.trim() === '' ? NaN : Number(value));
function useCalculation(slug: string) {
  const [result, setResult] = useState<ResultSummary | null>(null),
    [error, setError] = useState('');
  useEffect(() => {
    track('calculator_viewed', slug);
  }, [slug]);
  const clear = () => {
    setResult(null);
    setError('');
  };
  const run = (event: SubmitEvent, compute: () => ResultSummary) => {
    event.preventDefault();
    try {
      setResult(compute());
      setError('');
      track('calculator_used', slug);
    } catch (error) {
      setResult(null);
      setError(error instanceof Error ? error.message : 'Please check your inputs.');
      track('validation_failed', slug);
    }
  };
  return { result, error, clear, run };
}
function Actions({ onReset, label = 'Calculate result' }: { onReset: () => void; label?: string }) {
  return (
    <div className="form-actions">
      <button className="button button-primary" type="submit">
        {label} <span aria-hidden="true">↗</span>
      </button>
      <ResetButton onClick={onReset} />
    </div>
  );
}
interface BaseProps {
  slug: string;
  onReset: () => void;
}
function FormShell({
  state,
  children,
  onSubmit,
  slug,
  onReset,
  label,
}: {
  state: ReturnType<typeof useCalculation>;
  children: ReactNode;
  onSubmit: (e: SubmitEvent) => void;
  slug: string;
  onReset: () => void;
  label?: string;
}) {
  return (
    <CalculatorCard result={state.result} onCopied={() => track('result_copied', slug)}>
      <form noValidate onSubmit={onSubmit} onChange={state.clear}>
        {children}
        <ErrorMessage message={state.error} />
        <Actions onReset={onReset} label={label} />
      </form>
    </CalculatorCard>
  );
}
function GpaCalculator({ slug, onReset, planner = false }: { planner?: boolean } & BaseProps) {
  const [rows, setRows] = useState([
    { name: 'Mathematics', credits: '3', grade: 'A' },
    { name: 'English', credits: '3', grade: 'B' },
    { name: 'Biology', credits: '3', grade: 'B' },
  ]);
  const [scale, setScale] = useState(
      Object.fromEntries(Object.entries(calc.defaultScale).map(([k, v]) => [k, String(v)])),
    ),
    [maximum, setMaximum] = useState('4');
  const [snapshots, setSnapshots] = useState<
      { name: string; value: string; credits: string; maximum: string }[]
    >([]),
    [scenario, setScenario] = useState('Scenario 1');
  const [newGrade, setNewGrade] = useState('A+');
  const [newPoints, setNewPoints] = useState('4');
  const state = useCalculation(slug);
  function update(index: number, key: 'name' | 'credits' | 'grade', value: string) {
    setRows((old) => old.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }
  return (
    <>
      <FormShell
        state={state}
        slug={slug}
        onReset={onReset}
        label={planner ? 'Calculate projection' : 'Calculate GPA'}
        onSubmit={(e) =>
          state.run(e, () => {
            const fn = planner ? calc.semesterPlanner : calc.gpa;
            const r = fn(
              rows.map((r) => ({ ...r, credits: n(r.credits) })),
              Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, n(v)])),
              n(maximum),
            );
            return {
              value: calc.format(r.gpa),
              label: planner ? 'Projected semester GPA' : 'Your semester GPA',
              detail: `On your configured ${calc.format(r.maximum, 1)} maximum scale. ${planner ? 'A planning scenario, based entirely on your inputs.' : 'Check your institution’s policy for exclusions and rounding.'}`,
              stats: [
                { label: 'Total credits', value: calc.format(r.credits, 1) },
                { label: 'Quality points', value: calc.format(r.points) },
              ],
            };
          })
        }
      >
        <div className="form-heading">
          <h2>{planner ? 'Plan your semester' : 'Your courses'}</h2>
          <span className="tag">Credit-weighted</span>
        </div>
        <p className="form-description">
          Add your {planner ? 'planned' : 'graded'} courses. Higher-credit courses have more
          influence.
        </p>
        <DynamicRows
          label="Add course"
          onAdd={() => {
            state.clear();
            setRows([...rows, { name: '', credits: '3', grade: 'A' }]);
          }}
        >
          {rows.map((r, i) => (
            <fieldset className="dynamic-row" key={i}>
              <legend>Course {i + 1}</legend>
              <div className="course-grid">
                <TextInput
                  label={`Course ${i + 1} name`}
                  value={r.name}
                  onChange={(v) => update(i, 'name', v)}
                />
                <NumericInput
                  label={`Course ${i + 1} credits`}
                  value={r.credits}
                  onChange={(v) => update(i, 'credits', v)}
                />
                <SelectInput
                  label={`Course ${i + 1} grade`}
                  value={r.grade}
                  options={Object.keys(scale).map((grade) => ({ value: grade, label: grade }))}
                  onChange={(v) => update(i, 'grade', v)}
                />
                <button
                  type="button"
                  className="remove-row"
                  aria-label={`Remove course ${i + 1}`}
                  onClick={() => {
                    state.clear();
                    setRows(rows.filter((_, j) => j !== i));
                  }}
                >
                  ×
                </button>
              </div>
            </fieldset>
          ))}
        </DynamicRows>
        <details className="settings">
          <summary>
            Customize grading scale <span aria-hidden="true">＋</span>
          </summary>
          <p>Example US 4.0 scale. Change these values to match your institution.</p>
          <NumericInput label="Maximum GPA" value={maximum} onChange={setMaximum} />
          <div className="scale-grid">
            {Object.entries(scale).map(([grade, value]) => (
              <NumericInput
                key={grade}
                label={`Grade points for ${grade}`}
                value={value}
                onChange={(v) => setScale({ ...scale, [grade]: v })}
              />
            ))}
          </div>
          <div className="fields-grid">
            <TextInput label="Additional grade label" value={newGrade} onChange={setNewGrade} />
            <NumericInput
              label="Additional grade points"
              value={newPoints}
              onChange={setNewPoints}
            />
          </div>
          <button
            type="button"
            className="add-row"
            disabled={!newGrade.trim() || Object.hasOwn(scale, newGrade.trim())}
            onClick={() => {
              state.clear();
              setScale({ ...scale, [newGrade.trim()]: newPoints });
              setNewGrade('');
            }}
          >
            ＋ Add custom grade
          </button>
          <small>Use a unique label, such as A+, and points from your own grading policy.</small>
        </details>
      </FormShell>
      {planner && (
        <section className="scenario-panel">
          <h3>Compare your possibilities</h3>
          <p>
            Calculate a projection, save it, then adjust your courses and calculate again. Snapshots
            clear on reload.
          </p>
          <div className="scenario-actions">
            <TextInput label="Scenario name" value={scenario} onChange={setScenario} />
            <button
              className="button button-outline"
              type="button"
              disabled={!state.result || !scenario.trim()}
              onClick={() => {
                if (state.result) {
                  setSnapshots([
                    ...snapshots,
                    {
                      name: scenario.trim(),
                      value: state.result.value,
                      credits: state.result.stats?.[0]?.value || '',
                      maximum,
                    },
                  ]);
                  setScenario(`Scenario ${snapshots.length + 2}`);
                }
              }}
            >
              Save scenario
            </button>
          </div>
          <div className="scenario-list">
            {snapshots.map((s, i) => (
              <article className="scenario" key={i}>
                <h4>{s.name}</h4>
                <strong>{s.value}</strong>
                <p>
                  {s.credits} credits · {s.maximum} scale
                </p>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setSnapshots(snapshots.filter((_, j) => j !== i))}
                >
                  Remove {s.name}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
function CgpaCalculator({ slug, onReset }: BaseProps) {
  const [rows, setRows] = useState([
      { name: 'Semester 1', gpa: '3.5', credits: '15' },
      { name: 'Semester 2', gpa: '3.8', credits: '12' },
    ]),
    [maximum, setMaximum] = useState('4');
  const state = useCalculation(slug);
  const update = (i: number, k: 'name' | 'gpa' | 'credits', v: string) =>
    setRows(rows.map((r, j) => (i === j ? { ...r, [k]: v } : r)));
  return (
    <FormShell
      state={state}
      slug={slug}
      onReset={onReset}
      label="Calculate CGPA"
      onSubmit={(e) =>
        state.run(e, () => {
          const r = calc.cgpa(
            rows.map((r) => ({ ...r, gpa: n(r.gpa), credits: n(r.credits) })),
            n(maximum),
          );
          return {
            value: calc.format(r.gpa),
            label: 'Your cumulative GPA',
            detail: `A credit-weighted average on your ${r.maximum} maximum scale. All semesters must use the same grading policy.`,
            stats: [
              { label: 'Completed credits', value: calc.format(r.credits, 1) },
              { label: 'Semesters', value: String(rows.length) },
            ],
          };
        })
      }
    >
      <div className="form-heading">
        <h2>Your semesters</h2>
        <span className="tag">All credits count</span>
      </div>
      <NumericInput label="Maximum GPA" value={maximum} onChange={setMaximum} />
      <DynamicRows
        label="Add semester"
        onAdd={() => {
          state.clear();
          setRows([...rows, { name: `Semester ${rows.length + 1}`, gpa: '3', credits: '15' }]);
        }}
      >
        {rows.map((r, i) => (
          <fieldset className="dynamic-row" key={i}>
            <legend>Semester {i + 1}</legend>
            <div className="course-grid">
              <TextInput
                label={`Semester ${i + 1} name`}
                value={r.name}
                onChange={(v) => update(i, 'name', v)}
              />
              <NumericInput
                label={`Semester ${i + 1} GPA`}
                value={r.gpa}
                onChange={(v) => update(i, 'gpa', v)}
              />
              <NumericInput
                label={`Semester ${i + 1} credits`}
                value={r.credits}
                onChange={(v) => update(i, 'credits', v)}
              />
              <button
                type="button"
                className="remove-row"
                aria-label={`Remove semester ${i + 1}`}
                onClick={() => {
                  state.clear();
                  setRows(rows.filter((_, j) => j !== i));
                }}
              >
                ×
              </button>
            </div>
          </fieldset>
        ))}
      </DynamicRows>
    </FormShell>
  );
}
function WeightedCalculator({ slug, onReset }: BaseProps) {
  const [rows, setRows] = useState([
    { name: 'Assignments', score: '80', weight: '30' },
    { name: 'Midterm', score: '90', weight: '20' },
  ]);
  const state = useCalculation(slug);
  const update = (i: number, k: 'name' | 'score' | 'weight', v: string) =>
    setRows(rows.map((r, j) => (i === j ? { ...r, [k]: v } : r)));
  return (
    <FormShell
      state={state}
      slug={slug}
      onReset={onReset}
      label="Calculate weighted grade"
      onSubmit={(e) =>
        state.run(e, () => {
          const r = calc.weightedGrade(
            rows.map((r) => ({ ...r, score: n(r.score), weight: n(r.weight) })),
          );
          return {
            value: `${calc.format(r.normalized)}%`,
            label: 'Completed-work average',
            detail: r.complete
              ? 'Weights total 100%. This is the final course grade for the categories entered.'
              : `Weights total ${calc.format(r.weight, 1)}%, not 100%. This average is normalized only across the categories entered.`,
            stats: [
              { label: 'Course contribution', value: `${calc.format(r.contribution)} points` },
              { label: 'Completed weight', value: `${calc.format(r.weight, 1)}%` },
            ],
          };
        })
      }
    >
      <div className="form-heading">
        <h2>Your grade categories</h2>
        <span className="tag">Syllabus weights</span>
      </div>
      <p className="form-description">
        Enter completed categories. Unentered work is not treated as a zero.
      </p>
      <DynamicRows
        label="Add category"
        onAdd={() => {
          state.clear();
          setRows([...rows, { name: '', score: '80', weight: '10' }]);
        }}
      >
        {rows.map((r, i) => (
          <fieldset className="dynamic-row" key={i}>
            <legend>Category {i + 1}</legend>
            <div className="course-grid">
              <TextInput
                label={`Category ${i + 1} name`}
                value={r.name}
                onChange={(v) => update(i, 'name', v)}
              />
              <NumericInput
                label={`Category ${i + 1} score (%)`}
                value={r.score}
                max={100}
                onChange={(v) => update(i, 'score', v)}
              />
              <NumericInput
                label={`Category ${i + 1} weight (%)`}
                value={r.weight}
                max={100}
                onChange={(v) => update(i, 'weight', v)}
              />
              <button
                type="button"
                className="remove-row"
                aria-label={`Remove category ${i + 1}`}
                onClick={() => {
                  state.clear();
                  setRows(rows.filter((_, j) => j !== i));
                }}
              >
                ×
              </button>
            </div>
          </fieldset>
        ))}
      </DynamicRows>
      <div className="input-note">
        Weight total:{' '}
        <strong>
          {calc.format(
            rows.reduce((s, r) => s + (Number(r.weight) || 0), 0),
            1,
          )}
          %
        </strong>{' '}
        of the full course
      </div>
    </FormShell>
  );
}
interface Field {
  key: string;
  label: string;
  value: string;
  help?: string;
  max?: number;
  step?: number;
}
const fieldSets: Partial<Record<CalculatorId, Field[]>> = {
  final: [
    {
      key: 'current',
      label: 'Current grade (%)',
      value: '80',
      help: 'Your normalized average excluding the final exam.',
      max: 100,
    },
    { key: 'weight', label: 'Final exam weight (%)', value: '30', max: 100 },
    { key: 'target', label: 'Desired final grade (%)', value: '85', max: 100 },
  ],
  attendance: [
    { key: 'attended', label: 'Classes attended', value: '32', step: 1 },
    { key: 'held', label: 'Total classes held', value: '40', step: 1 },
  ],
  required: [
    { key: 'held', label: 'Total classes held', value: '20', step: 1 },
    { key: 'attended', label: 'Classes attended', value: '14', step: 1 },
    { key: 'target', label: 'Required attendance (%)', value: '75', max: 100 },
  ],
  percentage: [
    { key: 'obtained', label: 'Marks obtained', value: '42' },
    { key: 'total', label: 'Total possible marks', value: '50' },
  ],
  assignment: [
    {
      key: 'current',
      label: 'Current course contribution (points)',
      value: '45',
      help: 'Earned percentage points before this assignment, not your current average.',
      max: 100,
    },
    { key: 'weight', label: 'Assignment weight (%)', value: '20', max: 100 },
    { key: 'obtained', label: 'Assignment marks obtained', value: '36' },
    { key: 'total', label: 'Total assignment marks', value: '40' },
  ],
  improvement: [
    {
      key: 'current',
      label: 'Current grade (%)',
      value: '70',
      help: 'Your normalized average on completed work.',
      max: 100,
    },
    { key: 'completed', label: 'Completed course weight (%)', value: '60', max: 100 },
    { key: 'remaining', label: 'Remaining course weight (%)', value: '40', max: 100 },
    { key: 'target', label: 'Desired final grade (%)', value: '80', max: 100 },
  ],
  converter: [
    { key: 'value', label: 'Score', value: '36' },
    { key: 'original', label: 'Original total marks', value: '48' },
    { key: 'targetTotal', label: 'Target total marks', value: '20' },
  ],
};
function BoundarySettings({
  enabled,
  setEnabled,
  value,
  setValue,
}: {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="boundary-settings">
      <label className="checkbox-label">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />{' '}
        Apply custom letter-grade boundaries
      </label>
      {enabled && (
        <label className="field">
          Grade boundaries
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            aria-label="Grade boundaries"
          />
          <small>One label:minimum percentage per line. Example only; use your own policy.</small>
        </label>
      )}
    </div>
  );
}
function boundaries(enabled: boolean, text: string): calc.Boundary[] {
  if (!enabled) return [];
  if (!text.trim()) throw new calc.CalculationError('Enter at least one grade boundary.');
  return text
    .trim()
    .split('\n')
    .map((line) => {
      const parts = line.split(':');
      if (parts.length !== 2 || !parts[1]?.trim())
        throw new calc.CalculationError('Use one grade label:minimum percentage per line.');
      return { label: parts[0]?.trim() || '', minimum: n(parts[1]) };
    });
}
function ScalarCalculator({ id, slug, onReset }: { id: CalculatorId } & BaseProps) {
  const fields = fieldSets[id] || [];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.value])),
  );
  const [precision, setPrecision] = useState('2'),
    [rounding, setRounding] = useState<'nearest' | 'down' | 'up'>('nearest'),
    [mode, setMode] = useState<calc.ConversionMode>('scale');
  const [missed, setMissed] = useState(false),
    [custom, setCustom] = useState(false),
    [boundaryText, setBoundaryText] = useState('A:90\nB:80\nC:70\nD:60\nF:0');
  const state = useCalculation(slug);
  const v = (key: string) => n(values[key] || '');
  const f = (value: number) => calc.format(value, n(precision), rounding);
  function compute(): ResultSummary {
    if (id === 'final' || id === 'improvement') {
      const r =
        id === 'final'
          ? calc.finalExam(v('current'), v('weight'), v('target'))
          : calc.gradeImprovement(v('current'), v('completed'), v('remaining'), v('target'));
      return {
        value: r.required === null ? 'No weight left' : `${f(r.required)}%`,
        label:
          r.status === 'impossible'
            ? 'Target is out of reach'
            : r.status === 'secured'
              ? 'Your target is already secured'
              : 'Required remaining score',
        warning: r.status === 'impossible',
        detail:
          r.required === null
            ? 'No remaining assessed weight can change the grade.'
            : r.status === 'impossible'
              ? 'This exceeds 100%. The target is impossible in this model without extra credit or a policy change.'
              : r.status === 'secured'
                ? 'Even a zero on the remaining work meets your target in this model.'
                : 'This is the weighted average needed on the remaining work. Aim slightly higher to allow for rounding.',
        stats: [{ label: 'Maximum possible final grade', value: `${f(r.maximum)}%` }],
      };
    }
    if (id === 'attendance') {
      if (missed) calc.number(v('attended'), 'Classes missed', 0, v('held'));
      const r = calc.attendance(missed ? v('held') - v('attended') : v('attended'), v('held'));
      return {
        value: `${f(r.percentage)}%`,
        label: 'Your attendance rate',
        detail:
          'Based only on classes already held. Check your institution’s rules for excused absences.',
        stats: [
          { label: 'Classes attended', value: String(v('held') - r.missed) },
          { label: 'Classes missed', value: String(r.missed) },
        ],
      };
    }
    if (id === 'required') {
      const r = calc.requiredAttendance(v('attended'), v('held'), v('target'));
      return {
        value: r.needed === null ? 'Not possible' : String(r.needed),
        label: r.needed === null ? '100% cannot be restored' : 'Consecutive classes to attend',
        warning: r.impossible,
        detail: r.impossible
          ? 'After a missed class, exact 100% cannot be reached in a finite number of future sessions.'
          : r.needed === 0
            ? 'Your current record already meets the target.'
            : 'Attend this many future classes in a row. Both attended and held counts increase.',
        stats: [
          {
            label: 'Classes you may miss now',
            value: r.mayMiss === null ? 'No finite limit' : String(r.mayMiss),
          },
        ],
      };
    }
    if (id === 'percentage') {
      const r = calc.gradePercentage(v('obtained'), v('total'), boundaries(custom, boundaryText));
      return {
        value: `${f(r.percentage)}%`,
        label: 'Your score percentage',
        detail: r.label
          ? `Grade: ${r.label}, using only your custom boundaries.`
          : 'Letter grades depend on your institution. No universal letter scale is applied.',
        stats: [{ label: 'Marks earned', value: `${v('obtained')} / ${v('total')}` }],
      };
    }
    if (id === 'assignment') {
      const r = calc.assignmentWeight(v('current'), v('weight'), v('obtained'), v('total'));
      return {
        value: `${f(r.updated)}`,
        label: 'Updated course contribution',
        detail:
          'Percentage points contributed to the full course, not a normalized current grade. This assignment is added once.',
        stats: [
          { label: 'Assignment score', value: `${f(r.score)}%` },
          { label: 'Assignment contribution', value: `${f(r.contribution)} points` },
        ],
      };
    }
    const r = calc.examScore(
      v('value'),
      v('original'),
      mode === 'raw' ? 100 : v('targetTotal'),
      mode,
      boundaries(custom, boundaryText),
    );
    return {
      value: mode === 'raw' ? `${f(r.percentage)}%` : `${f(r.marks)}`,
      label: mode === 'raw' ? 'Converted percentage' : 'Equivalent marks',
      detail: `Proportional conversion only, not a percentile or official exam equating.${r.label ? ` Custom grade: ${r.label}.` : ''}`,
      stats: [
        { label: 'Percentage', value: `${f(r.percentage)}%` },
        { label: 'Target scale', value: `${mode === 'raw' ? 100 : v('targetTotal')} marks` },
      ],
    };
  }
  return (
    <FormShell state={state} slug={slug} onReset={onReset} onSubmit={(e) => state.run(e, compute)}>
      <div className="form-heading">
        <h2>Let’s work it out</h2>
        <span className="tag">Your numbers</span>
      </div>
      <p className="form-description">Start with the example below, or enter your own details.</p>
      {id === 'converter' && (
        <SelectInput
          label="Conversion type"
          value={mode}
          onChange={(v) => setMode(v as calc.ConversionMode)}
          options={[
            { value: 'raw', label: 'Raw marks → percentage' },
            { value: 'percentage', label: 'Percentage → marks' },
            { value: 'scale', label: 'Between mark scales' },
          ]}
        />
      )}
      {id === 'attendance' && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={missed}
            onChange={(e) => {
              setMissed(e.target.checked);
              setValues({ ...values, attended: e.target.checked ? '8' : '32' });
            }}
          />{' '}
          Enter missed classes instead
        </label>
      )}
      <div className="fields-grid">
        {fields
          .filter(
            (field) =>
              !(
                id === 'converter' &&
                ((mode === 'percentage' && field.key === 'original') ||
                  (mode === 'raw' && field.key === 'targetTotal'))
              ),
          )
          .map((field) => (
            <NumericInput
              key={field.key}
              label={
                id === 'attendance' && missed && field.key === 'attended'
                  ? 'Classes missed'
                  : id === 'converter' && field.key === 'value'
                    ? mode === 'percentage'
                      ? 'Percentage (%)'
                      : 'Marks obtained'
                    : field.label
              }
              value={values[field.key] || ''}
              onChange={(value) => setValues({ ...values, [field.key]: value })}
              help={field.help}
              step={field.step}
              max={field.max}
            />
          ))}
      </div>
      {(id === 'percentage' || id === 'converter') && (
        <>
          <div className="fields-grid">
            <SelectInput
              label="Decimal places"
              value={precision}
              onChange={setPrecision}
              options={[0, 1, 2, 3, 4].map((p) => ({ value: String(p), label: String(p) }))}
            />
            {id === 'converter' && (
              <SelectInput
                label="Rounding"
                value={rounding}
                onChange={(v) => setRounding(v as typeof rounding)}
                options={[
                  { value: 'nearest', label: 'Nearest' },
                  { value: 'down', label: 'Down' },
                  { value: 'up', label: 'Up' },
                ]}
              />
            )}
          </div>
          <BoundarySettings
            enabled={custom}
            setEnabled={setCustom}
            value={boundaryText}
            setValue={setBoundaryText}
          />
        </>
      )}
    </FormShell>
  );
}
const isoDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
function StudyCalculator({ slug, onReset }: BaseProps) {
  const [copy, setCopy] = useState('');
  const [start, setStart] = useState(''),
    [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]),
    [capacity, setCapacity] = useState('2');
  const [rows, setRows] = useState([
    { name: 'Mathematics', hours: '8', deadline: '', priority: '2' },
    { name: 'Biology', hours: '12', deadline: '', priority: '1' },
  ]);
  const [schedule, setSchedule] = useState<ReturnType<typeof calc.studyHours> | null>(null);
  const state = useCalculation(slug);
  useEffect(() => {
    setStart(isoDate());
    setRows([
      { name: 'Mathematics', hours: '8', deadline: isoDate(7), priority: '2' },
      { name: 'Biology', hours: '12', deadline: isoDate(14), priority: '1' },
    ]);
  }, []);
  const update = (i: number, key: 'name' | 'hours' | 'deadline' | 'priority', value: string) =>
    setRows(rows.map((r, j) => (i === j ? { ...r, [key]: value } : r)));
  const invalidate = () => {
    state.clear();
    setSchedule(null);
  };
  return (
    <>
      <div onChange={() => setSchedule(null)}>
        <FormShell
          state={state}
          slug={slug}
          onReset={onReset}
          label="Build my study plan"
          onSubmit={(e) =>
            state.run(e, () => {
              const r = calc.studyHours(
                rows.map((r) => ({ ...r, hours: n(r.hours), priority: n(r.priority) })),
                start,
                days,
                n(capacity),
              );
              setSchedule(r);
              return {
                value: `${calc.format(r.scheduledHours, 1)} h`,
                label: r.feasible ? 'Your study plan fits' : 'Some hours do not fit',
                warning: !r.feasible,
                detail: r.feasible
                  ? 'All requested hours fit before their deadlines. Earlier deadlines come first; priority breaks ties.'
                  : `Unallocated: ${r.unfinished.map((s) => `${s.subject} (${calc.format(s.hours, 1)} h)`).join(', ')}. Adjust hours, days, capacity, or deadlines.`,
                stats: [
                  { label: 'Available study days', value: String(r.availableDays) },
                  { label: 'Study sessions', value: String(r.sessions.length) },
                ],
              };
            })
          }
        >
          <div className="form-heading">
            <h2>Make room for progress</h2>
          </div>
          <div className="fields-grid">
            <TextInput label="Plan start date" type="date" value={start} onChange={setStart} />
            <NumericInput
              label="Daily study capacity (hours)"
              value={capacity}
              max={24}
              onChange={setCapacity}
            />
          </div>
          <fieldset className="weekdays">
            <legend>Available study days</legend>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={days.includes(i)}
                  onChange={() =>
                    setDays(days.includes(i) ? days.filter((d) => d !== i) : [...days, i])
                  }
                />
                <span>{day}</span>
              </label>
            ))}
          </fieldset>
          <DynamicRows
            label="Add subject"
            onAdd={() => {
              invalidate();
              setRows([...rows, { name: '', hours: '5', deadline: isoDate(14), priority: '1' }]);
            }}
          >
            {rows.map((r, i) => (
              <fieldset className="dynamic-row" key={i}>
                <legend>Subject {i + 1}</legend>
                <div className="subject-grid">
                  <TextInput
                    label={`Subject ${i + 1} name`}
                    value={r.name}
                    onChange={(v) => update(i, 'name', v)}
                  />
                  <NumericInput
                    label={`Subject ${i + 1} hours`}
                    value={r.hours}
                    onChange={(v) => update(i, 'hours', v)}
                  />
                  <TextInput
                    label={`Subject ${i + 1} deadline`}
                    type="date"
                    value={r.deadline}
                    onChange={(v) => update(i, 'deadline', v)}
                  />
                  <SelectInput
                    label={`Subject ${i + 1} priority`}
                    value={r.priority}
                    options={[
                      { value: '1', label: 'Normal' },
                      { value: '2', label: 'High' },
                      { value: '3', label: 'Highest' },
                    ]}
                    onChange={(v) => update(i, 'priority', v)}
                  />
                  <button
                    className="remove-row"
                    type="button"
                    aria-label={`Remove subject ${i + 1}`}
                    onClick={() => {
                      invalidate();
                      setRows(rows.filter((_, j) => j !== i));
                    }}
                  >
                    ×
                  </button>
                </div>
              </fieldset>
            ))}
          </DynamicRows>
          <p className="input-note">
            Deadline day is included. Hours are planned to the nearest 0.01 hour.
          </p>
        </FormShell>
      </div>
      {schedule && (
        <section className="schedule-panel">
          <div className="section-heading">
            <h3>Your daily study schedule</h3>
            <button
              className="button button-outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    schedule.sessions
                      .map((s) => `${s.date}: ${s.subject} — ${calc.format(s.hours)} hours`)
                      .join('\n'),
                  );
                  track('result_copied', slug);
                  setCopy('Schedule copied');
                } catch {
                  setCopy('Copy unavailable. Select the schedule text to copy.');
                }
              }}
              type="button"
            >
              Copy schedule
            </button>
          </div>
          <p role="status">{copy}</p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Daily study schedule"
          >
            <table>
              <caption className="sr-only">Study sessions by date and subject</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Hours</th>
                </tr>
              </thead>
              <tbody>
                {schedule.sessions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td>{s.subject}</td>
                    <td>{calc.format(s.hours)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {schedule.sessions.length === 0 && (
            <p>No study sessions fit. Review your available days and deadlines.</p>
          )}
        </section>
      )}
    </>
  );
}
export default function Calculator({ id, slug }: { id: CalculatorId; slug: string }) {
  const [version, setVersion] = useState(0);
  const props = { slug, onReset: () => setVersion((v) => v + 1) };
  return (
    <div className="calculator-island" key={version}>
      {id === 'gpa' || id === 'semester' ? (
        <GpaCalculator {...props} planner={id === 'semester'} />
      ) : id === 'cgpa' ? (
        <CgpaCalculator {...props} />
      ) : id === 'weighted' ? (
        <WeightedCalculator {...props} />
      ) : id === 'study' ? (
        <StudyCalculator {...props} />
      ) : (
        <ScalarCalculator {...props} id={id} />
      )}
    </div>
  );
}
