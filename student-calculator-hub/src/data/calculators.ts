export type CalculatorId =
  | 'gpa'
  | 'cgpa'
  | 'weighted'
  | 'final'
  | 'attendance'
  | 'required'
  | 'percentage'
  | 'assignment'
  | 'semester'
  | 'improvement'
  | 'study'
  | 'converter';
export interface CalculatorInfo {
  id: CalculatorId;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  keywords: string[];
  related: CalculatorId[];
  intro: string;
  steps: string[];
  formula: string;
  explanation: string;
  example: string;
  mistakes: string[];
  limitation: string;
  faqs: { q: string; a: string }[];
}
export const calculators: CalculatorInfo[] = [
  {
    id: 'gpa',
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    shortTitle: 'GPA Calculator',
    description:
      'Calculate your semester GPA with course credits, letter grades, and a customizable grade-point scale.',
    category: 'GPA & credits',
    icon: 'graduation',
    color: 'indigo',
    keywords: ['semester GPA', 'credit weighted GPA'],
    related: ['cgpa', 'semester', 'percentage'],
    intro:
      'Turn a semester of course results into one credit-weighted average. Add each graded course, choose its letter grade, and enter its credit hours. A course with more credits contributes more to the result. This calculator starts with a common US 4.0 mapping, but you can edit every grade point to match your institution.',
    steps: [
      'Check your university’s grade-point scale, including how plus and minus grades are treated. Open “Customize grading scale” to change the defaults.',
      'Add each course that counts toward your GPA. Enter its credit hours and final letter grade; use Add course for additional rows.',
      'Select Calculate GPA to see your credit-weighted average, total credits, and total quality points.',
    ],
    formula: 'GPA = Σ(grade points × course credits) ÷ Σ(course credits)',
    explanation:
      'For each course, multiply the grade points by the course credits to obtain quality points. Add those quality points together, then divide by all included credits. The calculation uses unrounded values; only the displayed result is rounded.',
    example:
      'An A in a 3-credit course contributes 4.0 × 3 = 12 quality points. A B in a 4-credit course contributes 3.0 × 4 = 12. The semester GPA is 24 ÷ 7 = 3.43 on this example scale.',
    mistakes: [
      'Averaging letter-grade points without accounting for different course credits.',
      'Including pass/fail, withdrawn, or ungraded courses when your institution excludes them.',
      'Assuming every school assigns the same points to an A− or B+.',
    ],
    limitation:
      'This is a planning tool, not an official transcript. Institutional rules for repeated courses, transfer credits, honors weighting, and GPA rounding can change your official result. Enter only the courses and credits your institution includes.',
    faqs: [
      {
        q: 'Can I use a different GPA scale?',
        a: 'Yes. Edit the maximum GPA and the points assigned to each letter grade. Your course grades must exist in the configured scale.',
      },
      {
        q: 'What if a course has zero credits?',
        a: 'Exclude it from this weighted calculation. At least one positive-credit course is needed to produce a GPA.',
      },
      {
        q: 'Are course names saved?',
        a: 'No. Course names and grades stay in the current page session and are cleared when you reset or reload.',
      },
    ],
  },
  {
    id: 'cgpa',
    slug: 'cgpa-calculator',
    title: 'CGPA Calculator',
    shortTitle: 'Cumulative GPA',
    description:
      'Combine semester GPAs using completed credits to calculate a cumulative GPA on your chosen scale.',
    category: 'GPA & credits',
    icon: 'layers',
    color: 'violet',
    keywords: ['cumulative GPA', 'CGPA'],
    related: ['gpa', 'semester', 'improvement'],
    intro:
      'See how several semesters fit together. Cumulative GPA is a credit-weighted average of semester GPAs, not necessarily a simple average. Enter each semester’s GPA alongside the credits represented by that GPA. You can use a 4.0, 5.0, 10.0, or another maximum scale as long as all semesters use the same policy.',
    steps: [
      'Set the maximum GPA to match your transcript.',
      'Enter each semester’s GPA and the completed credits included in that GPA. Add or remove semesters as needed.',
      'Calculate your cumulative average and check the total credits against your records.',
    ],
    formula: 'CGPA = Σ(semester GPA × semester credits) ÷ Σ(semester credits)',
    explanation:
      'Semester quality points can be reconstructed by multiplying the semester average by its included credits. Adding those quality points and dividing by all included credits gives the cumulative average. More precise semester GPAs give a more precise estimate.',
    example:
      'A 3.50 GPA over 15 credits gives 52.5 quality points. A 3.80 over 12 credits gives 45.6. The cumulative GPA is 98.1 ÷ 27 = 3.63.',
    mistakes: [
      'Giving a 9-credit semester the same weight as an 18-credit semester.',
      'Mixing GPAs from different scales without an official conversion.',
      'Using attempted credits where the transcript calls for GPA credits.',
    ],
    limitation:
      'Previously rounded semester GPAs can produce small differences from an official CGPA calculated from individual course points. Repeated-course and transfer-credit policies are not automatically applied.',
    faqs: [
      {
        q: 'Can I include summer semesters?',
        a: 'Yes, if their credits and grades count toward the same cumulative GPA.',
      },
      {
        q: 'Does this convert between grading systems?',
        a: 'No. Every semester must already be on the same configured scale.',
      },
      {
        q: 'Why is my official result slightly different?',
        a: 'Your institution may use unrounded quality points, exclude some credits, or apply course replacement rules.',
      },
    ],
  },
  {
    id: 'weighted',
    slug: 'weighted-grade-calculator',
    title: 'Weighted Grade Calculator',
    shortTitle: 'Weighted Grade',
    description:
      'Calculate category-weighted grades and see both your completed-work average and course percentage contribution.',
    category: 'Grades & exams',
    icon: 'chart',
    color: 'blue',
    keywords: ['weighted average grade', 'category weights'],
    related: ['final', 'assignment', 'improvement'],
    intro:
      'A quiz average and a final exam may count very differently toward a course grade. This tool combines scores using your syllabus weights and shows two useful results: your normalized average on the categories entered, and their contribution to the whole course. These numbers are identical only when the included weights total 100%.',
    steps: [
      'Add each assessed category, such as quizzes, projects, or exams.',
      'Enter its score percentage and its share of the full course grade. Use weights from the syllabus, not equal weights unless that is the actual policy.',
      'Review the weight total and both result measures. Enter only completed categories for a current-work average.',
    ],
    formula:
      'Course contribution = Σ(score × weight ÷ 100); normalized grade = contribution ÷ total weight × 100',
    explanation:
      'A score of 80% in a category worth 25% contributes 20 percentage points to the course. If these are the only completed assessments, the normalized grade is 80%, while the course contribution is 20 points. Weights below 100% are allowed and clearly identified; weights above 100% are rejected.',
    example:
      'An 80% assignment average at 30% weight contributes 24 points. A 90% midterm at 20% contributes 18. The course contribution is 42 points, with a normalized completed-work grade of 42 ÷ 50 × 100 = 84%.',
    mistakes: [
      'Treating an unfinished category as a zero unless you intentionally want that scenario.',
      'Reporting 42 contributed points as a 42% current grade when only half the course is assessed.',
      'Entering weights that accidentally exceed the whole course.',
    ],
    limitation:
      'Dropped scores, minimum exam thresholds, extra credit, and category-specific rules need to be applied before entering the category averages. No hidden normalization is performed.',
    faqs: [
      {
        q: 'Do weights have to total 100%?',
        a: 'Only for a complete final course grade. A partial weight total is valid for completed-work analysis.',
      },
      {
        q: 'Can I enter raw marks?',
        a: 'Convert raw marks to percentages first using the Grade Percentage Calculator.',
      },
      {
        q: 'How are zero-weight categories handled?',
        a: 'They contribute no points. The total weight across all categories must be positive.',
      },
    ],
  },
  {
    id: 'final',
    slug: 'final-exam-grade-calculator',
    title: 'Final Exam Grade Calculator',
    shortTitle: 'Final Exam Grade',
    description:
      'Find the final exam score you need for a target course grade, with clear explanations for impossible targets.',
    category: 'Grades & exams',
    icon: 'target',
    color: 'rose',
    keywords: ['required final exam score', 'final grade'],
    related: ['weighted', 'improvement', 'study'],
    intro:
      'Work backward from the course grade you want. Enter your current average on all non-final work, the final exam’s share of the course, and your target overall grade. The result is the exam percentage needed under that weighted grading model. It is a mathematical target rather than a prediction of exam performance.',
    steps: [
      'Use your normalized average on the work outside the final exam. Do not enter the percentage-point contribution already earned.',
      'Enter the final exam weight as a percentage of the whole course.',
      'Choose your desired course grade and calculate the required exam score.',
    ],
    formula: 'Required exam score = [target − current × (1 − weight ÷ 100)] ÷ (weight ÷ 100)',
    explanation:
      'Your non-final work contributes current grade multiplied by its remaining share of the course. The final must supply the difference between that contribution and your target. Dividing the difference by the exam weight produces the required exam percentage.',
    example:
      'With an 80% current average, a final worth 30%, and an 85% target, you need (85 − 80 × 0.70) ÷ 0.30 = 96.67% on the final.',
    mistakes: [
      'Using a gradebook average that already includes a zero for the final.',
      'Entering 0.30 instead of 30 for a final worth 30%.',
      'Rounding a minimum required score down when deciding what mark to aim for.',
    ],
    limitation:
      'The model assumes the exam score is between 0% and 100% and that no other work remains. A required score above 100% is reported as impossible without extra credit or a policy change. A negative requirement means the target is already secured in this model.',
    faqs: [
      {
        q: 'What if the final has zero weight?',
        a: 'It cannot change your course grade. The result explains whether the target is already met.',
      },
      {
        q: 'Is a score above 100% hidden?',
        a: 'No. The actual computed requirement is displayed and marked as mathematically impossible under the stated assumptions.',
      },
      {
        q: 'What if several assessments remain?',
        a: 'Use Grade Improvement to calculate the average needed across all remaining assessed weight.',
      },
    ],
  },
  {
    id: 'attendance',
    slug: 'attendance-percentage-calculator',
    title: 'Attendance Percentage Calculator',
    shortTitle: 'Attendance Percentage',
    description:
      'Calculate attendance from classes attended and held, or enter missed classes for a quick attendance check.',
    category: 'Attendance',
    icon: 'calendar',
    color: 'teal',
    keywords: ['attendance percentage', 'classes missed'],
    related: ['required', 'study', 'percentage'],
    intro:
      'Check your attendance using the sessions that have actually taken place. Enter your attended classes and total classes held, or switch to missed-class entry. The result includes your attendance percentage and the number of sessions missed. It does not count classes scheduled for the future.',
    steps: [
      'Count the classes already held during the period you want to check.',
      'Enter either classes attended or classes missed. The two entry methods represent the same calculation.',
      'Calculate attendance and compare the result with your institution’s policy.',
    ],
    formula: 'Attendance percentage = classes attended ÷ total classes held × 100',
    explanation:
      'The denominator is the number of sessions held, including missed sessions. When you enter missed classes, attended classes are calculated as total held minus missed. Whole class counts are required so that a partial class is not silently interpreted as a full session.',
    example:
      'If 40 classes have been held and you attended 32, your attendance is 32 ÷ 40 × 100 = 80%. You missed 8 classes.',
    mistakes: [
      'Dividing by all classes scheduled for the term instead of those already held.',
      'Counting an excused absence as attended when the official policy treats it differently.',
      'Using the number of absences as the attended-class count.',
    ],
    limitation:
      'Some institutions count contact hours, lateness, excused absences, or different course components separately. Use consistent units and official counts. A percentage is undefined when no classes have been held.',
    faqs: [
      {
        q: 'Can attended classes exceed total classes?',
        a: 'No. The tool rejects counts that cannot describe the same set of sessions.',
      },
      {
        q: 'Why are fractional classes rejected?',
        a: 'This tool uses session counts. If your school uses hours, obtain a policy-specific calculation instead.',
      },
      {
        q: 'How can I reach the required percentage?',
        a: 'Open Required Attendance to calculate the consecutive future classes needed.',
      },
    ],
  },
  {
    id: 'required',
    slug: 'required-attendance-calculator',
    title: 'Required Attendance Calculator',
    shortTitle: 'Required Attendance',
    description:
      'Find how many future classes to attend to reach an attendance target and how many you may miss while maintaining it.',
    category: 'Attendance',
    icon: 'check',
    color: 'emerald',
    keywords: ['classes needed', 'attendance target'],
    related: ['attendance', 'study', 'final'],
    intro:
      'Plan your attendance before the next class. This tool calculates the smallest whole number of consecutive future classes you need to attend to reach a target. It also shows how many upcoming classes you may miss immediately while staying at or above that target, based on your current attendance record.',
    steps: [
      'Enter the total classes already held and how many you attended.',
      'Set the required percentage using the actual policy for your course.',
      'Review the attend and miss figures separately: both start from your current record.',
    ],
    formula:
      'Classes needed = max(0, ceil[(target × held − attended) ÷ (1 − target)]), with target expressed as a decimal',
    explanation:
      'Each attended future class increases both the attended count and the total held count. Solving (attended + x) ÷ (held + x) ≥ target gives the minimum x, rounded upward. The missed-class allowance solves attended ÷ (held + m) ≥ target and rounds downward.',
    example:
      'You attended 14 of 20 classes and need 75%. Solving (14 + x) ÷ (20 + x) ≥ 0.75 gives x ≥ 4. Attend the next 4 classes and your record becomes 18 out of 24, exactly 75%.',
    mistakes: [
      'Increasing attended classes without also increasing total classes held.',
      'Rounding a required class count down.',
      'Adding the miss allowance to the attend requirement as if they describe one combined schedule.',
    ],
    limitation:
      'If you have already missed a class, exact 100% attendance cannot be regained in a finite number of future classes. The planner assumes every future session counts equally and that enough sessions remain in the course.',
    faqs: [
      {
        q: 'What if I already meet the target?',
        a: 'The required consecutive attendance is zero. A separate allowance shows how many classes you could miss now.',
      },
      {
        q: 'What happens at a 0% target?',
        a: 'No attendance is required and there is no finite attendance-based limit on missed classes.',
      },
      {
        q: 'What if no classes have been held?',
        a: 'At a positive target, attend the first future class to establish a qualifying record.',
      },
    ],
  },
  {
    id: 'percentage',
    slug: 'grade-percentage-calculator',
    title: 'Grade Percentage Calculator',
    shortTitle: 'Grade Percentage',
    description:
      'Convert marks to a percentage with configurable decimal places and optional custom letter-grade boundaries.',
    category: 'Grades & exams',
    icon: 'percent',
    color: 'orange',
    keywords: ['marks to percentage', 'grade boundaries'],
    related: ['converter', 'weighted', 'assignment'],
    intro:
      'Convert a raw assessment score into a percentage you can compare or use in a weighted grade calculation. Choose how many decimal places to display, and optionally apply your own letter-grade boundaries. A percentage is arithmetic; a letter grade depends on the grading policy you supply.',
    steps: [
      'Enter the marks you earned and the maximum marks available on the assessment.',
      'Choose the displayed decimal precision. The underlying calculation keeps its full precision.',
      'If needed, enable custom letter boundaries and enter each label with its minimum percentage.',
    ],
    formula: 'Percentage = marks obtained ÷ total possible marks × 100',
    explanation:
      'Dividing by the total converts the raw score to a fraction of the assessment. Multiplying by 100 expresses it as a percentage. Custom letter labels are selected using the unrounded percentage, so a displayed rounded value does not change the actual boundary decision.',
    example:
      'A score of 42 out of 50 is 42 ÷ 50 × 100 = 84%. If your custom policy sets B at 80% and A at 90%, this score receives a B under that policy.',
    mistakes: [
      'Using a total of zero, which cannot produce a defined percentage.',
      'Assuming a displayed 89.50% is automatically an A.',
      'Applying a grade table from another course or institution.',
    ],
    limitation:
      'The calculator does not infer grading curves, extra-credit rules, or institutional rounding policies. Raw marks above the stated total are rejected. Letter boundaries are optional and must be checked against the actual syllabus.',
    faqs: [
      {
        q: 'Is there a universal percentage-to-letter scale?',
        a: 'No. Set your own boundaries or leave letter-grade conversion off.',
      },
      {
        q: 'Does precision change the calculation?',
        a: 'No. It only changes the number of decimal places shown.',
      },
      {
        q: 'What if no letter boundary matches?',
        a: 'The tool reports that the percentage falls below your configured boundaries.',
      },
    ],
  },
  {
    id: 'assignment',
    slug: 'assignment-weight-calculator',
    title: 'Assignment Weight Calculator',
    shortTitle: 'Assignment Weight',
    description:
      'Calculate an assignment’s percentage, its weighted course contribution, and your updated contributed course points.',
    category: 'Grades & exams',
    icon: 'document',
    color: 'violet',
    keywords: ['assignment contribution', 'assignment weight'],
    related: ['weighted', 'percentage', 'final'],
    intro:
      'Find what a single assignment adds to your overall course result. Enter its raw marks and its share of the course grade, then add that contribution to the percentage points you have already earned elsewhere. This is useful when a gradebook shows a current average but you need to understand the assignment’s actual impact.',
    steps: [
      'Enter your course contribution earned before this assignment. Use percentage points, not your normalized current-work grade.',
      'Enter the assignment’s course weight, marks obtained, and maximum available marks.',
      'Calculate its score percentage, contribution, and the updated course contribution.',
    ],
    formula:
      'Assignment contribution = (marks obtained ÷ total marks) × assignment weight; updated contribution = prior contribution + assignment contribution',
    explanation:
      'An assignment worth 20% of the course can contribute at most 20 percentage points. Scoring 75% on it contributes 15 points. These points can be added to other course contributions, but the assignment must not already be included in the prior figure.',
    example:
      'You have earned 45 course percentage points so far. An assignment worth 20% is scored 36 out of 40, or 90%. It adds 18 points and increases your earned course contribution to 63 points.',
    mistakes: [
      'Entering an 85% current average where the tool asks for points already contributed.',
      'Including the assignment in both the prior contribution and the new contribution.',
      'Giving the assignment its category weight when other assignments share that category.',
    ],
    limitation:
      'This tool does not know the weight of all previously completed work, so it does not calculate a new normalized current grade. A prior contribution plus the new assignment’s full weight cannot exceed 100% in this no-extra-credit model.',
    faqs: [
      {
        q: 'Are contributed points the same as my current average?',
        a: 'Only when all course weight has been assessed. Otherwise, use the Weighted Grade Calculator to distinguish them.',
      },
      {
        q: 'Can the assignment weight be zero?',
        a: 'Yes. Its contribution is zero, though its score percentage is still calculated.',
      },
      {
        q: 'How do I handle a category with several assignments?',
        a: 'Use the assignment’s actual share of the full course, or calculate the category average first.',
      },
    ],
  },
  {
    id: 'semester',
    slug: 'semester-gpa-planner',
    title: 'Semester GPA Planner',
    shortTitle: 'Semester GPA Planner',
    description:
      'Plan a semester GPA using expected course grades and compare saved grade scenarios without predictions or accounts.',
    category: 'GPA & credits',
    icon: 'spark',
    color: 'blue',
    keywords: ['projected GPA', 'GPA scenarios'],
    related: ['gpa', 'cgpa', 'study'],
    intro:
      'Explore how different course grades could shape your semester GPA. Enter planned credits and expected letter grades, then save the result as a scenario. Change a grade or credit load and save another scenario to compare. The planner performs deterministic weighted arithmetic; it does not predict which grades you will achieve.',
    steps: [
      'Match the editable grading scale to your institution and add your planned courses.',
      'Calculate a projected GPA using the letter grades you are considering.',
      'Save a named scenario, change your inputs, and calculate again to compare the results side by side.',
    ],
    formula:
      'Projected semester GPA = Σ(expected grade points × course credits) ÷ total planned credits',
    explanation:
      'A one-point grade improvement in a 4-credit course adds four quality points. Its impact on the semester average is four divided by the total semester credits. Scenario comparisons use the inputs at the moment each snapshot is saved.',
    example:
      'Three 3-credit courses with expected grades A, B, and B have (12 + 9 + 9) ÷ 9 = 3.33 GPA on the default scale. Raising one B to an A gives (12 + 12 + 9) ÷ 9 = 3.67.',
    mistakes: [
      'Treating an expected grade as a guarantee rather than a planning assumption.',
      'Changing a course but forgetting to recalculate before comparing.',
      'Comparing scenarios with different grading policies as though they were equivalent.',
    ],
    limitation:
      'Scenario snapshots are temporary and stay only in the current page session. They do not include institutional rules for repeats, grade forgiveness, pass/fail credits, or honors weighting unless you incorporate those rules in the inputs.',
    faqs: [
      {
        q: 'Does the planner estimate my future performance?',
        a: 'No. It calculates only the outcome of the grades and credits you enter.',
      },
      {
        q: 'Can I compare different course loads?',
        a: 'Yes. Each saved scenario records its own GPA, total credits, and scale maximum.',
      },
      {
        q: 'Are scenarios uploaded or stored?',
        a: 'No. Reloading or resetting the page clears the temporary comparison list.',
      },
    ],
  },
  {
    id: 'improvement',
    slug: 'grade-improvement-calculator',
    title: 'Grade Improvement Calculator',
    shortTitle: 'Grade Improvement',
    description:
      'Calculate the average needed across remaining assessments to reach a target final course grade.',
    category: 'Grades & exams',
    icon: 'trend',
    color: 'emerald',
    keywords: ['grade improvement', 'remaining assessment average'],
    related: ['final', 'weighted', 'study'],
    intro:
      'Understand what is still possible when part of your course is complete. Enter your average on completed work, its course weight, the remaining weight, and the final grade you want. The result is the average needed across the remaining assessments, assuming they combine according to their assigned course weights.',
    steps: [
      'Find your normalized average on completed work and the percentage of course weight it represents.',
      'Enter the remaining weight. Completed and remaining weights must total exactly 100%.',
      'Set a target and calculate the remaining-work average you need.',
    ],
    formula:
      'Required remaining average = [target − current grade × completed weight ÷ 100] ÷ (remaining weight ÷ 100)',
    explanation:
      'Completed work has already supplied a fixed course contribution. The remaining assessments must supply the difference between that contribution and the target. If their maximum contribution is insufficient, the target is reported as impossible rather than clamped to 100%.',
    example:
      'An average of 70% on 60% of the course contributes 42 points. To finish with 80%, the remaining 40% must contribute 38 points. That requires an average of 38 ÷ 0.40 = 95%.',
    mistakes: [
      'Using completed task counts instead of completed course weights.',
      'Including a missing assignment as both completed and remaining.',
      'Assuming an equal average across assessments that actually carry different weights.',
    ],
    limitation:
      'The needed figure is a weighted average across remaining assessments, not a required mark on each one. Minimum exam hurdles, resubmissions, extra credit, and grade caps are outside this model. When no assessed weight remains, only the completed grade determines the result.',
    faqs: [
      {
        q: 'What if completed and remaining weights do not add to 100%?',
        a: 'The calculator asks you to correct them so the interpretation stays consistent.',
      },
      {
        q: 'What does a negative requirement mean?',
        a: 'The target is already secured even with zero on all remaining work, under the stated model.',
      },
      {
        q: 'Can this tell me which assignment to focus on?',
        a: 'It shows the required average. Use the actual remaining weights and deadlines to decide your priorities.',
      },
    ],
  },
  {
    id: 'study',
    slug: 'study-hours-planner',
    title: 'Study Hours Planner',
    shortTitle: 'Study Hours Planner',
    description:
      'Create a deadline-first study schedule with subject priorities, available weekdays, and daily capacity checks.',
    category: 'Study planning',
    icon: 'clock',
    color: 'orange',
    keywords: ['study schedule', 'study hours planning'],
    related: ['semester', 'final', 'required'],
    intro:
      'Turn a list of subjects and estimated study hours into a concrete schedule. Choose the days you can study and a daily hour limit. The planner fills those days in deadline order, using subject priority to break ties between matching deadlines. It tells you when the workload does not fit instead of creating an unrealistic plan.',
    steps: [
      'Set a start date, select your available weekdays, and enter a realistic daily study capacity.',
      'Add subjects with estimated hours and an exam or deadline date. Higher priority is used first when deadlines match.',
      'Generate the schedule. Review any unallocated hours and adjust hours, dates, or available capacity if needed.',
    ],
    formula:
      'Daily allocation = min(remaining daily capacity, remaining subject hours), scheduled earliest deadline first',
    explanation:
      'The schedule includes the start date and the deadline date. Each available day is filled without exceeding the daily capacity. Earlier deadlines take precedence; priority and original row order break ties. Hours are allocated in increments of 0.01 hour for deterministic arithmetic.',
    example:
      'Starting Monday, a subject needs 6 hours by Wednesday. With Monday, Tuesday, and Wednesday available and a 2-hour daily capacity, the planner allocates 2 hours on each day. If you allow only Monday and Tuesday, 2 hours remain unallocated.',
    mistakes: [
      'Assuming every calendar day is a day you can study.',
      'Underestimating revision time or forgetting breaks when setting capacity.',
      'Treating an automatically generated schedule as a guarantee of learning or exam success.',
    ],
    limitation:
      'This is an editable planning aid, not a learning prediction. It has no calendar integration and does not account for time-of-day conflicts. Deadlines must be within 365 days of the start. Exam day is included; move the deadline earlier if you cannot study that day.',
    faqs: [
      {
        q: 'How does priority affect the schedule?',
        a: 'Priority breaks ties for the same deadline. It does not move a later deadline ahead of an earlier one.',
      },
      {
        q: 'What does an infeasible schedule mean?',
        a: 'Some requested study hours could not fit before their deadlines under the selected days and capacity.',
      },
      {
        q: 'Are my subjects or dates stored?',
        a: 'No. The schedule exists only in the page session and can be copied as text.',
      },
    ],
  },
  {
    id: 'converter',
    slug: 'exam-score-converter',
    title: 'Exam Score Converter',
    shortTitle: 'Exam Score Converter',
    description:
      'Convert raw marks, percentages, and equivalent mark scales with selectable rounding and custom grade boundaries.',
    category: 'Grades & exams',
    icon: 'arrows',
    color: 'rose',
    keywords: ['exam score conversion', 'equivalent marks'],
    related: ['percentage', 'weighted', 'gpa'],
    intro:
      'Express a score on a different total-mark scale without changing its proportion. Convert raw marks to a percentage, turn a percentage into equivalent marks, or rescale a result from one total to another. Choose your display precision and rounding direction, and optionally apply a grading table you supply.',
    steps: [
      'Choose raw marks to percentage, percentage to marks, or between mark scales.',
      'Enter the score and the relevant original and target totals. All totals must be positive.',
      'Select rounding and decimal precision. Enable custom boundaries only if you have an applicable grading policy.',
    ],
    formula:
      'Percentage = raw score ÷ original total × 100; equivalent marks = percentage ÷ 100 × target total',
    explanation:
      'Proportional conversion preserves the fraction of available marks. A score of 45 out of 60 represents the same fraction as 75 out of 100. Rounding affects displayed values, while a custom grade label is determined from the unrounded percentage.',
    example:
      'A score of 36 out of 48 is 75%. On a 20-mark scale the equivalent is 0.75 × 20 = 15 marks. Converting to a different total does not change the underlying 75% score.',
    mistakes: [
      'Confusing a percentage with a percentile rank among other students.',
      'Assuming proportional rescaling adjusts for different exam difficulty.',
      'Rounding repeatedly during a multi-step conversion instead of once at the end.',
    ],
    limitation:
      'This is not standardized-test equating, an official grading curve, a percentile calculation, or a cross-institution qualification conversion. Different exams can have different difficulty and grading policies even when the percentages match.',
    faqs: [
      {
        q: 'Does this convert a score into a percentile?',
        a: 'No. A percentile needs information about other test takers; this tool only rescales marks proportionally.',
      },
      {
        q: 'Can I round equivalent marks down?',
        a: 'Yes. Choose down, up, or nearest and set the desired decimal places.',
      },
      {
        q: 'Can I use custom letter grades?',
        a: 'Yes. Supply unique grade labels and minimum percentages from your own grading policy.',
      },
    ],
  },
];
export const categories = [
  'All tools',
  'GPA & credits',
  'Grades & exams',
  'Attendance',
  'Study planning',
];
export function tool(id: CalculatorId) {
  const found = calculators.find((c) => c.id === id);
  if (!found) throw new Error('Unknown calculator');
  return found;
}
