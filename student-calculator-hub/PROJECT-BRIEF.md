# CODEX MASTER PROMPT — STUDENT CALCULATOR HUB

## ROLE

You are a senior full-stack engineer, UI/UX designer, technical SEO specialist, QA engineer, and production deployment architect.

Your assignment is to autonomously design, implement, test, document, and prepare a complete, production-ready Student Calculator Hub website.

**This is an implementation task, not a planning-only task.**

Do not stop after scaffolding, generating documentation, or implementing a few calculators.

Complete the entire working application in this run, including all 12 calculators, responsive UI, SEO, testing, and deployment configuration.

Do not ask routine clarification questions. Make reasonable technical decisions, document your assumptions, and proceed.

Do not claim completion until all required functionality is implemented and verified.

---

# 1. PRODUCT OVERVIEW

Build an attractive, fast, fully functional educational calculator website targeting a global English-speaking audience, particularly students in the United States, United Kingdom, Canada, Australia, and other English-speaking regions.

The website will contain 12 calculators related to academic grades, GPA, CGPA, attendance, examinations, assignments, and study planning.

### Primary goals

1. Rank organically for relevant Google search queries.
2. Provide genuinely useful, accurate educational calculators.
3. Deliver excellent user experience on desktop, tablet, and mobile.
4. Qualify for Google AdSense review through original, useful content and compliant site architecture.
5. Operate on Cloudflare's free hosting infrastructure.
6. Require no paid APIs, database, backend server, or external AI inference.
7. Be extensible for future calculators.
8. Be accessible and privacy-conscious.

### Business model

- Free calculators without login or paywalls.
- Google AdSense as the intended monetization method, once approved.
- Organic Google Search as the primary acquisition channel.
- Secondary acquisition from educational websites, social sharing, and direct traffic.

Do not integrate misleading advertising, fake download controls, or intrusive popups.

---

# 2. PROJECT NAME AND BRANDING

Working name: **Student Calculator Hub**

Use a central site configuration file for:

- Website name
- Domain
- Tagline
- Logo
- Primary colors
- Contact email
- Social links
- Analytics IDs
- AdSense publisher ID
- Base URL

Use a clearly marked placeholder domain such as:

`https://example.com`

Do not treat the placeholder domain as a real production domain.

Generate the necessary branding assets yourself using CSS or SVG.

Do not use copyrighted logos or reproduce somebody else's Dribbble design exactly.

---

# 3. DESIGN DIRECTION

### Reference

Use the supplied Dribbble reference:

"GPA Calculator UI - anbean KAMPÜS" by Eren Karabulut.

Reference URL:

https://images.openai.com/static-rsc-4/X6_BUSKSgVB5z7I_coLEaSRm8lFKpqxtHoIMrNO5DuvHGl2GA-JVQfTi9MVgfWEfg7lwf0ADkIdfuwopwHF_EIsWte9N6HLAV-ujhyP4WRrVEC_UwjBh2lpWgvN3V9Z87AVeMP4MuEcFj4D-Kq283H72Wrw6NBYcuY7L9SjkblE?purpose=inline

Use it for visual inspiration only.

If the reference cannot be accessed, proceed with the design specification below.

### Visual identity

Create a premium, modern educational dashboard that looks like a real product rather than a generic template.

Design principles:

- Clean, contemporary SaaS interface.
- Light theme by default.
- Optional dark mode.
- Soft off-white page background.
- White calculator surfaces.
- Rounded cards.
- Subtle borders.
- Restrained shadows.
- Modern typography.
- Pleasant blue and indigo accents.
- Excellent spacing and visual hierarchy.
- Clear form labels and interactive feedback.
- Minimal visual clutter.
- Professional navigation.
- Small, purposeful animations.

Suggested colors:

- Background: #F8FAFC
- Surface: #FFFFFF
- Primary: #4F46E5
- Secondary: #2563EB
- Text: #0F172A
- Muted text: #64748B
- Border: #E2E8F0
- Success: #16A34A
- Warning: #D97706
- Error: #DC2626

Use Inter or another well-supported, performant font.

### Layout

Desktop:

- Header with logo, navigation, and theme toggle.
- Spacious homepage hero.
- Featured calculators.
- Category sections.
- Searchable calculator directory.
- Individual calculator pages.
- Related calculators.
- Educational explanations.
- Footer with site navigation and legal pages.

Mobile:

- Fully responsive layout.
- Clear mobile navigation.
- Touch-friendly inputs.
- No horizontal scrolling.
- Readable tables.
- Accessible buttons.
- Excellent usability on screens as narrow as 320px.

Use consistent design patterns across all calculators.

---

# 4. TECHNOLOGY STACK

Use:

- Astro, current stable compatible release
- TypeScript with strict mode
- React for interactive calculator components
- Tailwind CSS
- pnpm
- Vitest
- Playwright
- ESLint
- Prettier
- Cloudflare Pages for static hosting

Prefer the official Astro integrations where appropriate.

Use static site generation for all public pages.

Do not introduce server-side rendering unless there is a documented and unavoidable requirement.

Use lightweight React islands rather than hydrating the entire website.

Avoid unnecessary dependencies.

All core calculations must execute client-side.

Do not require:

- MongoDB
- PostgreSQL
- Redis
- Express
- FastAPI
- Authentication
- Paid APIs
- Persistent backend infrastructure

Use localStorage only for optional user preferences such as theme and saved calculator configuration.

Do not collect personal information unnecessarily.

---

# 5. REQUIRED WEBSITE PAGES

Implement the following:

### Core pages

- `/` — Homepage
- `/calculators` — All calculator directory
- `/about` — About
- `/contact` — Contact
- `/privacy-policy` — Privacy Policy
- `/terms` — Terms of Use
- `/disclaimer` — Educational Disclaimer
- `/404` — Not Found page

### Calculator pages

1. `/calculators/gpa-calculator`
2. `/calculators/cgpa-calculator`
3. `/calculators/weighted-grade-calculator`
4. `/calculators/final-exam-grade-calculator`
5. `/calculators/attendance-percentage-calculator`
6. `/calculators/required-attendance-calculator`
7. `/calculators/grade-percentage-calculator`
8. `/calculators/assignment-weight-calculator`
9. `/calculators/semester-gpa-planner`
10. `/calculators/grade-improvement-calculator`
11. `/calculators/study-hours-planner`
12. `/calculators/exam-score-converter`

Ensure all pages have proper internal navigation.

No dead links, empty routes, or placeholder features.

Legal and informational pages must contain genuine, relevant content, not lorem ipsum.

If details such as the business owner, jurisdiction, domain or email are unavailable, use explicit configuration placeholders that must be completed before production publishing.

Do not falsely claim professional legal review.

---

# 6. IMPLEMENT ALL 12 CALCULATORS

Every calculator must have:

- Clear input fields.
- Real-time or button-triggered calculations.
- Accurate formulas.
- Input validation.
- Helpful error messages.
- Reset functionality.
- Worked examples.
- Formula explanations.
- Responsive design.
- Accessible labels.
- Keyboard support.
- Copy or share results where useful.
- Unit tests.
- Edge-case handling.

### 6.1 GPA Calculator

Allow users to:

- Add unlimited course rows.
- Enter course names.
- Enter credit hours.
- Select letter grades.
- Configure grade-point scales.
- Remove courses.
- Calculate weighted semester GPA.

Formula:

GPA = Sum(grade points × credit hours) / Sum(credit hours)

Support customizable grading configurations, including a typical US 4.0 scale.

Do not falsely assume all universities follow the same grading policy.

Handle zero credits and invalid grade configurations.

### 6.2 CGPA Calculator

Allow users to:

- Add previous semesters.
- Input GPA for each semester.
- Enter completed credit hours.
- Calculate cumulative GPA.
- Add, edit and remove semesters.

Formula:

CGPA = Sum(semester GPA × semester credits) / Sum(semester credits)

Support a custom maximum GPA scale.

Validate that GPAs do not exceed the selected scale.

### 6.3 Weighted Grade Calculator

Allow students to enter multiple grading categories, such as:

- Assignments
- Quizzes
- Midterms
- Projects
- Final exams

For each category, enter:

- Category name
- Achieved score percentage
- Category weight percentage

Calculate the current weighted grade.

Clearly distinguish:

- Completed-category normalized grade
- Total course percentage contribution

Indicate whether weights total 100%.

Do not silently normalize invalid or unintended weights.

### 6.4 Final Exam Grade Calculator

Inputs:

- Current course grade
- Final exam weight
- Desired final course grade

Calculate the final exam score required to achieve the desired grade.

Formula:

Required final score =
(Target grade - Current grade × (1 - Final weight)) / Final weight

Convert weights to decimals correctly.

Handle impossible targets, zero-weight exams and results above 100%.

Do not silently clamp impossible results to 100%.

Explain assumptions about what the current grade represents.

### 6.5 Attendance Percentage Calculator

Inputs:

- Classes attended
- Total classes held

Formula:

Attendance = Attended / Total × 100

Support optional quick calculations for missed classes.

Prevent attended classes from exceeding total classes.

Handle zero total classes.

### 6.6 Required Attendance Calculator

Inputs:

- Total classes held
- Classes attended
- Required attendance percentage

Calculate how many consecutive future classes must be attended to reach the target.

Use mathematically correct inequalities and integer rounding.

Account for cases where:

- The target is already achieved.
- The target is exactly 100%.
- The target is impossible to reach in a finite number of classes without starting at perfect attendance.
- The target is outside the valid range.

Also calculate the number of future classes that may be missed while maintaining the target, where meaningful.

### 6.7 Grade Percentage Calculator

Inputs:

- Marks obtained
- Total possible marks

Formula:

Percentage = Obtained / Total × 100

Allow configurable display precision.

Support an optional custom grade-boundary table.

Do not assert that one letter-grade scale applies universally.

### 6.8 Assignment Weight Calculator

Allow students to enter:

- Current contribution to the course grade
- Assignment weight
- Assignment marks obtained
- Total assignment marks

Calculate:

- Assignment percentage
- Weighted contribution
- Updated total course contribution

Make the distinction between contribution and normalized grade explicit.

Do not double-count assignment weights.

### 6.9 Semester GPA Planner

Allow users to:

- Add planned courses.
- Enter anticipated credit hours.
- Select expected grades.
- Calculate projected GPA.
- Compare multiple grade scenarios.

Provide a clear projected GPA display and basic scenario comparison.

Use deterministic calculations, not AI-generated predictions.

### 6.10 Grade Improvement Calculator

Inputs:

- Current grade
- Completed course weight
- Remaining course weight
- Desired final grade

Calculate the average percentage required across remaining assessments.

State when a target is mathematically impossible.

Handle cases where no assessed weight remains.

Ensure completed and remaining weights are consistently interpreted.

### 6.11 Study Hours Planner

Inputs:

- Study subjects.
- Exam or deadline dates.
- Estimated required study hours.
- Available study days.
- Daily study capacity.

Generate a deterministic study schedule.

Prioritize deadlines and show workload feasibility.

Allow users to adjust subject priorities.

Do not promise learning outcomes or claim that a schedule guarantees exam success.

Do not require external calendar APIs.

### 6.12 Exam Score Converter

Support:

- Raw marks to percentage.
- Percentage to equivalent marks.
- Conversion between different total mark scales.
- Optional custom letter-grade boundaries.

Allow configurable rounding and precision.

Do not claim that proportional mark conversion is equivalent to percentile ranking, standardized test equating, or official grading curves.

---

# 7. CALCULATOR ENGINEERING

Separate calculation logic from UI components.

Create reusable utilities for:

- Numeric validation.
- Percentage calculations.
- Decimal precision.
- GPA scale configuration.
- Weighted averages.
- Formatting.
- Edge-case error handling.

Use pure functions wherever possible.

Avoid JavaScript floating-point surprises when rendering results.

Use sensible precision and clearly define rounding behavior.

Do not use unnecessary `any` types.

Build a shared calculator component library with:

- NumericInput
- SelectInput
- CalculatorCard
- ResultPanel
- ErrorMessage
- DynamicRows
- ResetButton
- CopyResultButton
- FormulaExplanation
- ExamplePanel
- RelatedTools

---

# 8. HOMEPAGE EXPERIENCE

The homepage must look polished and credible.

Include:

1. Responsive navigation.
2. Hero with a clear value proposition.
3. Search input to find calculators.
4. Featured calculators.
5. Calculator category cards.
6. All-tools directory preview.
7. "How it works" section.
8. Educational value section.
9. Frequently asked questions.
10. Footer.

Suggested hero headline:

**Make Every Grade Count.**

Suggested subtitle:

"Free, accurate calculators for GPA, grades, attendance, exams, and academic planning. Get clear answers in seconds."

Suggested primary CTA:

"Explore Calculators"

Suggested secondary CTA:

"Calculate My GPA"

All call-to-action buttons must navigate to working destinations.

Do not create meaningless UI elements.

---

# 9. SEO — CRITICAL REQUIREMENT

This website is intended to attract global organic search traffic.

Implement technical SEO correctly.

### Required features

- Unique title for every route.
- Unique meta descriptions.
- Canonical URLs.
- XML sitemap.
- robots.txt.
- Open Graph tags.
- Social preview metadata.
- Breadcrumb navigation.
- Semantic HTML.
- Proper heading hierarchy.
- Descriptive internal links.
- Clean URLs.
- Mobile-first layout.
- Fast page loading.
- Relevant structured data when eligible.
- Correct 404 handling.
- No duplicate calculator routes.
- Production domain configuration.

Use the configured base URL rather than hardcoding example.com throughout the project.

### Structured data

Use appropriate valid Schema.org markup.

Examples may include:

- WebSite
- Organization, only where truthful and applicable
- BreadcrumbList
- SoftwareApplication or WebApplication when appropriate

Do not add FAQ rich-result markup merely to try to win enhanced search visibility.

Do not fabricate review ratings, authors, organizations, awards or endorsements.

Validate structured data.

### Calculator content

For every calculator page, create original, accurate supporting content.

Include:

1. A short introduction.
2. A working calculator.
3. How to use the calculator.
4. Formula explanation.
5. Worked example.
6. Common mistakes.
7. Relevant limitations.
8. Frequently asked questions.
9. Related calculators.

Content should directly answer user questions.

Avoid keyword stuffing.

Avoid repetitive, thin, mass-generated pages.

Do not make unverified statements such as "the world's most accurate calculator".

Each calculator must be useful even without advertising.

### SEO content management

Create a structured metadata registry for calculators containing:

- Slug
- Title
- Description
- Category
- Keywords for editorial planning
- Related tools
- SEO metadata
- Content references

Avoid duplicating metadata manually across components.

Create an SEO checklist for future calculators.

---

# 10. PERFORMANCE

Target excellent Core Web Vitals.

Performance targets:

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+

These are engineering targets, not assumed results.

Optimize:

- JavaScript bundle size.
- Images and SVGs.
- Fonts.
- React hydration.
- CSS delivery.
- Layout stability.
- Responsive performance.
- Lazy loading of non-critical components.

Use Astro's static rendering effectively.

Do not load the full React application on every page unnecessarily.

The calculator itself should remain fast and responsive.

No large hero image is required.

---

# 11. ACCESSIBILITY

Target WCAG 2.2 AA practices.

Implement:

- Keyboard-accessible navigation.
- Visible focus states.
- Appropriate color contrast.
- Semantic forms.
- Proper field labels.
- Accessible validation messages.
- Screen-reader-friendly result announcements.
- Reduced-motion support.
- Responsive zoom and text sizing.
- Correct heading structure.

Use automated accessibility tests where practical.

Manually inspect common keyboard flows.

---

# 12. ADSENSE READINESS

Build the website so Google AdSense can be added safely after approval.

Do not assume AdSense approval is guaranteed.

### Required

- Privacy Policy.
- Contact page.
- About page.
- Disclaimer.
- Terms.
- Original and useful page content.
- Clear navigation.
- No deceptive controls.
- No advertising overlays covering inputs.
- No accidental-click ad placements.
- No intrusive interstitials.

Create a reusable `AdSlot` component.

It must:

- Be disabled by default.
- Support configuration using environment variables.
- Render no fake or simulated ads.
- Load AdSense scripts only when configured, appropriate, and compliant with consent requirements.
- Avoid accidental clicks near calculator actions.
- Avoid layout shifts where practical.
- Respect privacy and consent requirements.

Do not insert live advertising code with imaginary publisher IDs.

Keep ad slots disabled until real IDs, consent handling, and approval are configured.

Provide a documented process to activate ads later.

### Consent

Plan for Google's applicable certified CMP requirements for users in the EEA, UK and Switzerland.

Do not implement a fake consent banner and claim compliance.

Document how to integrate a supported consent solution before serving personalized or other consent-dependent advertising.

### Analytics

Implement a privacy-conscious analytics abstraction.

Track useful events such as:

- Calculator page viewed.
- Calculator successfully used.
- Input validation failure.
- Result copied.
- Related calculator opened.

Do not log sensitive form values or unnecessarily transmit academic data.

Analytics must be disabled or safely configurable until a real provider is supplied.

---

# 13. CLOUDFLARE DEPLOYMENT

The website must be deployable on Cloudflare Pages' free plan without server-side dependencies.

Use static output.

Include:

- Production build command.
- Output directory configuration.
- Cloudflare deployment instructions.
- Custom domain setup instructions.
- HTTPS setup instructions.
- Environment variable documentation.
- GitHub integration guidance.

Use the correct build command, likely:

`pnpm build`

Use the correct Astro static output directory:

`dist`

Verify these against the implemented project.

Ensure every calculator runs after static deployment.

Do not require Cloudflare Workers or Pages Functions for basic calculations.

Do not deploy to a real account unless credentials and explicit authorization are provided.

---

# 14. TESTING REQUIREMENTS

Testing is mandatory.

### Unit tests

Create tests for all 12 calculators.

Cover:

- Normal inputs.
- Zero values.
- Invalid inputs.
- Decimal values.
- Boundary conditions.
- Impossible results.
- Custom GPA scales.
- Percentage precision.
- Dynamic course rows.
- Weight totals.
- Attendance edge cases.

### End-to-end tests

Use Playwright to test:

- Homepage loading.
- Navigation.
- Calculator directory.
- All 12 calculator routes.
- At least one valid scenario for every calculator.
- At least one invalid scenario for every calculator.
- Mobile navigation.
- Theme switching.
- Form reset behavior.
- Related calculator links.
- 404 behavior.

### Viewports

Test at:

- 390px mobile.
- 768px tablet.
- 1440px desktop.

Ensure no unexpected horizontal overflow.

### Build checks

Run:

- TypeScript type checking.
- ESLint.
- Unit tests.
- Production build.
- Playwright tests.

Run automated accessibility checks if the required tooling can be installed.

Do not mark tests as passing without actually executing them.

If test execution is impossible due to environment restrictions, clearly identify which tests were not executed.

---

# 15. SECURITY AND PRIVACY

Because this is a public utility website:

- Validate all user inputs.
- Avoid unsafe HTML injection.
- Do not execute arbitrary user code.
- Do not expose secrets.
- Avoid unnecessary external scripts.
- Use suitable security headers.
- Maintain dependency hygiene.
- Keep processing local whenever practical.
- Do not store student grades on a server.
- Do not collect personally identifiable student information.

If state is persisted locally, disclose its purpose and make it easy to reset.

---

# 16. PROJECT STRUCTURE

Use a clean architecture similar to:

```text
student-calculator-hub/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── calculators/
│   │   ├── layout/
│   │   └── ui/
│   ├── config/
│   ├── content/
│   │   └── calculators/
│   ├── data/
│   ├── layouts/
│   ├── lib/
│   │   ├── calculations/
│   │   ├── validation/
│   │   └── seo/
│   ├── pages/
│   │   ├── calculators/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── privacy-policy.astro
│   │   └── terms.astro
│   ├── styles/
│   └── tests/
├── e2e/
├── docs/
├── .github/
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

Adjust the structure if a cleaner, more maintainable architecture is appropriate.

---

# 17. DEVELOPMENT PROCESS

Execute the project in the following internal phases, without stopping for approval between them.

### Phase A — Environment

1. Inspect the current directory.
2. Check installed versions of Node.js and pnpm.
3. Initialize the project if necessary.
4. Install dependencies.
5. Configure Astro and TypeScript.
6. Configure styling, linting, formatting and testing.

### Phase B — Foundation

1. Build global layouts.
2. Build the responsive navigation.
3. Create the design system.
4. Build common calculator UI components.
5. Create calculator metadata registry.
6. Set up SEO utilities.

### Phase C — Calculator logic

Implement all 12 calculation engines.

Write tests for the calculation logic.

Verify mathematical accuracy before connecting the UI.

### Phase D — Calculator interfaces

Create every calculator's interface.

Implement validation, results and reset functionality.

Make each calculator fully usable.

### Phase E — Website pages

Create the homepage, calculator directory, supporting content and informational pages.

Implement search and category filtering.

### Phase F — SEO

Implement metadata, canonical URLs, sitemap, robots.txt and structured data.

Ensure calculator routes are statically generated.

### Phase G — AdSense preparation

Add legal pages, disabled ad components, configuration placeholders, and consent integration documentation.

### Phase H — QA

Run all applicable tests.

Fix errors.

Inspect production build output.

Validate responsive behavior.

### Phase I — Production readiness

Create deployment documentation.

Prepare GitHub Actions.

Generate a final implementation report.

---

# 18. COMPLETION CRITERIA

The project is complete only when:

- All 12 calculators exist.
- All 12 calculators work.
- All 12 calculator routes are accessible.
- Every calculator has validation.
- Every calculator has unit tests.
- Homepage is fully designed.
- Calculator directory works.
- Mobile responsiveness is verified.
- SEO metadata is implemented.
- XML sitemap is generated.
- robots.txt exists.
- Informational and legal pages exist.
- AdSense integration is safely disabled by default.
- Production build succeeds.
- Cloudflare Pages deployment is documented.
- No paid APIs are required.
- No required features remain TODOs or placeholder implementations.
- The README explains local development and deployment.

Do not label the website production-ready if critical tests fail.

---

# 19. REQUIRED FINAL OUTPUT

After implementation, provide a concise completion report with:

### 1. Implementation status

State which requirements are complete.

### 2. Pages

List all implemented routes.

### 3. Calculators

List all 12 and their test status.

### 4. Quality assurance

Report actual results for:

- Type checking.
- Lint.
- Unit tests.
- Production build.
- E2E tests.
- Accessibility testing, if executed.
- Lighthouse, if executed.

Never invent test results or performance scores.

### 5. Deployment

Provide the exact Cloudflare Pages build settings.

### 6. Configuration

Identify the remaining owner-specific details that must be completed before public production launch, including:

- Domain.
- Contact information.
- Accurate legal disclosures.
- Analytics configuration.
- AdSense approval and publisher ID.
- Consent management.

### 7. Issues

Report unresolved issues honestly.

### 8. Running locally

Provide exact commands to install, develop, test and build.

---

# FINAL EXECUTION INSTRUCTION

**START IMPLEMENTING THE APPLICATION NOW.**

Do not respond with only architecture, recommendations, a roadmap, or pseudocode.

Create the actual project files.

Implement the website end to end.

Make practical decisions autonomously.

Keep the code modular, understandable and maintainable.

Complete all functionality that is feasible in the current environment.

Run the tests and fix issues.

Your objective is to deliver a working, polished, fast, SEO-ready, AdSense-prepared, Cloudflare-deployable Student Calculator Hub website in a single development run.