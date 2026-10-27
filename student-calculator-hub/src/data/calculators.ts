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
  /** Title-tag text, kept ≤35 characters so the " | Student Calculator Hub" suffix stays ≤60. */
  seoTitle: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  keywords: string[];
  related: CalculatorId[];
  /** Direct 40–60 word answer to "What is the <title>?", starting with "The <title> is". */
  answer: string;
  intro: string;
  steps: string[];
  /** Question-form heading for the formula section, e.g. "How is GPA calculated?". */
  formulaQuestion: string;
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
    seoTitle: 'GPA Calculator: Free Semester GPA',
    description:
      'Calculate your semester GPA from course credits and letter grades on a customizable 4.0 scale. Free and private, with quality points and total credits shown.',
    category: 'GPA & credits',
    icon: 'graduation',
    color: 'indigo',
    keywords: ['semester GPA', 'credit weighted GPA'],
    related: ['cgpa', 'semester', 'percentage'],
    answer:
      'The GPA Calculator is a free tool that works out your semester grade point average from letter grades and credit hours. It multiplies each course’s grade points by its credits, adds those quality points, and divides by total credits. It starts with a common US 4.0 scale that you can fully customize.',
    intro:
      'Turn a semester of course results into one credit-weighted average. Add each graded course, choose its letter grade, and enter its credit hours. A course with more credits contributes more to the result. This calculator starts with a common US 4.0 mapping, but you can edit every grade point to match your institution.',
    steps: [
      'Check your university’s grade-point scale, including how plus and minus grades are treated. Open “Customize grading scale” to change the defaults.',
      'Add each course that counts toward your GPA. Enter its credit hours and final letter grade; use Add course for additional rows.',
      'Select Calculate GPA to see your credit-weighted average, total credits, and total quality points.',
    ],
    formulaQuestion: 'How is GPA calculated?',
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
        q: 'How do I calculate my GPA by hand?',
        a: 'Multiply each course’s grade points by its credit hours, add those quality points together, and divide by the total credits. For example, an A (4.0) in a 3-credit course and a B (3.0) in a 4-credit course give 24 quality points over 7 credits, a GPA of 3.43. The calculator follows the same steps using unrounded values.',
      },
      {
        q: 'Can I use a different GPA scale?',
        a: 'Yes. Open “Customize grading scale” to change the maximum GPA, edit the points for every letter grade, or add a custom grade such as A+. Grade points must stay between zero and the maximum, and each course grade must exist in your configured scale. Copy the values from your institution’s official grading policy for the most accurate result.',
      },
      {
        q: 'What grade points does the default scale use?',
        a: 'The default is a common US 4.0 mapping: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, and F = 0. Schools differ, especially for plus and minus grades, so check your own scale before relying on the result.',
      },
      {
        q: 'What if a course has zero credits?',
        a: 'Leave it out of the calculation. Every course row needs a credit value greater than zero, because a zero-credit course cannot affect a credit-weighted average. Pass/fail, withdrawn, or ungraded courses often do not count toward GPA either, so follow your institution’s rules on which courses to include.',
      },
      {
        q: 'Are my course names and grades saved?',
        a: 'No. Course names, credits, and grades stay in the current page session in your browser and are never uploaded to a server. Selecting Reset or reloading the page clears them. The only thing this site stores on your device is your light or dark theme preference.',
      },
    ],
  },
  {
    id: 'cgpa',
    slug: 'cgpa-calculator',
    title: 'CGPA Calculator',
    shortTitle: 'Cumulative GPA',
    seoTitle: 'CGPA Calculator: Cumulative GPA',
    description:
      'Calculate your cumulative GPA (CGPA) by combining semester GPAs weighted by credits. Works on a 4.0, 5.0, 10.0, or any custom maximum grading scale.',
    category: 'GPA & credits',
    icon: 'layers',
    color: 'violet',
    keywords: ['cumulative GPA', 'CGPA'],
    related: ['gpa', 'semester', 'improvement'],
    answer:
      'The CGPA Calculator is a free tool that combines several semester GPAs into one cumulative grade point average. It weights each semester by its credits, so a heavier semester counts for more than a lighter one. It works on a 4.0, 5.0, 10.0, or any other maximum scale you set, as long as every semester uses it.',
    intro:
      'See how several semesters fit together. Cumulative GPA is a credit-weighted average of semester GPAs, not necessarily a simple average. Enter each semester’s GPA alongside the credits represented by that GPA. You can use a 4.0, 5.0, 10.0, or another maximum scale as long as all semesters use the same policy.',
    steps: [
      'Set the maximum GPA to match your transcript.',
      'Enter each semester’s GPA and the completed credits included in that GPA. Add or remove semesters as needed.',
      'Calculate your cumulative average and check the total credits against your records.',
    ],
    formulaQuestion: 'How is CGPA calculated?',
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
        q: 'Is CGPA the same as the average of my semester GPAs?',
        a: 'Only when every semester has the same number of credits. Cumulative GPA is credit-weighted: each semester GPA is multiplied by its credits, the results are added, and the total is divided by all credits. A 3.50 over 15 credits and a 3.80 over 12 credits give a CGPA of 3.63, not the simple average of 3.65.',
      },
      {
        q: 'Can I include summer semesters?',
        a: 'Yes, if their credits and grades count toward the same cumulative GPA on your transcript. Add the summer term as another semester row with its GPA and the credits included in that GPA. If your institution excludes summer or transfer credits from the cumulative figure, leave them out here too.',
      },
      {
        q: 'Does this convert between grading systems?',
        a: 'No. Every semester must already be on the same scale, set with the Maximum GPA field, and each semester GPA must be between zero and that maximum. Converting a 10-point GPA to a 4.0 scale depends on an official institutional conversion table, so apply that conversion first if you need one.',
      },
      {
        q: 'Why is my official CGPA slightly different?',
        a: 'Your institution may calculate CGPA from individual course grade points rather than rounded semester GPAs. It may also exclude some credits, replace repeated course grades, or treat transfer credits separately. Entering semester GPAs with more decimal places and the exact GPA credits from your transcript gives the closest estimate.',
      },
      {
        q: 'Are my semester GPAs stored anywhere?',
        a: 'No. Everything you enter stays in your browser for the current page session and is never uploaded to a server. Calculations run entirely on your device, so there is no account to create and nothing to delete afterward. Select Reset or reload the page to clear your semesters.',
      },
    ],
  },
  {
    id: 'weighted',
    slug: 'weighted-grade-calculator',
    title: 'Weighted Grade Calculator',
    shortTitle: 'Weighted Grade',
    seoTitle: 'Free Weighted Grade Calculator',
    description:
      'Calculate a weighted grade from category scores and syllabus weights. See your completed-work average and course contribution in percentage points.',
    category: 'Grades & exams',
    icon: 'chart',
    color: 'blue',
    keywords: ['weighted average grade', 'category weights'],
    related: ['final', 'assignment', 'improvement'],
    answer:
      'The Weighted Grade Calculator is a free tool that combines category scores, such as quizzes, projects, and exams, using the weights from your syllabus. It reports your normalized average on completed work and the percentage points those categories contribute to the whole course. The two results match only when the weights total 100%.',
    intro:
      'A quiz average and a final exam may count very differently toward a course grade. This tool combines scores using your syllabus weights and shows two useful results: your normalized average on the categories entered, and their contribution to the whole course. These numbers are identical only when the included weights total 100%.',
    steps: [
      'Add each assessed category, such as quizzes, projects, or exams.',
      'Enter its score percentage and its share of the full course grade. Use weights from the syllabus, not equal weights unless that is the actual policy.',
      'Review the weight total and both result measures. Enter only completed categories for a current-work average.',
    ],
    formulaQuestion: 'How is a weighted grade calculated?',
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
        q: 'How do I calculate a weighted grade?',
        a: 'Multiply each category score by its weight, divide by 100, and add the results to get the course contribution. Divide that contribution by the total weight entered and multiply by 100 for the normalized grade. An 80% at 30% weight and a 90% at 20% weight contribute 42 points, a normalized grade of 84%.',
      },
      {
        q: 'Do weights have to total 100%?',
        a: 'Only for a complete final course grade. A weight total below 100% is valid when you are analyzing completed work, and the calculator shows the running total so you can see how much of the course is assessed. Totals above 100% are rejected, and the total weight must be greater than zero.',
      },
      {
        q: 'What is the difference between course contribution and normalized grade?',
        a: 'Course contribution is the percentage points already earned toward the whole course, while the normalized grade is your average on only the weight you entered. With 50% of the course assessed and 42 points earned, your contribution is 42 points but your current-work grade is 84%. Reporting 42 as your grade would be a mistake.',
      },
      {
        q: 'Can I enter raw marks?',
        a: 'Not directly. Each category needs a score from 0 to 100%. Convert raw marks to a percentage first with the Grade Percentage Calculator, so 42 out of 50 becomes 84%, then enter that percentage alongside the category’s weight. Apply dropped scores or extra-credit rules before you enter the category average.',
      },
      {
        q: 'How are zero-weight categories handled?',
        a: 'A category with 0% weight contributes no points and does not change either result. You can keep it in the list for reference, but at least one category must carry positive weight, because a normalized grade cannot be calculated when the total weight is zero.',
      },
    ],
  },
  {
    id: 'final',
    slug: 'final-exam-grade-calculator',
    title: 'Final Exam Grade Calculator',
    shortTitle: 'Final Exam Grade',
    seoTitle: 'Final Exam Grade Calculator',
    description:
      'Find the final exam score you need to reach your target course grade. Enter your current grade and exam weight; impossible targets are clearly flagged.',
    category: 'Grades & exams',
    icon: 'target',
    color: 'rose',
    keywords: ['required final exam score', 'final grade'],
    related: ['weighted', 'improvement', 'study'],
    answer:
      'The Final Exam Grade Calculator is a free tool that works out the score you need on your final exam to reach a target course grade. Enter your current average on non-final work, the exam’s weight, and your goal. It also flags targets that are already secured or mathematically impossible.',
    intro:
      'Work backward from the course grade you want. Enter your current average on all non-final work, the final exam’s share of the course, and your target overall grade. The result is the exam percentage needed under that weighted grading model. It is a mathematical target rather than a prediction of exam performance.',
    steps: [
      'Use your normalized average on the work outside the final exam. Do not enter the percentage-point contribution already earned.',
      'Enter the final exam weight as a percentage of the whole course.',
      'Choose your desired course grade and calculate the required exam score.',
    ],
    formulaQuestion: 'How is the required final exam score calculated?',
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
        q: 'What score do I need on my final exam?',
        a: 'Subtract your current grade multiplied by the non-final share of the course from your target, then divide by the exam weight. With an 80% current grade, a final worth 30%, and an 85% target, you need (85 − 80 × 0.70) ÷ 0.30 = 96.67%. The calculator does this instantly and shows the maximum grade still possible.',
      },
      {
        q: 'What if the final has zero weight?',
        a: 'A zero-weight final cannot change your course grade, so no required score is shown. Instead, the calculator tells you whether your current grade already meets the target or whether the target is out of reach. If you expected the final to count, check the exam’s weight in your syllabus.',
      },
      {
        q: 'Is a score above 100% hidden?',
        a: 'No. The actual computed requirement is displayed, even when it exceeds 100%, and the result is marked as out of reach under the stated assumptions. That usually means the target needs extra credit or a policy change. The result also shows the maximum course grade you can still reach with a perfect final.',
      },
      {
        q: 'Should I enter my gradebook average as my current grade?',
        a: 'Enter your normalized average on all work outside the final exam, not the percentage points already contributed. Check that your gradebook average does not already include a zero for the final, because that would understate your current grade and overstate the score you need.',
      },
      {
        q: 'What if several assessments remain?',
        a: 'This calculator assumes the final is the only remaining assessment. When several assignments or exams are still to come, use the Grade Improvement Calculator, which works out the average you need across all remaining course weight. Completed and remaining weights there must add up to exactly 100%.',
      },
    ],
  },
  {
    id: 'attendance',
    slug: 'attendance-percentage-calculator',
    title: 'Attendance Percentage Calculator',
    shortTitle: 'Attendance Percentage',
    seoTitle: 'Attendance Percentage Calculator',
    description:
      'Calculate your attendance percentage from classes attended and classes held, or from classes missed. See your rate and missed sessions in seconds.',
    category: 'Attendance',
    icon: 'calendar',
    color: 'teal',
    keywords: ['attendance percentage', 'classes missed'],
    related: ['required', 'study', 'percentage'],
    answer:
      'The Attendance Percentage Calculator is a free tool that works out your attendance rate from the classes you attended and the classes held so far. You can enter missed classes instead of attended ones. It divides attended classes by total classes held, multiplies by 100, and shows how many sessions you missed.',
    intro:
      'Check your attendance using the sessions that have actually taken place. Enter your attended classes and total classes held, or switch to missed-class entry. The result includes your attendance percentage and the number of sessions missed. It does not count classes scheduled for the future.',
    steps: [
      'Count the classes already held during the period you want to check.',
      'Enter either classes attended or classes missed. The two entry methods represent the same calculation.',
      'Calculate attendance and compare the result with your institution’s policy.',
    ],
    formulaQuestion: 'How is attendance percentage calculated?',
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
        q: 'How do I calculate my attendance percentage?',
        a: 'Divide the number of classes you attended by the total number of classes held so far, then multiply by 100. If 40 classes have been held and you attended 32, your attendance is 32 ÷ 40 × 100 = 80%, with 8 classes missed. Use classes already held, not every class scheduled for the term.',
      },
      {
        q: 'Can attended classes exceed total classes?',
        a: 'No. Attended classes must be between zero and the total classes held, because both numbers describe the same set of sessions. The calculator rejects a higher count with an error rather than reporting an attendance rate above 100%. In missed-class mode, missed classes also cannot exceed the total held.',
      },
      {
        q: 'Why are fractional classes rejected?',
        a: 'The calculator counts whole sessions, so a partial class is never silently treated as a full one. Classes attended and classes held must be whole numbers, and at least one class must have been held. If your school measures attendance in contact hours, use a policy-specific calculation based on hours instead.',
      },
      {
        q: 'Do excused absences count as attended?',
        a: 'That depends on your institution’s policy. Some schools treat excused absences as attended, some remove those sessions from the total, and some count them as missed. Enter your numbers the way your official attendance record counts them, then compare the result with the attendance policy for your course.',
      },
      {
        q: 'How can I reach the required percentage?',
        a: 'Use the Required Attendance Calculator. It works out the smallest number of consecutive future classes you need to attend to reach a target such as 75%, and how many upcoming classes you could miss while staying at or above it. Both figures start from your current attended and held counts.',
      },
    ],
  },
  {
    id: 'required',
    slug: 'required-attendance-calculator',
    title: 'Required Attendance Calculator',
    shortTitle: 'Required Attendance',
    seoTitle: 'Required Attendance Calculator',
    description:
      'Find how many classes you must attend to reach an attendance target such as 75%, and how many you can miss now while staying at or above it.',
    category: 'Attendance',
    icon: 'check',
    color: 'emerald',
    keywords: ['classes needed', 'attendance target'],
    related: ['attendance', 'study', 'final'],
    answer:
      'The Required Attendance Calculator is a free tool that tells you how many consecutive future classes you must attend to reach an attendance target, such as 75%. It also shows how many upcoming classes you could miss right now while staying at or above that target, starting from your current attendance record.',
    intro:
      'Plan your attendance before the next class. This tool calculates the smallest whole number of consecutive future classes you need to attend to reach a target. It also shows how many upcoming classes you may miss immediately while staying at or above that target, based on your current attendance record.',
    steps: [
      'Enter the total classes already held and how many you attended.',
      'Set the required percentage using the actual policy for your course.',
      'Review the attend and miss figures separately: both start from your current record.',
    ],
    formulaQuestion: 'How is the number of classes needed calculated?',
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
        q: 'How many classes do I need to attend to reach 75%?',
        a: 'Solve (attended + x) ÷ (held + x) ≥ 0.75 for the smallest whole number x. If you attended 14 of 20 classes, x = (0.75 × 20 − 14) ÷ 0.25 = 4, so attending the next 4 classes in a row brings you to 18 of 24, exactly 75%. The calculator always rounds this requirement up.',
      },
      {
        q: 'How many classes can I miss and still meet my target?',
        a: 'The calculator finds the largest number of upcoming classes you could miss immediately while staying at or above the target, solving attended ÷ (held + m) ≥ target and rounding down. With 18 of 20 classes attended and a 75% target, you could miss the next 4 classes. This allowance is separate from the attend figure.',
      },
      {
        q: 'What if I already meet the target?',
        a: 'The required number of consecutive classes is zero, and the result confirms that your current record already meets the target. Check the separate allowance, which shows how many upcoming classes you could miss right now while staying at or above it. Both figures assume every future session counts equally.',
      },
      {
        q: 'Can I get back to 100% attendance after missing a class?',
        a: 'No. Once you have missed a class, exact 100% attendance cannot be regained in any finite number of future classes, because every class you attend also increases the total held. The calculator reports this as not possible. Targets below 100% can always be reached if enough sessions remain in the course.',
      },
      {
        q: 'What happens at a 0% target?',
        a: 'No attendance is required, so the number of classes needed is zero, and there is no finite attendance-based limit on missed classes. The calculator shows “No finite limit” for the allowance. Check your course policy for the real minimum, because a 0% target is mainly useful as a sanity check.',
      },
      {
        q: 'What if no classes have been held?',
        a: 'With a positive target, the calculator asks you to attend the first future class, because one attended session out of one held gives 100% and establishes a qualifying record. The miss allowance is zero at that point. Recalculate once more classes have been held for a more useful plan.',
      },
    ],
  },
  {
    id: 'percentage',
    slug: 'grade-percentage-calculator',
    title: 'Grade Percentage Calculator',
    shortTitle: 'Grade Percentage',
    seoTitle: 'Grade Percentage Calculator',
    description:
      'Convert marks to a percentage with adjustable decimal places and optional custom letter-grade boundaries. See instantly what your score is out of 100.',
    category: 'Grades & exams',
    icon: 'percent',
    color: 'orange',
    keywords: ['marks to percentage', 'grade boundaries'],
    related: ['converter', 'weighted', 'assignment'],
    answer:
      'The Grade Percentage Calculator is a free tool that converts the marks you earned on a test or assignment into a percentage. It divides marks obtained by total possible marks and multiplies by 100. You can display 0 to 4 decimal places and optionally apply your own letter-grade boundaries to label the result.',
    intro:
      'Convert a raw assessment score into a percentage you can compare or use in a weighted grade calculation. Choose how many decimal places to display, and optionally apply your own letter-grade boundaries. A percentage is arithmetic; a letter grade depends on the grading policy you supply.',
    steps: [
      'Enter the marks you earned and the maximum marks available on the assessment.',
      'Choose the displayed decimal precision. The underlying calculation keeps its full precision.',
      'If needed, enable custom letter boundaries and enter each label with its minimum percentage.',
    ],
    formulaQuestion: 'How do you calculate a grade percentage?',
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
        q: 'How do I convert marks to a percentage?',
        a: 'Divide the marks you earned by the total marks available, then multiply by 100. A score of 42 out of 50 is 42 ÷ 50 × 100 = 84%. The calculator does this instantly, keeps full precision internally, and lets you choose how many decimal places to display, from 0 to 4.',
      },
      {
        q: 'Is there a universal percentage-to-letter scale?',
        a: 'No. Letter-grade boundaries differ between countries, institutions, and even courses, so the calculator does not apply one by default. To get a letter, enable custom boundaries and enter each label with its minimum percentage, one per line, such as A:90. Use the boundaries from your own syllabus.',
      },
      {
        q: 'Does precision change the calculation?',
        a: 'No. The decimal places setting only changes how many digits are displayed. The underlying percentage keeps full precision, and custom letter grades are assigned from the unrounded value. For example, 89.999% displays as 90.0% with one decimal place but still falls below a 90% boundary for an A.',
      },
      {
        q: 'Can my marks be higher than the total?',
        a: 'No. Marks obtained cannot exceed the total possible marks, and the total must be greater than zero. If your course awards bonus marks, check how your instructor records them, because extra credit, grading curves, and institutional rounding rules are not applied automatically by this calculator.',
      },
      {
        q: 'What if no letter boundary matches?',
        a: 'The result says the percentage falls below your configured boundaries. Add a lowest boundary, such as F:0, if every score should receive a label. Each boundary needs a unique, non-empty label and a unique minimum percentage between 0 and 100, entered as label:minimum on its own line.',
      },
    ],
  },
  {
    id: 'assignment',
    slug: 'assignment-weight-calculator',
    title: 'Assignment Weight Calculator',
    shortTitle: 'Assignment Weight',
    seoTitle: 'Assignment Weight Calculator',
    description:
      'Calculate an assignment’s score percentage, its weighted contribution to your course grade, and your updated total of earned course percentage points.',
    category: 'Grades & exams',
    icon: 'document',
    color: 'violet',
    keywords: ['assignment contribution', 'assignment weight'],
    related: ['weighted', 'percentage', 'final'],
    answer:
      'The Assignment Weight Calculator is a free tool that shows how much a single assignment adds to your overall course result. It converts your marks to a percentage, multiplies that by the assignment’s course weight, and adds the contribution to the percentage points you have already earned elsewhere in the course.',
    intro:
      'Find what a single assignment adds to your overall course result. Enter its raw marks and its share of the course grade, then add that contribution to the percentage points you have already earned elsewhere. This is useful when a gradebook shows a current average but you need to understand the assignment’s actual impact.',
    steps: [
      'Enter your course contribution earned before this assignment. Use percentage points, not your normalized current-work grade.',
      'Enter the assignment’s course weight, marks obtained, and maximum available marks.',
      'Calculate its score percentage, contribution, and the updated course contribution.',
    ],
    formulaQuestion: 'How is an assignment’s weighted contribution calculated?',
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
        q: 'How much does an assignment affect my grade?',
        a: 'An assignment can contribute at most its weight in percentage points. Multiply your score percentage by the assignment’s weight and divide by 100. Scoring 36 out of 40 (90%) on an assignment worth 20% adds 18 points; added to 45 points already earned, your course contribution becomes 63 points.',
      },
      {
        q: 'Are contributed points the same as my current average?',
        a: 'Only when all course weight has been assessed. Contributed points measure progress toward the whole course, while a current average describes only the work completed so far. To see both measures for completed categories, use the Weighted Grade Calculator, which reports your contribution and your normalized grade side by side.',
      },
      {
        q: 'Can the assignment weight be zero?',
        a: 'Yes. A zero-weight assignment contributes no course points, but the calculator still shows its score percentage, which is useful for practice tasks or ungraded work. Your updated course contribution simply stays equal to the points you entered as already earned before this assignment.',
      },
      {
        q: 'How do I handle a category with several assignments?',
        a: 'Use the assignment’s actual share of the full course, not the whole category weight. If four equally weighted labs share a 20% category, each lab is worth 5% of the course. Alternatively, average the category first and enter it in the Weighted Grade Calculator with the full category weight.',
      },
      {
        q: 'Why can’t my earned points plus the assignment weight exceed 100?',
        a: 'This calculator uses a no-extra-credit model, so the points you have already earned plus this assignment’s full weight cannot exceed 100% of the course. An error usually means the assignment is already included in your prior contribution. Remove it from that figure, or check the weights in your syllabus.',
      },
    ],
  },
  {
    id: 'semester',
    slug: 'semester-gpa-planner',
    title: 'Semester GPA Planner',
    shortTitle: 'Semester GPA Planner',
    seoTitle: 'Semester GPA Planner: What-If GPA',
    description:
      'Plan your semester GPA with expected grades and course credits, then save and compare what-if scenarios side by side. No predictions and no accounts.',
    category: 'GPA & credits',
    icon: 'spark',
    color: 'blue',
    keywords: ['projected GPA', 'GPA scenarios'],
    related: ['gpa', 'cgpa', 'study'],
    answer:
      'The Semester GPA Planner is a free what-if tool for projecting a semester GPA from the grades you expect and the credits you plan to take. Save each result as a named scenario, change a grade or course load, and compare scenarios side by side. It calculates only what you enter and never predicts grades.',
    intro:
      'Explore how different course grades could shape your semester GPA. Enter planned credits and expected letter grades, then save the result as a scenario. Change a grade or credit load and save another scenario to compare. The planner performs deterministic weighted arithmetic; it does not predict which grades you will achieve.',
    steps: [
      'Match the editable grading scale to your institution and add your planned courses.',
      'Calculate a projected GPA using the letter grades you are considering.',
      'Save a named scenario, change your inputs, and calculate again to compare the results side by side.',
    ],
    formulaQuestion: 'How is a projected semester GPA calculated?',
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
        a: 'No. It calculates only the outcome of the grades and credits you enter, using the same credit-weighted arithmetic as the GPA Calculator. It does not predict which grades you will achieve. Treat each scenario as a planning assumption, and use it to see which courses would move your GPA the most.',
      },
      {
        q: 'How much will one better grade raise my GPA?',
        a: 'Divide the extra quality points by your total semester credits. Raising a B (3.0) to an A (4.0) in a 3-credit course adds 3 quality points; across 9 credits that lifts the semester GPA by 0.33, from 3.33 to 3.67 on the default scale. Higher-credit courses move the result more.',
      },
      {
        q: 'Can I compare different course loads?',
        a: 'Yes. Each saved scenario records its own GPA, total credits, and maximum scale, so you can compare a 12-credit plan with a 15-credit plan, or different expected grades. Select Calculate projection after changing your inputs, because each scenario saves the result shown at that moment.',
      },
      {
        q: 'Can I use a 5.0 or custom grading scale?',
        a: 'Yes. Expand the grading scale settings in the planner to set a different maximum GPA, change the points for each letter grade, or add a custom grade such as A+. Compare scenarios only when they use the same grading policy, because GPAs calculated on different scales are not directly comparable.',
      },
      {
        q: 'Are scenarios uploaded or stored?',
        a: 'No. Scenarios are temporary and stay only in the current page session in your browser. Nothing is uploaded to a server and no account is needed. Reloading the page or selecting Reset clears the comparison list, so note down any scenario you want to keep before leaving.',
      },
    ],
  },
  {
    id: 'improvement',
    slug: 'grade-improvement-calculator',
    title: 'Grade Improvement Calculator',
    shortTitle: 'Grade Improvement',
    seoTitle: 'Grade Improvement Calculator',
    description:
      'Calculate the average you need on remaining assessments to reach your target course grade, based on completed work and the course weight still to come.',
    category: 'Grades & exams',
    icon: 'trend',
    color: 'emerald',
    keywords: ['grade improvement', 'remaining assessment average'],
    related: ['final', 'weighted', 'study'],
    answer:
      'The Grade Improvement Calculator is a free tool that works out the average you need across your remaining assessments to finish a course with a target grade. Enter your average on completed work, the completed and remaining course weights, and your goal. It shows whether the target is possible, already secured, or out of reach.',
    intro:
      'Understand what is still possible when part of your course is complete. Enter your average on completed work, its course weight, the remaining weight, and the final grade you want. The result is the average needed across the remaining assessments, assuming they combine according to their assigned course weights.',
    steps: [
      'Find your normalized average on completed work and the percentage of course weight it represents.',
      'Enter the remaining weight. Completed and remaining weights must total exactly 100%.',
      'Set a target and calculate the remaining-work average you need.',
    ],
    formulaQuestion: 'How is the required remaining average calculated?',
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
        q: 'What average do I need on my remaining work?',
        a: 'Subtract the points your completed work already contributes from your target, then divide by the remaining weight. A 70% average on 60% of the course contributes 42 points. To finish with 80%, the remaining 40% must supply 38 points, which requires an average of 38 ÷ 0.40 = 95%.',
      },
      {
        q: 'What if completed and remaining weights do not add to 100%?',
        a: 'The calculator asks you to correct them, because completed and remaining weights must total exactly 100% for the result to describe your final course grade. Use course weights from your syllabus, not the number of tasks completed, and do not count a missing assignment as both completed and remaining.',
      },
      {
        q: 'What does a negative requirement mean?',
        a: 'A negative requirement means your target is already secured, even with zero on all remaining work, under the stated model. The calculator labels this as secured rather than presenting it as a goal. Minimum exam hurdles or pass requirements may still apply, so check your course rules.',
      },
      {
        q: 'Is the required average a mark I need on every assessment?',
        a: 'No. It is a weighted average across all remaining assessments, so a lower score on one can be balanced by a higher score on another. Assessments with larger weights affect that average more. Use the actual remaining weights and deadlines to decide where to focus your effort.',
      },
      {
        q: 'What if the required average is above 100%?',
        a: 'The target is reported as out of reach in this model rather than being clamped to 100%. The result also shows the maximum final grade still possible if you score 100% on everything that remains. Reaching the original target would need extra credit, a resubmission, or a policy change.',
      },
    ],
  },
  {
    id: 'study',
    slug: 'study-hours-planner',
    title: 'Study Hours Planner',
    shortTitle: 'Study Hours Planner',
    seoTitle: 'Study Hours Planner: Exam Schedule',
    description:
      'Build a deadline-first study schedule from subjects, estimated hours, available weekdays, and a daily hour limit. See instantly whether your workload fits.',
    category: 'Study planning',
    icon: 'clock',
    color: 'orange',
    keywords: ['study schedule', 'study hours planning'],
    related: ['semester', 'final', 'required'],
    answer:
      'The Study Hours Planner is a free tool that turns your subjects and estimated study hours into a day-by-day schedule. Choose the weekdays you can study and a daily hour limit. It fills each day in earliest-deadline order and tells you when the workload does not fit, instead of creating an unrealistic plan.',
    intro:
      'Turn a list of subjects and estimated study hours into a concrete schedule. Choose the days you can study and a daily hour limit. The planner fills those days in deadline order, using subject priority to break ties between matching deadlines. It tells you when the workload does not fit instead of creating an unrealistic plan.',
    steps: [
      'Set a start date, select your available weekdays, and enter a realistic daily study capacity.',
      'Add subjects with estimated hours and an exam or deadline date. Higher priority is used first when deadlines match.',
      'Generate the schedule. Review any unallocated hours and adjust hours, dates, or available capacity if needed.',
    ],
    formulaQuestion: 'How does the Study Hours Planner schedule hours?',
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
        a: 'Priority only breaks ties between subjects with the same deadline. A subject marked Highest is scheduled before High or Normal subjects due on the same day, but it never moves ahead of a subject with an earlier deadline. When priority also matches, the order of your subject rows decides.',
      },
      {
        q: 'What does an infeasible schedule mean?',
        a: 'Some requested study hours could not fit before their deadlines with the selected days and daily capacity. The planner lists the unallocated hours for each subject instead of overfilling your days. To fix it, add study days, raise your daily capacity, reduce the estimated hours, or choose an earlier start date.',
      },
      {
        q: 'Is the deadline day included in the plan?',
        a: 'Yes. The schedule includes both the start date and the deadline date, so study time can be placed on exam day itself. If you cannot study that day, set the deadline one day earlier. Every deadline must fall on or after the start date and within 365 days of it.',
      },
      {
        q: 'How much study time can I schedule per day?',
        a: 'Set a daily capacity between 0.01 and 24 hours, and the planner never schedules more than that on any available day. Hours are allocated in steps of 0.01 hour so the arithmetic stays exact. Choose a realistic figure that leaves room for classes, breaks, and rest, not your theoretical maximum.',
      },
      {
        q: 'Are my subjects or dates stored?',
        a: 'No. Your subjects, hours, and dates exist only in the current page session in your browser and are never uploaded to a server. Use Copy schedule to copy the plan as plain text into your notes or calendar. Reloading the page or selecting Reset clears everything you entered.',
      },
    ],
  },
  {
    id: 'converter',
    slug: 'exam-score-converter',
    title: 'Exam Score Converter',
    shortTitle: 'Exam Score Converter',
    seoTitle: 'Exam Score Converter: Marks to %',
    description:
      'Convert exam scores between raw marks, percentages, and other mark scales, with nearest, up, or down rounding and optional custom grade boundaries.',
    category: 'Grades & exams',
    icon: 'arrows',
    color: 'rose',
    keywords: ['exam score conversion', 'equivalent marks'],
    related: ['percentage', 'weighted', 'gpa'],
    answer:
      'The Exam Score Converter is a free tool that rescales a score without changing its proportion. Convert raw marks to a percentage, a percentage to equivalent marks, or a score from one total to another, such as 36 out of 48 to 15 out of 20. Choose decimal places, rounding direction, and optional grade boundaries.',
    intro:
      'Express a score on a different total-mark scale without changing its proportion. Convert raw marks to a percentage, turn a percentage into equivalent marks, or rescale a result from one total to another. Choose your display precision and rounding direction, and optionally apply a grading table you supply.',
    steps: [
      'Choose raw marks to percentage, percentage to marks, or between mark scales.',
      'Enter the score and the relevant original and target totals. All totals must be positive.',
      'Select rounding and decimal precision. Enable custom boundaries only if you have an applicable grading policy.',
    ],
    formulaQuestion: 'How are exam scores converted between scales?',
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
        q: 'How do I convert a score to a different total?',
        a: 'Divide your score by the original total to get the percentage, then multiply that fraction by the new total. A score of 36 out of 48 is 75%, so on a 20-mark scale it is 0.75 × 20 = 15 marks. The converter does both steps and rounds only the displayed values.',
      },
      {
        q: 'Does this convert a score into a percentile?',
        a: 'No. A percentile ranks your score against other test takers and needs information about everyone who sat the exam. This tool only rescales marks proportionally, so 75% means you earned three quarters of the available marks, not that you outperformed 75% of students.',
      },
      {
        q: 'Can I round equivalent marks down?',
        a: 'Yes. Choose Nearest, Down, or Up rounding and set between 0 and 4 decimal places. Rounding is applied once to the displayed result, while any custom grade label is decided from the unrounded percentage, so rounding never pushes a score across a grade boundary.',
      },
      {
        q: 'Can I use custom letter grades?',
        a: 'Yes. Turn on custom letter-grade boundaries and enter one label and minimum percentage per line, such as A:90. Each label and each minimum must be unique. Use the boundaries from your own grading policy, because no universal letter scale is applied by default and boundaries differ between institutions.',
      },
      {
        q: 'Does rescaling adjust for a harder exam?',
        a: 'No. Proportional conversion preserves the fraction of marks earned but does not account for differences in exam difficulty, grading curves, or official equating. Use it to express the same result on another mark scale, not to compare performance across different exams, institutions, or qualifications.',
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
