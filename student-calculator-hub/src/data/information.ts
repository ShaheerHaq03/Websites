import { site } from '../config/site';
export const information: Record<
  string,
  {
    title: string;
    description: string;
    intro: string;
    sections: { title: string; paragraphs: string[]; list?: string[] }[];
  }
> = {
  about: {
    title: 'A little clarity for your next chapter.',
    description:
      'Learn how Student Calculator Hub makes academic calculations clearer with free tools, transparent formulas, and private browser-based processing.',
    intro:
      'Student life comes with enough unknowns. Your calculations don’t have to be one of them. Student Calculator Hub brings twelve everyday academic tools together in one straightforward place.',
    sections: [
      {
        title: 'Useful tools, understandable answers',
        paragraphs: [
          'Whether you are checking a semester GPA, working out a final exam target, or finding room for revision, our aim is to help you understand the numbers behind your next decision. Each calculator includes its formula, instructions, a worked example, and limitations.',
          'We separate calculation logic from the interface and test ordinary cases as well as edge cases. That does not make our estimates official academic advice: your institution’s published policy and records remain the authority.',
        ],
      },
      {
        title: 'Your institution, your rules',
        paragraphs: [
          'There is no single global grading system. GPA mappings and letter boundaries can be changed where those settings are relevant. Tools distinguish percentage points from normalized averages and explicitly identify targets that cannot be reached under the entered assumptions.',
        ],
      },
      {
        title: 'Private by design',
        paragraphs: [
          'All calculations run in your browser. We do not require an account or send your course names, grades, or schedules to a calculator server. Theme preference is the only item this version stores locally. Reset clears the current calculator session.',
        ],
      },
      {
        title: 'Free to use',
        paragraphs: [
          'Every calculator is available without payment or a login. Advertising and analytics are disabled in this preview. If advertising is introduced later, the privacy disclosures and applicable consent controls must be updated first.',
        ],
      },
      {
        title: 'A note on this preview',
        paragraphs: [
          'This project is prepared for an independent site operator. Owner, contact, and jurisdiction details have not yet been supplied; they must be completed before the public launch. We do not claim institutional affiliation, accreditation, or professional legal review.',
        ],
      },
    ],
  },
  contact: {
    title: 'Let’s keep things clear.',
    description:
      'Contact information and guidance for reporting calculator errors, accessibility issues, or questions about Student Calculator Hub.',
    intro:
      'Found a calculation that looks wrong, spotted an accessibility issue, or have a suggestion for a useful new tool? A clear example helps us understand what needs attention.',
    sections: [
      {
        title: 'Contact the operator',
        paragraphs: [
          site.contactEmail
            ? `The configured contact address is ${site.contactEmail}. Please use the email link below.`
            : 'Contact email: not yet configured. This preview cannot receive or send messages. The site operator must publish a working contact address before launching publicly.',
        ],
      },
      {
        title: 'Reporting a calculation issue',
        paragraphs: [
          'Include the calculator name, a non-personal example of the inputs, the result you expected, and the formula or policy you are using. Please do not send student IDs, private transcripts, passwords, or other sensitive records.',
          'For an accessibility issue, describe your browser, assistive technology if relevant, and the step that was difficult. A concise description is enough; no academic data is needed.',
        ],
      },
      {
        title: 'Official records and urgent decisions',
        paragraphs: [
          'Questions about official grades, attendance eligibility, academic standing, and institutional policies should go to your school or university. We cannot amend your transcript or determine whether an academic rule applies to you.',
        ],
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description:
      'How Student Calculator Hub handles calculator inputs, local theme preferences, hosting requests, and optional analytics and advertising.',
    intro:
      'This policy describes the application as implemented in this preview. The operator must review and complete the identity, contact, jurisdiction, hosting, and consent disclosures before public use.',
    sections: [
      {
        title: 'Operator and scope',
        paragraphs: [
          `Operator: ${site.owner || 'not yet configured'}. Contact: ${site.contactEmail || 'not yet configured'}. Applicable jurisdiction: ${site.jurisdiction || 'not yet configured'}.`,
          'This notice covers the Student Calculator Hub application. It is not a claim of professional legal review or universal compliance. The operator must adapt it to the real service and applicable law.',
        ],
      },
      {
        title: 'Calculator information stays in your browser',
        paragraphs: [
          'Course names, credit hours, marks, attendance counts, and study schedules are processed locally. The application does not upload those inputs to a database or calculation service. Temporary results and scenarios are discarded when you reset, reload, or leave the page.',
          'Copy buttons place result text on your device clipboard only when you choose to use them. Clipboard access can be denied by your browser.',
        ],
      },
      {
        title: 'Local storage and cookies',
        paragraphs: [
          'The theme setting is stored under the localStorage key student-hub-theme so your light or dark preference can persist. No grades or schedules are stored there. Use the “Clear theme preference” control below or clear site storage in your browser to remove it.',
          'This version sets no application cookies. Hosting infrastructure may process ordinary request information such as IP address, browser headers, and requested URLs for delivery and security. The public operator must confirm the actual hosting provider’s terms, retention, and processing arrangements.',
        ],
      },
      {
        title: 'Analytics and advertising',
        paragraphs: [
          'No analytics provider or advertising script is active by default. The analytics abstraction supports only event names and calculator slugs, not input values. Supplying configuration alone does not implement a network analytics provider.',
          'Advertising must remain disabled until approval, real publisher configuration, updated disclosures, and a suitable consent integration are in place. Where Google requires a certified consent management platform, the operator must configure one before applicable ad requests. There is no simulated consent banner in this application.',
        ],
      },
      {
        title: 'Messages and external links',
        paragraphs: [
          'If you contact a configured email address, the email provider and operator will receive what you choose to send. Avoid sending sensitive academic records. External sites have their own privacy policies; opening their links is your choice.',
        ],
      },
      {
        title: 'Questions, rights, and changes',
        paragraphs: [
          'Privacy rights and retention obligations depend on the operator, processing activities, and applicable law. Before launch, the operator must publish a working contact channel for requests and add accurate procedures for access, deletion, complaints, and other applicable rights.',
          'This policy should be reviewed whenever hosting, analytics, advertising, storage, or contact handling changes. The visible behavior and disclosures must remain consistent.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    description:
      'Conditions for using the educational calculators, including limitations, acceptable use, grading policy differences, and operator details.',
    intro:
      'Student Calculator Hub provides free educational calculation tools and explanatory content. These draft terms describe the intended service and require owner-specific review before public launch.',
    sections: [
      {
        title: 'Educational use',
        paragraphs: [
          'Use these tools to explore academic calculations and understand the formulas shown. Results are estimates based on the inputs and settings you choose. You are responsible for checking those inputs against your syllabus and official institutional rules.',
        ],
      },
      {
        title: 'No institutional or professional relationship',
        paragraphs: [
          'Using the site does not establish an advisory relationship. We do not act for your school, issue official grades, or make decisions about academic eligibility. No affiliation or endorsement by an institution is implied.',
        ],
      },
      {
        title: 'Accuracy and availability',
        paragraphs: [
          'We aim to make formulas clear and test the calculation logic, but mistakes and interruptions can occur. Institution-specific rules, grading curves, repeated-course policies, and changes in policy may not be represented. Verify consequential decisions independently.',
          'To the extent permitted by applicable law, the service is provided as available without a guarantee that every result is suitable for your situation. Nothing here excludes rights or liabilities that cannot legally be excluded.',
        ],
      },
      {
        title: 'Acceptable use',
        paragraphs: [
          'Do not interfere with the site, attempt to execute code through inputs, impersonate the operator, or use the tools to misrepresent official academic records. Automated use must not disrupt availability for other visitors.',
        ],
      },
      {
        title: 'Intellectual property and external services',
        paragraphs: [
          'Third-party software and fonts remain subject to their respective licenses. The site does not claim ownership of institutional grading policies or mathematical formulas. External links and any future advertising are governed by the relevant third parties’ terms as well as applicable law.',
        ],
      },
      {
        title: 'Operator, governing law, and updates',
        paragraphs: [
          `Operator: ${site.owner || 'not yet configured'}. Contact: ${site.contactEmail || 'not yet configured'}. Jurisdiction: ${site.jurisdiction || 'not yet configured'}.`,
          'These details and any governing-law provisions must be completed and reviewed for the actual operator before publication. These terms have not been professionally legally reviewed. Material changes should be reflected in this page before the changed service is offered.',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Educational Disclaimer',
    description:
      'Understand the limits of GPA, grade, attendance, and study planning estimates before you use them for important academic decisions.',
    intro:
      'These calculators explain mathematical models. They do not replace your institution’s policies, official gradebook, attendance record, or advice from an authorized academic adviser.',
    sections: [
      {
        title: 'Your policy takes precedence',
        paragraphs: [
          'Schools differ in grade points, thresholds, credit inclusion, attendance rules, extra credit, repeated-course treatment, and rounding. Editable settings help you model some differences, but no calculator automatically represents every institutional rule.',
        ],
      },
      {
        title: 'Targets are not predictions',
        paragraphs: [
          'A required exam score describes the mathematical outcome of your entered assumptions. It does not predict performance, guarantee a grade, or account for undocumented hurdles. A study schedule allocates hours; it does not guarantee learning, retention, or exam success.',
        ],
      },
      {
        title: 'Conversions have limits',
        paragraphs: [
          'Percentage and mark conversions are proportional arithmetic. They are not percentile rankings, standardized-test equating, qualification equivalence, or official grade conversions between institutions or countries.',
        ],
      },
      {
        title: 'Check before you act',
        paragraphs: [
          'Review the formula, example, and limitations on the relevant calculator page. Recheck important calculations with official records. Contact your institution before making enrollment, graduation, financial-aid, or attendance eligibility decisions.',
          'If you believe a formula or implementation is wrong, use the Contact page to find the operator’s channel when configured. Do not include confidential records in an error report.',
        ],
      },
    ],
  },
};
