export class CalculationError extends Error {}
export function number(value: number, label: string, min = 0, max = Infinity): number {
  if (!Number.isFinite(value)) throw new CalculationError(`${label} must be a number.`);
  if (value < min || value > max)
    throw new CalculationError(
      `${label} must be between ${min} and ${max === Infinity ? 'a finite positive value' : max}.`,
    );
  return value;
}
function positive(value: number, label: string) {
  number(value, label);
  if (value === 0) throw new CalculationError(`${label} must be greater than zero.`);
  return value;
}
function integer(value: number, label: string) {
  number(value, label);
  if (!Number.isSafeInteger(value)) throw new CalculationError(`${label} must be a whole number.`);
  return value;
}
export function percentage(value: number, label: string) {
  return number(value, label, 0, 100);
}
export function format(
  value: number,
  precision = 2,
  rounding: 'nearest' | 'down' | 'up' = 'nearest',
) {
  number(precision, 'Decimal places', 0, 6);
  if (!Number.isInteger(precision))
    throw new CalculationError('Decimal places must be a whole number.');
  if (!Number.isFinite(value)) throw new CalculationError('Result must be finite.');
  const factor = 10 ** precision;
  const scaled = Number((value * factor).toPrecision(15));
  const rounded =
    rounding === 'down'
      ? Math.floor(scaled)
      : rounding === 'up'
        ? Math.ceil(scaled)
        : Math.round(scaled);
  return (rounded / factor).toFixed(precision);
}
export const defaultScale: Record<string, number> = {
  A: 4,
  'A−': 3.7,
  'B+': 3.3,
  B: 3,
  'B−': 2.7,
  'C+': 2.3,
  C: 2,
  'C−': 1.7,
  'D+': 1.3,
  D: 1,
  F: 0,
};
export interface Course {
  name: string;
  credits: number;
  grade: string;
}
export function gpa(courses: Course[], scale = defaultScale, maximum = 4) {
  positive(maximum, 'Maximum GPA');
  const entries = Object.entries(scale);
  if (
    !entries.length ||
    entries.some(
      ([label, points]) =>
        !label.trim() || !Number.isFinite(points) || points < 0 || points > maximum,
    )
  )
    throw new CalculationError('Grade points must be between zero and the maximum GPA.');
  if (!courses.length) throw new CalculationError('Add at least one course.');
  let credits = 0,
    points = 0;
  for (const [index, course] of courses.entries()) {
    positive(course.credits, `Course ${index + 1} credits`);
    const grade = scale[course.grade];
    if (!Object.hasOwn(scale, course.grade) || grade === undefined)
      throw new CalculationError(`Course ${index + 1} has an unknown grade.`);
    credits += course.credits;
    points += course.credits * grade;
  }
  number(credits, 'Total credits');
  number(points, 'Total quality points');
  return { gpa: points / credits, credits, points, maximum };
}
export interface Semester {
  name: string;
  gpa: number;
  credits: number;
}
export function cgpa(semesters: Semester[], maximum = 4) {
  positive(maximum, 'Maximum GPA');
  if (!semesters.length) throw new CalculationError('Add at least one semester.');
  let credits = 0,
    points = 0;
  semesters.forEach((semester, i) => {
    number(semester.gpa, `Semester ${i + 1} GPA`, 0, maximum);
    positive(semester.credits, `Semester ${i + 1} credits`);
    credits += semester.credits;
    points += semester.gpa * semester.credits;
  });
  number(credits, 'Total credits');
  number(points, 'Total quality points');
  return { gpa: points / credits, credits, points, maximum };
}
export interface Category {
  name: string;
  score: number;
  weight: number;
}
export function weightedGrade(categories: Category[]) {
  if (!categories.length) throw new CalculationError('Add at least one category.');
  let weight = 0,
    contribution = 0;
  categories.forEach((row, i) => {
    percentage(row.score, `Category ${i + 1} score`);
    percentage(row.weight, `Category ${i + 1} weight`);
    weight += row.weight;
    contribution += (row.score * row.weight) / 100;
  });
  if (weight > 100 + 1e-8)
    throw new CalculationError('Category weights cannot total more than 100%.');
  positive(weight, 'Total completed weight');
  return {
    weight,
    contribution,
    normalized: (contribution / weight) * 100,
    complete: Math.abs(weight - 100) < 1e-8,
  };
}
export function finalExam(current: number, weight: number, target: number) {
  percentage(current, 'Current grade');
  percentage(weight, 'Final exam weight');
  percentage(target, 'Target grade');
  if (weight === 0)
    return {
      required: null,
      status: target <= current ? ('secured' as const) : ('impossible' as const),
      maximum: current,
    };
  const required = (target - current * (1 - weight / 100)) / (weight / 100);
  return {
    required,
    status:
      required > 100 + 1e-8
        ? ('impossible' as const)
        : required <= 0
          ? ('secured' as const)
          : ('possible' as const),
    maximum: current * (1 - weight / 100) + weight,
  };
}
export function attendance(attended: number, held: number) {
  integer(attended, 'Classes attended');
  integer(held, 'Total classes held');
  positive(held, 'Total classes held');
  if (attended > held)
    throw new CalculationError('Classes attended cannot exceed total classes held.');
  return { percentage: (attended / held) * 100, missed: held - attended };
}
export function requiredAttendance(attended: number, held: number, target: number) {
  integer(attended, 'Classes attended');
  integer(held, 'Total classes held');
  percentage(target, 'Required attendance');
  if (attended > held)
    throw new CalculationError('Classes attended cannot exceed total classes held.');
  if (target === 0) return { needed: 0, mayMiss: null, impossible: false };
  if (held === 0) return { needed: 1, mayMiss: 0, impossible: false };
  if (target === 100)
    return { needed: attended === held ? 0 : null, mayMiss: 0, impossible: attended !== held };
  const p = target / 100;
  const needed = Math.max(0, Math.ceil((p * held - attended) / (1 - p) - 1e-9));
  const mayMiss = Math.max(0, Math.floor(attended / p - held + 1e-9));
  return { needed, mayMiss, impossible: false };
}
export interface Boundary {
  label: string;
  minimum: number;
}
export function gradeLabel(value: number, boundaries: Boundary[]) {
  percentage(value, 'Percentage');
  if (!boundaries.length) return null;
  const labels = new Set<string>();
  const limits = new Set<number>();
  for (const item of boundaries) {
    percentage(item.minimum, 'Grade boundary');
    if (!item.label.trim() || labels.has(item.label.trim()) || limits.has(item.minimum))
      throw new CalculationError(
        'Grade boundaries need unique, non-empty labels and unique minimum percentages.',
      );
    labels.add(item.label.trim());
    limits.add(item.minimum);
  }
  return (
    [...boundaries].sort((a, b) => b.minimum - a.minimum).find((b) => value >= b.minimum)?.label ??
    'Below configured boundaries'
  );
}
export function gradePercentage(obtained: number, total: number, boundaries: Boundary[] = []) {
  number(obtained, 'Marks obtained');
  positive(total, 'Total possible marks');
  if (obtained > total)
    throw new CalculationError('Marks obtained cannot exceed total possible marks.');
  const value = (obtained / total) * 100;
  return { percentage: value, label: gradeLabel(value, boundaries) };
}
export function assignmentWeight(
  currentContribution: number,
  weight: number,
  obtained: number,
  total: number,
) {
  percentage(currentContribution, 'Current course contribution');
  percentage(weight, 'Assignment weight');
  if (currentContribution + weight > 100 + 1e-8)
    throw new CalculationError(
      'Current contribution and assignment weight exceed 100%. Check that the assignment is not already included.',
    );
  const { percentage: score } = gradePercentage(obtained, total);
  const contribution = (score * weight) / 100;
  return { score, contribution, updated: currentContribution + contribution };
}
export function semesterPlanner(courses: Course[], scale = defaultScale, maximum = 4) {
  return gpa(courses, scale, maximum);
}
export function gradeImprovement(
  current: number,
  completed: number,
  remaining: number,
  target: number,
) {
  percentage(current, 'Current grade');
  percentage(completed, 'Completed weight');
  percentage(remaining, 'Remaining weight');
  percentage(target, 'Target grade');
  if (Math.abs(completed + remaining - 100) > 1e-8)
    throw new CalculationError('Completed and remaining weights must total 100%.');
  const result = finalExam(current, remaining, target);
  return { ...result, contribution: (current * completed) / 100 };
}
export interface Subject {
  name: string;
  deadline: string;
  hours: number;
  priority: number;
}
export interface StudySession {
  date: string;
  subject: string;
  hours: number;
}
function dayNumber(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new CalculationError('Enter a valid date.');
  const time = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== iso)
    throw new CalculationError('Enter a valid date.');
  return time / 86400000;
}
export function studyHours(
  subjects: Subject[],
  today: string,
  weekdays: number[],
  dailyCapacity: number,
) {
  const start = dayNumber(today);
  positive(dailyCapacity, 'Daily study capacity');
  number(dailyCapacity, 'Daily study capacity', 0, 24);
  if (!subjects.length) throw new CalculationError('Add at least one subject.');
  if (!weekdays.length || weekdays.some((d) => !Number.isInteger(d) || d < 0 || d > 6))
    throw new CalculationError('Select at least one study day.');
  if (Math.round(dailyCapacity * 100) === 0)
    throw new CalculationError('Daily study capacity must be at least 0.01 hours.');
  const jobs = subjects
    .map((s, i) => {
      const deadline = dayNumber(s.deadline);
      if (deadline < start)
        throw new CalculationError(`Subject ${i + 1} deadline must be today or later.`);
      if (deadline - start > 365)
        throw new CalculationError('Plan deadlines within the next 365 days.');
      if (!s.name.trim()) throw new CalculationError(`Subject ${i + 1} needs a name.`);
      positive(s.hours, `Subject ${i + 1} hours`);
      number(s.hours, `Subject ${i + 1} hours`, 0.01, 10000);
      number(s.priority, `Subject ${i + 1} priority`, 1, 3);
      return { ...s, deadlineDay: deadline, left: Math.round(s.hours * 100), index: i };
    })
    .sort((a, b) => a.deadlineDay - b.deadlineDay || b.priority - a.priority || a.index - b.index);
  const sessions: StudySession[] = [];
  const end = Math.max(...jobs.map((j) => j.deadlineDay));
  let availableDays = 0;
  for (let day = start; day <= end; day++) {
    if (!weekdays.includes(new Date(day * 86400000).getUTCDay())) continue;
    availableDays++;
    let capacity = Math.round(dailyCapacity * 100);
    for (const job of jobs) {
      if (job.deadlineDay < day || job.left === 0 || capacity === 0) continue;
      const used = Math.min(capacity, job.left);
      sessions.push({
        date: new Date(day * 86400000).toISOString().slice(0, 10),
        subject: job.name,
        hours: used / 100,
      });
      capacity -= used;
      job.left -= used;
    }
  }
  const unfinished = jobs
    .filter((j) => j.left > 0)
    .map((j) => ({ subject: j.name, hours: j.left / 100 }));
  return {
    sessions,
    unfinished,
    feasible: unfinished.length === 0,
    availableDays,
    scheduledHours: sessions.reduce((sum, s) => sum + s.hours, 0),
  };
}
export type ConversionMode = 'raw' | 'percentage' | 'scale';
export function examScore(
  value: number,
  originalTotal: number,
  targetTotal: number,
  mode: ConversionMode,
  boundaries: Boundary[] = [],
) {
  if (!['raw', 'percentage', 'scale'].includes(mode))
    throw new CalculationError('Choose a valid conversion mode.');
  positive(targetTotal, 'Target total marks');
  const p =
    mode === 'percentage'
      ? percentage(value, 'Percentage')
      : gradePercentage(value, originalTotal).percentage;
  return { percentage: p, marks: (p / 100) * targetTotal, label: gradeLabel(p, boundaries) };
}
