import { describe, it, expect } from 'vitest';
import * as c from '../lib/calculations';
import { calculators } from '../data/calculators';
describe('GPA and semester projections', () => {
  it('weights by credit hours rather than course count', () => {
    expect(
      c.gpa([
        { name: 'A', credits: 3, grade: 'A' },
        { name: 'B', credits: 4, grade: 'B' },
      ]).gpa,
    ).toBeCloseTo(24 / 7);
  });
  it('supports zero grades and fractional credits', () => {
    expect(
      c.gpa([
        { name: 'A', credits: 1.5, grade: 'A' },
        { name: 'F', credits: 1.5, grade: 'F' },
      ]).gpa,
    ).toBe(2);
  });
  it('supports custom point mappings and maximums', () => {
    expect(
      c.gpa(
        [
          { name: 'X', credits: 2, grade: 'Excellent' },
          { name: 'Y', credits: 2, grade: 'Good' },
        ],
        { Excellent: 10, Good: 8 },
        10,
      ).gpa,
    ).toBe(9);
  });
  it('handles arbitrary course counts for planning', () => {
    const rows = Array.from({ length: 200 }, () => ({ name: 'Course', credits: 3, grade: 'A' }));
    expect(c.semesterPlanner(rows).gpa).toBe(4);
    expect(c.semesterPlanner(rows).credits).toBe(600);
  });
  it.each([
    { rows: [] },
    { rows: [{ name: 'Empty', credits: 0, grade: 'A' }] },
    { rows: [{ name: 'Bad', credits: NaN, grade: 'A' }] },
    { rows: [{ name: 'Bad', credits: 3, grade: 'unknown' }] },
  ])('rejects invalid course collections', ({ rows }) => expect(() => c.gpa(rows)).toThrow());
  it('rejects empty, nonfinite, negative, or out-of-scale grade mappings', () => {
    for (const scale of [{}, { A: -1 }, { A: 5 }, { A: Infinity }] as Record<string, number>[])
      expect(() => c.gpa([{ name: 'A', credits: 3, grade: 'A' }], scale, 4)).toThrow();
  });
  it('rejects zero maximum', () => {
    expect(() => c.semesterPlanner([{ name: 'A', credits: 3, grade: 'A' }], { A: 0 }, 0)).toThrow();
  });
});
describe('CGPA', () => {
  it('combines semesters proportionally', () =>
    expect(
      c.cgpa([
        { name: 'Fall', gpa: 3.5, credits: 15 },
        { name: 'Spring', gpa: 3.8, credits: 12 },
      ]).gpa,
    ).toBeCloseTo(3.6333333333));
  it('supports a ten-point scale and zero GPA', () =>
    expect(
      c.cgpa(
        [
          { name: 'A', gpa: 10, credits: 5 },
          { name: 'B', gpa: 0, credits: 5 },
        ],
        10,
      ).gpa,
    ).toBe(5));
  it('rejects no semesters, zero credits, and GPA above scale', () => {
    expect(() => c.cgpa([])).toThrow();
    expect(() => c.cgpa([{ name: 'A', gpa: 3, credits: 0 }])).toThrow();
    expect(() => c.cgpa([{ name: 'A', gpa: 4.1, credits: 3 }])).toThrow();
  });
});
describe('weighted grades', () => {
  it('distinguishes completed-work average and contribution', () => {
    const r = c.weightedGrade([
      { name: 'Assignments', score: 80, weight: 30 },
      { name: 'Midterm', score: 90, weight: 20 },
    ]);
    expect(r.normalized).toBe(84);
    expect(r.contribution).toBe(42);
    expect(r.weight).toBe(50);
    expect(r.complete).toBe(false);
  });
  it('identifies full-course weight and supports zero scores', () => {
    const r = c.weightedGrade([
      { name: 'A', score: 0, weight: 50 },
      { name: 'B', score: 100, weight: 50 },
    ]);
    expect(r.normalized).toBe(50);
    expect(r.complete).toBe(true);
  });
  it('handles decimal weights', () =>
    expect(c.weightedGrade([{ name: 'A', score: 75.5, weight: 33.3 }]).normalized).toBeCloseTo(
      75.5,
    ));
  it('rejects overweight, empty, zero-weight and invalid scores', () => {
    expect(() => c.weightedGrade([{ name: 'A', score: 70, weight: 101 }])).toThrow();
    expect(() =>
      c.weightedGrade([
        { name: 'A', score: 70, weight: 60 },
        { name: 'B', score: 70, weight: 60 },
      ]),
    ).toThrow();
    expect(() => c.weightedGrade([])).toThrow();
    expect(() => c.weightedGrade([{ name: 'A', score: 70, weight: 0 }])).toThrow();
    expect(() => c.weightedGrade([{ name: 'A', score: -1, weight: 50 }])).toThrow();
  });
});
describe('final exam targets', () => {
  it('solves a target without clamping', () =>
    expect(c.finalExam(80, 30, 85).required).toBeCloseTo(96.6666667));
  it('reports impossible targets above 100%', () => {
    expect(c.finalExam(50, 20, 90).required).toBe(250);
    expect(c.finalExam(50, 20, 90).status).toBe('impossible');
  });
  it('reports secured targets including negative required scores', () => {
    expect(c.finalExam(100, 20, 70).required).toBe(-50);
    expect(c.finalExam(100, 20, 70).status).toBe('secured');
  });
  it('handles zero and full exam weight', () => {
    expect(c.finalExam(80, 0, 85)).toMatchObject({ required: null, status: 'impossible' });
    expect(c.finalExam(80, 0, 75).status).toBe('secured');
    expect(c.finalExam(0, 100, 65).required).toBe(65);
  });
  it('rejects invalid grade and weight inputs', () => {
    expect(() => c.finalExam(101, 30, 80)).toThrow();
    expect(() => c.finalExam(80, -1, 80)).toThrow();
    expect(() => c.finalExam(NaN, 30, 80)).toThrow();
  });
});
describe('attendance percentage', () => {
  it('counts attended and missed classes', () =>
    expect(c.attendance(32, 40)).toEqual({ percentage: 80, missed: 8 }));
  it('supports zero attendance and perfect attendance', () => {
    expect(c.attendance(0, 10).percentage).toBe(0);
    expect(c.attendance(10, 10).percentage).toBe(100);
  });
  it.each([
    [0, 0],
    [11, 10],
    [2.5, 10],
    [-1, 10],
    [Infinity, 10],
  ])('rejects invalid counts %s/%s', (a, t) => expect(() => c.attendance(a, t)).toThrow());
});
describe('required attendance inequalities', () => {
  it('rounds the needed classes up correctly', () =>
    expect(c.requiredAttendance(14, 20, 75)).toEqual({ needed: 4, mayMiss: 0, impossible: false }));
  it('rounds allowed absences down', () =>
    expect(c.requiredAttendance(32, 40, 75)).toMatchObject({ needed: 0, mayMiss: 2 }));
  it('handles 0%, 100%, and no history', () => {
    expect(c.requiredAttendance(0, 20, 0)).toMatchObject({ needed: 0, mayMiss: null });
    expect(c.requiredAttendance(19, 20, 100)).toMatchObject({ needed: null, impossible: true });
    expect(c.requiredAttendance(20, 20, 100).needed).toBe(0);
    expect(c.requiredAttendance(0, 0, 75).needed).toBe(1);
  });
  it('satisfies the target with the smallest possible integer', () => {
    for (let held = 1; held <= 50; held++) {
      for (let attended = 0; attended <= held; attended++) {
        for (const target of [50, 66.67, 75, 90]) {
          const r = c.requiredAttendance(attended, held, target);
          const needed = r.needed!;
          expect(((attended + needed) / (held + needed)) * 100 + 1e-7).toBeGreaterThanOrEqual(
            target,
          );
          if (needed > 0)
            expect(((attended + needed - 1) / (held + needed - 1)) * 100).toBeLessThan(target);
        }
      }
    }
  });
  it('rejects impossible input records', () => {
    expect(() => c.requiredAttendance(5, 4, 75)).toThrow();
    expect(() => c.requiredAttendance(2, 4, 101)).toThrow();
  });
});
describe('percentages and boundary policies', () => {
  it('converts marks and optional policy labels', () =>
    expect(
      c.gradePercentage(42, 50, [
        { label: 'A', minimum: 90 },
        { label: 'B', minimum: 80 },
      ]),
    ).toEqual({ percentage: 84, label: 'B' }));
  it('does not assume a universal scale', () => expect(c.gradePercentage(42, 50).label).toBeNull());
  it('uses unrounded percentages to select a label', () =>
    expect(
      c.gradePercentage(89.999, 100, [
        { label: 'A', minimum: 90 },
        { label: 'B', minimum: 80 },
      ]).label,
    ).toBe('B'));
  it('validates boundaries and reports below minimum', () => {
    expect(c.gradeLabel(50, [{ label: 'A', minimum: 90 }])).toBe('Below configured boundaries');
    expect(() =>
      c.gradeLabel(80, [
        { label: 'A', minimum: 90 },
        { label: 'A', minimum: 80 },
      ]),
    ).toThrow();
    expect(() =>
      c.gradeLabel(80, [
        { label: 'A', minimum: 90 },
        { label: 'B', minimum: 90 },
      ]),
    ).toThrow();
    expect(() => c.gradeLabel(80, [{ label: '', minimum: 10 }])).toThrow();
  });
  it('rejects division by zero, excess marks, and negative marks', () => {
    expect(() => c.gradePercentage(0, 0)).toThrow();
    expect(() => c.gradePercentage(101, 100)).toThrow();
    expect(() => c.gradePercentage(-1, 100)).toThrow();
  });
  it('defines display precision and rounding', () => {
    expect(c.format(2.675, 2)).toBe('2.68');
    expect(c.format(84.375, 1)).toBe('84.4');
    expect(c.format(89.999, 2, 'down')).toBe('89.99');
    expect(c.format(89.991, 2, 'up')).toBe('90.00');
    expect(c.format(0, 0)).toBe('0');
    expect(() => c.format(1, 7)).toThrow();
    expect(() => c.format(Infinity)).toThrow();
  });
});
describe('assignment contribution', () => {
  it('adds a new contribution exactly once', () =>
    expect(c.assignmentWeight(45, 20, 36, 40)).toEqual({
      score: 90,
      contribution: 18,
      updated: 63,
    }));
  it('supports zero weight and zero earned marks', () => {
    expect(c.assignmentWeight(50, 0, 10, 20).updated).toBe(50);
    expect(c.assignmentWeight(0, 20, 0, 20).updated).toBe(0);
  });
  it('rejects inconsistent course contributions and zero total marks', () => {
    expect(() => c.assignmentWeight(90, 20, 10, 20)).toThrow();
    expect(() => c.assignmentWeight(0, 20, 0, 0)).toThrow();
  });
});
describe('grade improvement', () => {
  it('computes the remaining average', () =>
    expect(c.gradeImprovement(70, 60, 40, 80)).toMatchObject({
      required: 95,
      status: 'possible',
      contribution: 42,
    }));
  it('identifies impossible and secured goals', () => {
    expect(c.gradeImprovement(10, 90, 10, 90).status).toBe('impossible');
    expect(c.gradeImprovement(100, 90, 10, 80).status).toBe('secured');
  });
  it('handles no remaining work and all remaining work', () => {
    expect(c.gradeImprovement(80, 100, 0, 85).status).toBe('impossible');
    expect(c.gradeImprovement(0, 0, 100, 85).required).toBe(85);
  });
  it('rejects inconsistent course weights', () =>
    expect(() => c.gradeImprovement(80, 50, 40, 85)).toThrow());
});
describe('study schedule', () => {
  const subject = { name: 'Math', deadline: '2026-10-28', hours: 6, priority: 1 };
  it('allocates a feasible schedule by deadline', () => {
    const r = c.studyHours([subject], '2026-10-26', [1, 2, 3], 2);
    expect(r.feasible).toBe(true);
    expect(r.sessions.map((s) => s.hours)).toEqual([2, 2, 2]);
    expect(r.sessions[2]?.date).toBe('2026-10-28');
  });
  it('reports infeasible workloads without exceeding daily capacity', () => {
    const r = c.studyHours([subject], '2026-10-26', [1, 2], 2);
    expect(r.feasible).toBe(false);
    expect(r.unfinished).toEqual([{ subject: 'Math', hours: 2 }]);
  });
  it('uses priority to break matching deadlines', () => {
    const r = c.studyHours(
      [
        { ...subject, name: 'Low', hours: 1 },
        { ...subject, name: 'High', hours: 1, priority: 3 },
      ],
      '2026-10-26',
      [1],
      1,
    );
    expect(r.sessions[0]?.subject).toBe('High');
  });
  it('keeps earlier deadlines ahead of higher-priority later work', () => {
    const r = c.studyHours(
      [
        { ...subject, name: 'Later', priority: 3 },
        { ...subject, name: 'Earlier', deadline: '2026-10-26', hours: 1 },
      ],
      '2026-10-26',
      [1],
      2,
    );
    expect(r.sessions[0]?.subject).toBe('Earlier');
  });
  it('handles fractional hours and includes deadline day', () => {
    const r = c.studyHours(
      [{ ...subject, hours: 0.75, deadline: '2026-10-26' }],
      '2026-10-26',
      [1],
      0.5,
    );
    expect(r.scheduledHours).toBe(0.5);
    expect(r.unfinished[0]?.hours).toBe(0.25);
  });
  it('rejects missing days, past/invalid dates, missing subjects, and zero capacity', () => {
    expect(() => c.studyHours([subject], '2026-10-26', [], 2)).toThrow();
    expect(() =>
      c.studyHours([{ ...subject, deadline: '2026-10-25' }], '2026-10-26', [1], 2),
    ).toThrow();
    expect(() =>
      c.studyHours([{ ...subject, deadline: '2026-02-30' }], '2026-10-26', [1], 2),
    ).toThrow();
    expect(() => c.studyHours([], '2026-10-26', [1], 2)).toThrow();
    expect(() => c.studyHours([subject], '2026-10-26', [1], 0)).toThrow();
    expect(() => c.studyHours([{ ...subject, name: '' }], '2026-10-26', [1], 2)).toThrow();
  });
});
describe('exam score conversion', () => {
  it('converts between total mark scales', () =>
    expect(c.examScore(36, 48, 20, 'scale')).toEqual({ percentage: 75, marks: 15, label: null }));
  it('converts percentage to marks and raw marks to percentage', () => {
    expect(c.examScore(80, 0, 50, 'percentage').marks).toBe(40);
    expect(c.examScore(12, 20, 100, 'raw').percentage).toBe(60);
  });
  it('handles zero and full marks with custom boundaries', () => {
    expect(c.examScore(0, 100, 20, 'scale').marks).toBe(0);
    expect(c.examScore(100, 100, 20, 'scale', [{ label: 'Pass', minimum: 50 }]).label).toBe('Pass');
  });
  it('rejects invalid scores and scales', () => {
    expect(() => c.examScore(101, 100, 20, 'scale')).toThrow();
    expect(() => c.examScore(80, 100, 0, 'scale')).toThrow();
    expect(() => c.examScore(101, 100, 20, 'percentage')).toThrow();
  });
});
describe('content registry', () => {
  it('has twelve unique routes and valid related tool targets', () => {
    expect(calculators).toHaveLength(12);
    expect(new Set(calculators.map((t) => t.slug)).size).toBe(12);
    expect(new Set(calculators.map((t) => t.description)).size).toBe(12);
    for (const tool of calculators) {
      expect(tool.faqs.length).toBeGreaterThanOrEqual(3);
      for (const id of tool.related)
        expect(calculators.some((t) => t.id === id && t.id !== tool.id)).toBe(true);
    }
  });
});
