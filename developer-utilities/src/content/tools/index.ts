import type { ToolId } from '../../data/tools';
export type ToolContent = {
  /** How the tool is referred to mid-sentence, e.g. "the JSON Formatter". */
  subject: string;
  /** Direct-answer question heading, e.g. "What is the JSON Formatter?". */
  question: string;
  /** Self-contained 40–60 word answer that starts with the tool name. */
  answer: string;
  intro: string;
  steps: string[];
  example: [string, string];
  uses: string[];
  limitation: string;
  troubleshooting: string;
  faqs: [string, string][];
};
export const content: Record<ToolId, ToolContent> = {
  'json-formatter': {
    subject: 'the JSON Formatter',
    question: 'What is the JSON Formatter?',
    answer:
      'JSON Formatter is a free browser tool that parses standard JSON, then pretty-prints it with two spaces, four spaces, or tabs, minifies it, or validates it. It flags syntax errors, duplicate keys, and unsafe large integers, accepts input up to 1 MB and 150 nesting levels, and never uploads your data.',
    intro:
      'JSON is easy for machines to exchange, but a compact API response can be hard to inspect. This formatter parses standard JSON and produces a consistent, indented document so you can follow nested objects and arrays. Validation and minification use the same parser.',
    steps: [
      'Paste your JSON or open a local .json file.',
      'Choose two spaces, four spaces, or tabs. Select Format, Minify, or Validate.',
      'Read any validation or duplicate-key warnings, then copy or download the result.',
    ],
    example: [
      '{"user":{"name":"Ada","active":true}}',
      '{\n  "user": {\n    "name": "Ada",\n    "active": true\n  }\n}',
    ],
    uses: [
      'Inspect an API response while debugging a request.',
      'Normalize a configuration file before reviewing a change.',
      'Check JSON fixtures before adding them to a test suite.',
    ],
    limitation:
      'Standard JSON does not allow comments, trailing commas, NaN, or undefined. Duplicate object keys generate a warning: the JavaScript parser keeps the last value. JavaScript numbers use IEEE 754 precision; represent integers beyond ±9,007,199,254,740,991 as strings if exact precision matters. Input is limited to 1 MB and 150 nesting levels.',
    troubleshooting:
      'If validation fails, check quoted property names, escaped newlines, and commas between entries. The native parser includes a character position or line location when supported by your browser. An empty string is not a JSON document; null, [], and {} are valid.',
    faqs: [
      [
        'Does formatting change JSON values?',
        'Formatting only changes whitespace for ordinary, valid JSON. Because the document is parsed first, duplicate keys collapse to their last value and number spellings such as 1.0 or 1e2 are normalized to 1 and 100. Integers beyond JavaScript’s safe range can also lose precision. The formatter warns about duplicate keys and unsafe integers, so review those warnings before saving the output.',
      ],
      [
        'Can I format a local file without uploading it?',
        'Yes. The Open file button reads a .json or .txt file of up to 1 MB directly into this browser tab, and formatting runs in a Web Worker on your device. Neither the file nor its contents are sent to an application server. The Download button then saves the formatted result straight back to your computer as formatted.json.',
      ],
      [
        'Why does the JSON Formatter say my JSON is invalid?',
        'The formatter follows the strict JSON standard, the same rules as JSON.parse. Comments, trailing commas, single-quoted strings, unquoted property names, NaN, and undefined are all invalid, even though JavaScript accepts some of them in code. The error message includes the position your browser reports, so check that spot for a missing comma, quote, or bracket.',
      ],
      [
        'What is the difference between Format, Minify, and Validate?',
        'Format parses the JSON and re-indents it with two spaces, four spaces, or a tab per level. Minify parses it and removes all optional whitespace, producing the smallest equivalent document. Validate runs the same parser and reports whether the input is valid, along with duplicate-key and precision warnings. All three share one parser, so their verdicts always agree.',
      ],
      [
        'How large a JSON document can I format?',
        'Input is limited to 1 MB of UTF-8 text and 150 levels of nesting. Processing runs in a background Web Worker with a five-second limit, so a very large or deeply nested document cannot freeze the page. For bigger files, format a representative sample here, or use a command-line tool such as jq on your own machine.',
      ],
    ],
  },
  'json-diff': {
    subject: 'the JSON Diff Checker',
    question: 'What is the JSON Diff Checker?',
    answer:
      'JSON Diff Checker is a free browser tool that compares two JSON documents structurally and lists every added, removed, and changed value with its JSON path. It ignores whitespace and, by default, object key order, can optionally ignore array order while keeping duplicates, and reports up to 10,000 differences without uploading either document.',
    intro:
      'Compare the structure and values of two JSON documents without being distracted by indentation. Each change includes a bracket-based JSON path and its original or new value. Added, removed, and changed entries remain distinct, including changes between null, strings, and numbers.',
    steps: [
      'Place the original document on the left and the updated document on the right.',
      'Choose whether object property order and array order matter.',
      'Select Compare JSON, expand any change to inspect values, and export the differences.',
    ],
    example: [
      'Original: {"count":1,"enabled":true}\nUpdated: {"count":2,"enabled":true}',
      '[{"type":"changed","path":"$[\\"count\\"]","before":1,"after":2}]',
    ],
    uses: [
      'Review API payload changes between deployments.',
      'Compare nested configuration snapshots.',
      'Check arrays of test results while ignoring ordering noise.',
    ],
    limitation:
      'Ignoring array order performs a multiset comparison, including nested arrays. Every occurrence counts: [1,1] differs from [1]. Unmatched array members are reported as additions and removals instead of being paired heuristically. Object key order is ignored by default. Duplicate JSON keys use last-value semantics with warnings. The difference limit is 10,000.',
    troubleshooting:
      'Both inputs must be valid JSON. A string "1" differs from the number 1. If an entire array element appears added or removed in unordered mode, inspect the full object: a changed field makes it a different member.',
    faqs: [
      [
        'Can I compare arrays ignoring order without losing duplicates?',
        'Yes. With Ignore array order enabled, arrays are compared as multisets: each element in the original consumes exactly one matching occurrence in the updated array. Repeated values and repeated objects are therefore preserved, so comparing [1,1] with [1] reports one removal. Unmatched elements are listed as additions and removals rather than being paired up by guesswork.',
      ],
      [
        'What happens when I turn off Ignore property order?',
        'Values are still compared structurally, key by key. With Ignore property order turned off, the checker also reports a separate property-order change whenever the keys two objects share appear in a different sequence. That helps when a serializer, snapshot test, or signed payload depends on exact key order, although most JSON consumers treat key order as insignificant.',
      ],
      [
        'How do I read the paths in JSON Diff results?',
        'Each path starts at $, the document root, followed by bracket segments. Object keys appear as quoted strings, such as $["user"]["email"], and array positions as numbers, such as $["items"][2]. Bracket notation stays unambiguous even when a key contains dots, spaces, or other special characters, so every difference maps straight back to your data.',
      ],
      [
        'Does the JSON Diff Checker treat "1" and 1 as the same value?',
        'No. The comparison is type-aware, so the string "1" and the number 1 are reported as a changed value, and so are null versus an empty string or false. Both documents must be valid JSON before they can be compared. Whitespace and indentation, by contrast, never count as changes, because the documents are parsed rather than compared line by line.',
      ],
      [
        'Can I export the differences?',
        'Yes. After comparing, use Copy differences or Download to save the full change list as differences.json. Each entry records the change type, its JSON path, and the before and after values, which makes the export easy to attach to a bug report or feed into a script. The comparison stops with an error beyond 10,000 differences.',
      ],
    ],
  },
  'json-to-csv': {
    subject: 'the JSON to CSV converter',
    question: 'What is the JSON to CSV converter?',
    answer:
      'JSON to CSV is a free browser tool that turns a JSON array of objects into a spreadsheet-ready CSV file. It flattens nested objects into dotted column names, builds columns from every key in every record, quotes delimiters and line breaks correctly, and guards against spreadsheet formula injection, all without uploading your data.',
    intro:
      'Turn an array of JSON records into a CSV table for spreadsheet review or data handoff. Nested objects are flattened into column paths, while the union of keys across all records determines the output columns. CSV quoting handles delimiters, double quotes, and multiline cells.',
    steps: [
      'Paste a nonempty JSON array of objects, or open a local file.',
      'Choose a CSV delimiter and a separator for nested column names.',
      'Convert, review the table and loss warnings, then download the CSV file.',
    ],
    example: [
      '[{"name":"Ada","address":{"city":"London"}},{"name":"Lin","address":{"city":"Taipei"}}]',
      'name,address.city\r\nAda,London\r\nLin,Taipei',
    ],
    uses: [
      'Export a collection of API results to a spreadsheet.',
      'Flatten nested application records for a data review.',
      'Prepare a readable CSV sample for a bug report.',
    ],
    limitation:
      'CSV cannot preserve every JSON type. Null and missing values become empty cells, numbers and booleans become text, and arrays or empty objects become JSON strings. Flattening collisions are rejected. Spreadsheet formula protection adds an apostrophe to cells starting with formula-like characters; disable it only when you understand the receiving spreadsheet.',
    troubleshooting:
      'Use an array of objects rather than a single object or scalar. If keys already contain the flattening separator, select another separator to avoid collisions. A CSV preview shows the first 20 data rows; downloads include the complete conversion.',
    faqs: [
      [
        'How are nested arrays converted?',
        'Arrays are written as JSON text inside a single cell, such as [1,2]. They are not expanded into extra rows or numbered columns, so array boundaries stay explicit and no records are duplicated. Nested objects, by contrast, are flattened into separate columns like address.city, while empty objects are kept as JSON text so the cell is never silently blank.',
      ],
      [
        'Why does a cell begin with an apostrophe?',
        'The Protect spreadsheet formulas option, enabled by default, prefixes cells that start with formula characters such as =, +, -, or @ with an apostrophe. This reduces CSV formula injection risk when the file is opened in Excel, Google Sheets, or LibreOffice. It changes the stored text, so turn it off when the CSV feeds a program rather than a spreadsheet.',
      ],
      [
        'What JSON structure does the converter accept?',
        'It expects a nonempty JSON array whose items are all objects, for example [{"name":"Ada"},{"name":"Lin"}]. A single object, an array of numbers, or an array containing null is rejected with an error. Records do not need identical keys: the column list is the union of keys across every object, and missing fields become empty cells.',
      ],
      [
        'Which delimiters can I use for the CSV output?',
        'You can choose a comma, semicolon, tab, or pipe delimiter. Semicolons suit spreadsheets in regions that use a comma as the decimal separator, and tabs produce TSV-style output. Whichever you choose, fields containing the delimiter, double quotes, or line breaks are quoted automatically, and rows end with CRLF line endings as the CSV specification recommends.',
      ],
      [
        'Can I convert the CSV back to the original JSON?',
        'Not always losslessly. CSV has no data types, so numbers and booleans become text, null and missing values both become empty cells, and arrays become JSON strings. Use the CSV to JSON tool for the reverse direction, then restore types in your own code. Keep the original JSON whenever you need an exact round trip.',
      ],
    ],
  },
  'csv-to-json': {
    subject: 'the CSV to JSON converter',
    question: 'What is the CSV to JSON converter?',
    answer:
      'CSV to JSON is a free browser tool that reads CSV with a real CSV parser and outputs a JSON array. Quoted commas, escaped quotes, and multiline cells stay intact, every value is kept as a string to preserve leading zeros, and you can choose comma, semicolon, tab, or pipe delimiters. Nothing is uploaded.',
    intro:
      'Read a CSV document with a real CSV parser and turn its records into JSON. Quoted delimiters, escaped quotation marks, and multiline values are handled as fields rather than split apart. All cell values remain strings, keeping account codes and leading zeros intact.',
    steps: [
      'Paste CSV or read a local .csv file.',
      'Select the delimiter, header-row behavior, whitespace trimming, and output indentation.',
      'Convert and inspect the preview, then copy or download the JSON.',
    ],
    example: [
      'name,note\nAda,"Hello, world"\nLin,"Line 1\nLine 2"',
      '[{"name":"Ada","note":"Hello, world"},{"name":"Lin","note":"Line 1\\nLine 2"}]',
    ],
    uses: [
      'Create JSON test fixtures from a spreadsheet export.',
      'Preserve postal codes or other identifiers with leading zeros.',
      'Inspect CSV records containing quoted multiline comments.',
    ],
    limitation:
      'Type inference is deliberately disabled: "true", "0012", and empty cells remain strings. With headers disabled the result is an array of arrays. Empty or duplicate headers and inconsistent row widths are rejected rather than silently dropping data. Entirely blank records are skipped.',
    troubleshooting:
      'If records have inconsistent widths, confirm the delimiter and check whether quotes were closed. Duplicate header names must be renamed, or use headerless mode to preserve every column by position. Disable trimming when whitespace is part of the data.',
    faqs: [
      [
        'Will numeric strings become JSON numbers?',
        'No. Every cell stays a JSON string, so values like "0012", "true", and "3.50" keep their exact text. This preserves postal codes, account numbers, decimal formatting, and integers too large for JavaScript numbers. Type inference often corrupts identifiers silently, so it is deliberately disabled; convert types explicitly in your own application once you have checked its schema.',
      ],
      [
        'Are Windows line endings supported?',
        'Yes. Records separated by Windows CRLF line endings and by Unix LF line endings are both parsed correctly, and line breaks inside quoted fields are kept as part of the value. In the JSON output those embedded line breaks appear as escape sequences such as \\n inside the string, so multiline comments and addresses survive the conversion unchanged.',
      ],
      [
        'What happens if my CSV has no header row?',
        'Turn off First row is a header and the converter outputs an array of arrays instead of an array of objects. Each inner array holds one record’s cells in column order, so every column is preserved by position. Headerless mode is also the workaround for files with empty or duplicate header names, which header mode rejects to avoid overwriting data.',
      ],
      [
        'Why does the converter reject rows with a different number of columns?',
        'A row with too many or too few fields usually means the wrong delimiter or an unclosed quotation mark, and guessing would silently shift values into the wrong keys. The error names the first mismatched row so you can find it quickly. Check the delimiter setting, then look for a stray double quote on or just before that row.',
      ],
      [
        'Can I choose the JSON output format?',
        'Yes. Choose two or four spaces of indentation, then copy the result or download it as a JSON file. Whitespace trimming is off by default, so leading and trailing spaces in cells are preserved unless you enable Trim whitespace. Entirely blank lines are skipped, and a table preview shows the first 20 records so you can check the parse.',
      ],
    ],
  },
  'jwt-decoder': {
    subject: 'the JWT Decoder',
    question: 'What is the JWT Decoder?',
    answer:
      'JWT Decoder is a free browser tool that decodes the Base64URL header and payload of a compact JSON Web Token and shows the iat, exp, and nbf claims as UTC ISO 8601 times. It never verifies signatures or asks for a key, and the token is processed locally instead of being sent to a server.',
    intro:
      'Inspect the readable parts of a compact JSON Web Token: the header and payload. NumericDate claims such as iat, exp, and nbf are shown as UTC ISO timestamps. This is an inspection aid for development and does not prove that a token is trusted.',
    steps: [
      'Use the included demonstration token, or a disposable development token.',
      'Select Decode JWT to inspect the header, payload, and time claims.',
      'Read the unverified-signature notice before interpreting any claims.',
    ],
    example: [
      'eyJhbGciOiJub25lIn0.eyJzdWIiOiJkZW1vIn0.',
      '{"header":{"alg":"none"},"payload":{"sub":"demo"},"signatureVerified":false}',
    ],
    uses: [
      'Investigate development-token claim names.',
      'Understand why an expiration timestamp is in the past.',
      'Check Base64URL and JSON structure during authentication integration.',
    ],
    limitation:
      'Decoded only. Signature has not been verified. No key is requested or used. Time checks rely on the device clock, and the absence of expiry does not imply acceptance by an API. Encrypted JWEs with five segments are unsupported. Avoid pasting production authentication secrets into any debugging utility.',
    troubleshooting:
      'A compact JWT has three dot-separated segments. An empty signature can be inspected, but is not accepted as proof of authentication. Header and payload must be JSON objects encoded using Base64URL. Timestamp claims must be numeric seconds, not milliseconds.',
    faqs: [
      [
        'Does a readable payload mean the token is valid?',
        'No. Anyone can create a token with readable claims, because the header and payload are only Base64URL-encoded JSON. Authenticity depends on a verifier checking the signature with the correct key and enforcing issuer, audience, expiry, and algorithm rules. This decoder always reports signatureVerified: false and shows timestamp hints only, so never treat its output as an authentication decision.',
      ],
      [
        'Is the token transmitted?',
        'No. Decoding happens in a Web Worker inside this browser tab, and the decoder does not send token values to a service, analytics endpoint, URL, or log. The default build contains no analytics or advertising scripts. Still, treat real tokens as credentials: use demonstration or disposable development tokens, and avoid pasting production authentication secrets into any debugging utility.',
      ],
      [
        'What do iat, exp, and nbf mean in a JWT?',
        'They are registered NumericDate claims measured in seconds since 1970-01-01 UTC. The iat claim records when the token was issued, exp when it expires, and nbf the earliest time it should be accepted. The decoder converts each one to a UTC ISO 8601 timestamp and compares exp and nbf with your device clock as a hint, not a validity check.',
      ],
      [
        'Can the JWT Decoder read encrypted tokens (JWE)?',
        'No. The decoder supports compact signed-style tokens with exactly three dot-separated segments: header, payload, and signature. Encrypted JWE tokens have five segments and a payload that cannot be read without the decryption key, so they are rejected. An empty third segment, as used by unsigned alg: none tokens, can be inspected but is never treated as proof of authentication.',
      ],
      [
        'Why does the decoder reject my exp claim?',
        'Time claims must be JSON numbers counting seconds, as the JWT specification defines. A quoted value such as "1700000000" is rejected because it is a string, not a NumericDate. A millisecond value is accepted but appears tens of thousands of years in the future, which usually means the issuer used the wrong unit. Ask the issuer to emit NumericDate seconds.',
      ],
    ],
  },
  'base64-encoder-decoder': {
    subject: 'the Base64 Encoder / Decoder',
    question: 'What is the Base64 Encoder / Decoder?',
    answer:
      'Base64 Encoder / Decoder is a free browser tool that converts UTF-8 text to Base64 and back, including the URL-safe Base64URL alphabet. Because it encodes bytes from TextEncoder, emoji and multilingual text round-trip correctly. Decoding is strict: invalid characters, bad padding, and non-UTF-8 bytes are rejected, and nothing leaves your browser.',
    intro:
      'Encode UTF-8 text as Base64 or decode Base64 back into readable UTF-8. The encoder starts with bytes from TextEncoder, so multilingual text and emoji work correctly. Base64URL uses the URL-safe alphabet and omits output padding.',
    steps: [
      'Enter text to encode or Base64 text to decode.',
      'Choose standard Base64 or Base64URL and select the matching action.',
      'Copy the output, download it, or swap it into the input for a round trip.',
    ],
    example: ['Hello, 世界 👋', 'SGVsbG8sIOS4lueVjCDwn5GL'],
    uses: [
      'Inspect a text payload represented as Base64.',
      'Prepare a URL-safe text encoding for an integration test.',
      'Debug Unicode encoding issues without a network request.',
    ],
    limitation:
      'Base64 is an encoding, not encryption. This tool supports UTF-8 text, not arbitrary binary files. Decoding rejects invalid characters, misplaced padding, noncanonical padding bits, and byte sequences that are not valid UTF-8. Unpadded input is supported when its length is valid.',
    troubleshooting:
      'Check that the selected alphabet matches the input. Standard Base64 uses + and /; Base64URL uses - and _. Whitespace inside an encoded value is rejected. A binary image or compressed archive will not decode as UTF-8 text.',
    faqs: [
      [
        'Can Base64 protect a secret?',
        'No. Base64 is a reversible encoding, not encryption, so anyone can decode it without a key, and it provides no confidentiality or integrity protection. It exists to carry bytes safely through text-only channels such as JSON, email, or URLs. To protect data, use real encryption or a secrets manager, and treat any Base64 value containing credentials as plain text.',
      ],
      [
        'Why does a Base64URL value lack equals signs?',
        'Base64URL output omits trailing = padding, a common convention in JWTs and URLs where = would otherwise need escaping. When decoding, the tool reconstructs the required padding from the input length and validates the resulting bytes. Unpadded standard Base64 is accepted too, as long as its length is valid; a single leftover character can never form a complete byte.',
      ],
      [
        'What is the difference between Base64 and Base64URL?',
        'Both encode the same bytes with a 64-character alphabet. Standard Base64 uses + and / and pads output with =, while Base64URL replaces them with - and _ so the result is safe in URLs, filenames, and JWT segments without percent-encoding. Choose the alphabet that matches your input, because this decoder rejects characters from the other alphabet rather than guessing.',
      ],
      [
        'Can I decode a Base64 image or binary file?',
        'No. This tool decodes Base64 into UTF-8 text only, and it reports an error when the decoded bytes are not valid UTF-8, as with images, PDFs, or compressed archives. That strictness stops garbled output from being mistaken for real text. For binary data, use a decoder that writes the bytes directly to a file, such as the base64 command-line utility.',
      ],
      [
        'Why is my Base64 string rejected as invalid?',
        'Common causes are spaces or line breaks inside the value, characters from the other alphabet, padding in the wrong place, or a length that cannot form whole bytes. The decoder also rejects noncanonical padding bits that many decoders silently ignore. Remove line wrapping, confirm whether the value is standard Base64 or Base64URL, select the matching option, and decode again.',
      ],
    ],
  },
  'uuid-generator': {
    subject: 'the UUID Generator',
    question: 'What is the UUID Generator?',
    answer:
      'UUID Generator is a free browser tool that creates random version 4 UUIDs with crypto.randomUUID(), the browser’s cryptographically secure random source. Generate 1 to 1,000 identifiers at once in lowercase or uppercase, copy one or all of them, download them as a text file, and check any value against the UUID v4 format.',
    intro:
      'Generate UUID version 4 identifiers using the browser cryptographic random-number API. Each UUID has the standard 8-4-4-4-12 hexadecimal shape, version bits set to 4, and the RFC variant. Batch output makes it convenient to create fixture IDs or sample records.',
    steps: [
      'Choose a batch size from 1 to 1,000 and a letter case.',
      'Select Generate UUIDs, then copy an individual ID or the entire batch.',
      'Optionally paste a value into the validator to check UUID v4 formatting.',
    ],
    example: ['Generate one UUID v4', '6d5ea54e-a7df-4a83-9773-594c01714db3'],
    uses: [
      'Create disposable fixture identifiers.',
      'Generate correlation IDs for a development scenario.',
      'Validate that a stored identifier uses the UUID v4 shape.',
    ],
    limitation:
      'UUID v4 has a very low collision probability, not a mathematical uniqueness guarantee. IDs are not passwords or authorization checks. Format validation checks the version and variant, but cannot prove how an existing identifier was generated. crypto.randomUUID requires a secure browser context such as HTTPS or localhost.',
    troubleshooting:
      'Enter a whole-number count between 1 and 1,000. If generation is unavailable on an insecure HTTP origin, use localhost for development or enable HTTPS in hosting. Letter case changes display only, not the identifier value.',
    faqs: [
      [
        'Does this use Math.random?',
        'No. Every UUID comes from crypto.randomUUID(), the browser’s cryptographically secure random-number API, and there is no weaker fallback: if the API is unavailable, generation fails with an error instead of quietly using Math.random. Browsers expose crypto.randomUUID() only in secure contexts, so the generator works on HTTPS pages and on localhost but not on a plain HTTP origin.',
      ],
      [
        'Can I generate UUID v7?',
        'No. This utility generates and validates version 4 UUIDs only, which are random rather than time-ordered. UUID version 7, defined in RFC 9562, embeds a Unix millisecond timestamp so identifiers sort by creation time, which can improve database index locality. Use a library that implements RFC 9562 if you need v7; this tool makes no claims about timestamp-ordered variants.',
      ],
      [
        'Are UUID v4 values guaranteed to be unique?',
        'Not mathematically, but collisions are vanishingly unlikely. A version 4 UUID carries 122 random bits, so you would need roughly 2.7 quintillion identifiers before reaching a 50% chance of a single duplicate. For practical purposes they are unique. They are not secrets, though: never use a UUID as a password, an access token, or an authorization check.',
      ],
      [
        'How does the UUID validator decide a value is valid?',
        'It checks the canonical 8-4-4-4-12 hexadecimal layout, a version digit of 4, and an RFC variant digit of 8, 9, a, or b. Letter case and surrounding whitespace are ignored. Passing confirms only the shape of a UUID v4; it cannot prove the value was generated randomly, and well-formed UUIDs of other versions fail as an invalid UUID v4 format.',
      ],
      [
        'Does uppercase change the UUID?',
        'No. UUIDs are case-insensitive hexadecimal, so the uppercase option changes only how identifiers are displayed, copied, and downloaded, not their value. The UUID specification recommends lowercase output, which is the default here. Choose uppercase only when a system you need to match, such as a legacy database or a Windows GUID convention, expects capital letters.',
      ],
    ],
  },
  'regex-tester': {
    subject: 'the Regex Tester',
    question: 'What is the Regex Tester?',
    answer:
      'Regex Tester is a free browser tool for JavaScript regular expressions. It highlights every match, lists numbered and named capture groups with UTF-16 offsets, and previews replacements that use tokens like $1 and $<name>. Patterns run in a disposable Web Worker that stops after 1.5 seconds, so a runaway expression cannot freeze the page.',
    intro:
      'Test JavaScript regular expressions against a text sample, inspect capture groups and offsets, and preview replacements. Matches are highlighted separately from the editable source text so the original remains intact. Named groups are listed alongside numbered groups.',
    steps: [
      'Enter a pattern without surrounding slash delimiters and choose flags.',
      'Add a test string and optional replacement, including JavaScript replacement tokens such as $1 or $<name>.',
      'Run the pattern to view highlights, UTF-16 offsets, groups, and the replacement preview.',
    ],
    example: [
      'Pattern: (?<name>\\w+)@(?<domain>[\\w.]+)\nText: ada@example.org',
      'Match: ada@example.org\nname: ada\ndomain: example.org',
    ],
    uses: [
      'Debug capturing groups before updating a validation rule.',
      'Preview a text substitution with backreferences.',
      'Test multiline behavior with m and s flags.',
    ],
    limitation:
      'The engine is JavaScript RegExp, not PCRE. Execution happens in a disposable Web Worker terminated after 1.5 seconds, including replacement evaluation. Pattern length is limited to 2,000 characters, text to 1 MB, and matches to fewer than 5,000. Termination limits browser freezing but is not a proof of regex efficiency. Offsets count UTF-16 code units.',
    troubleshooting:
      'Remove wrapping / characters if you copied a regex literal. Check flag availability in your browser; u and v cannot be combined. Zero-length global matches advance by one code point in Unicode mode or one code unit otherwise, preventing infinite iteration.',
    faqs: [
      [
        'Why did my expression time out?',
        'Some patterns, especially nested quantifiers such as (a+)+, backtrack exponentially on input that almost matches. When matching and the replacement preview take longer than 1.5 seconds, the worker is terminated and you see a timeout message instead of a frozen tab. Simplify the nested quantifiers, anchor the pattern, or shorten the sample, then test again.',
      ],
      [
        'Why is there only one match without g?',
        'Without the g flag, a JavaScript regular expression returns only the first match, which mirrors how exec and replace behave in your own code. Enable g to find every match and replace all occurrences in the preview. The y flag adds sticky matching, where each match must begin exactly where the previous one ended, so any gap stops the search.',
      ],
      [
        'Is this regex tester compatible with PCRE, Python, or Java?',
        'Not exactly. Patterns run on your browser’s JavaScript RegExp engine, so results match JavaScript and Node.js behavior. Much basic syntax is shared, but features such as possessive quantifiers, atomic groups, recursion, and conditionals are unsupported in JavaScript, and some escapes differ. If your production code uses another language, confirm the final pattern there before relying on it.',
      ],
      [
        'Which regex flags are supported?',
        'All JavaScript flags are available: d for match indices, g for global, i for case-insensitive, m for multiline anchors, s so the dot matches newlines, u for Unicode, v for Unicode sets, and y for sticky matching. Each flag may appear only once, and u and v cannot be combined. Support for newer flags depends on your browser version.',
      ],
      [
        'How large can the pattern and test text be?',
        'The test string can be up to 1 MB and the pattern up to 2,000 characters. Matching stops with an error when it reaches 5,000 matches, and each run is limited to 1.5 seconds. Match offsets count UTF-16 code units, the same units JavaScript string indexes use, so a single emoji usually occupies two positions.',
      ],
    ],
  },
  'unix-timestamp-converter': {
    subject: 'the Unix Timestamp Converter',
    question: 'What is the Unix Timestamp Converter?',
    answer:
      'Unix Timestamp Converter is a free browser tool that turns Unix epoch values in seconds or milliseconds into ISO 8601 dates, a readable time in a chosen IANA timezone, and your browser’s local time. It also converts ISO dates with an explicit offset back into epoch values, and it never guesses units from digit count.',
    intro:
      'Convert an explicit Unix timestamp in seconds or milliseconds into an ISO 8601 date and a time in your chosen IANA timezone. The reverse direction accepts an ISO date with a stated offset, avoiding ambiguous local wall-clock times.',
    steps: [
      'Choose seconds, milliseconds, or ISO date input.',
      'Enter a value and select a timezone such as UTC or America/New_York.',
      'Convert to view the epoch values, UTC ISO date, selected-zone display, and browser-local time.',
    ],
    example: ['-1 (Unix seconds)', '1969-12-31T23:59:59.000Z'],
    uses: [
      'Read timestamps from logs or JWT claims.',
      'Compare epoch values across services that use different units.',
      'Display a fixed instant across daylight-saving transitions.',
    ],
    limitation:
      'Units are never inferred from digit count. Date input must specify Z or a numeric UTC offset. Epoch conversion follows the JavaScript Date model and does not represent leap seconds. IANA timezone support depends on the browser Intl data. Unix seconds use floor for fractional negative instants.',
    troubleshooting:
      'A date far in the future often indicates that milliseconds were interpreted as seconds. ISO input such as 2026-11-01T01:30:00 needs an offset to identify the repeated hour during a DST transition. Invalid calendar dates are rejected.',
    faqs: [
      [
        'Are negative timestamps supported?',
        'Yes. A negative Unix timestamp identifies an instant before 1970-01-01T00:00:00Z, so -1 converts to 1969-12-31T23:59:59.000Z. Values anywhere within the JavaScript Date range, roughly 273,790 years either side of 1970, are accepted. For fractional negative instants, the Unix seconds output rounds down with floor, which matches how most systems represent times before the epoch.',
      ],
      [
        'Does selecting a timezone change the epoch value?',
        'No. A Unix timestamp identifies one instant worldwide, so the seconds and milliseconds values stay the same whichever timezone you pick. Only the human-readable display changes, using your browser’s IANA timezone data and its daylight-saving rules. Choose UTC, a listed zone such as Asia/Tokyo, or Use browser timezone to compare the same moment across regions.',
      ],
      [
        'How do I tell whether a timestamp is in seconds or milliseconds?',
        'Current Unix times have 10 digits in seconds and 13 digits in milliseconds, but the converter never guesses from length, because both units are valid at any size. Choose the unit explicitly. If a result lands tens of thousands of years in the future, a millisecond value was probably read as seconds; if it lands in January 1970, the reverse happened.',
      ],
      [
        'Why does the converter reject my ISO date?',
        'The date must end in Z or a numeric UTC offset such as +05:00, for example 2026-01-15T09:30:00Z. Without an offset, a local wall-clock time is ambiguous, especially during daylight-saving transitions when an hour repeats or is skipped. The converter also rejects impossible calendar dates such as February 30 instead of silently rolling them into the next month.',
      ],
      [
        'Does the converter account for leap seconds?',
        'No. Unix time and the JavaScript Date model both ignore leap seconds and treat every day as exactly 86,400 seconds. That matches how operating systems, databases, and most APIs report epoch values, so conversions here agree with theirs. If you need true elapsed time across a leap second, use a library that supports TAI or another continuous time scale.',
      ],
    ],
  },
  'cron-expression-builder': {
    subject: 'the Cron Expression Builder',
    question: 'What is the Cron Expression Builder?',
    answer:
      'Cron Expression Builder is a free browser tool for standard five-field cron schedules: minute, hour, day of month, month, and day of week. Edit each field or the whole expression, read a plain-English description, and preview the next five run times in UTC or your timezone. It supports numeric values, lists, ranges, and steps.',
    intro:
      'Build a numeric five-field cron expression and inspect its upcoming execution times. Edit minute, hour, day-of-month, month, and day-of-week independently or enter a complete expression. The preview uses a named timezone and the current device time.',
    steps: [
      'Start with a preset or edit the five cron fields.',
      'Select the preview timezone and validate the expression.',
      'Read the description and next five runs, then copy the expression for your scheduler.',
    ],
    example: [
      '0 9 * * 1-5',
      'At 09:00, Monday through Friday (in the selected timezone)',
    ],
    uses: [
      'Prepare a weekday maintenance schedule.',
      'Check the next run of a periodic data export.',
      'Understand a five-field crontab entry during a deployment review.',
    ],
    limitation:
      'Supported dialect: numeric standard five-field cron with *, lists, ranges, and steps. Sunday is 0 or 7. Quartz, AWS EventBridge, macros, names, seconds, ?, L, W, and # are not supported. When both day-of-month and day-of-week are restricted, either matching field triggers the schedule. Preview uses cron-parser with its timezone/DST behavior; confirm with your actual scheduler.',
    troubleshooting:
      'Use five fields separated by spaces. A step must be a positive whole number. If no valid future occurrence exists, such as February 31 only, validation fails. Cloudflare scheduled triggers use UTC, so choose UTC when preparing one.',
    faqs: [
      [
        'Is “0 9 1 * 1” the first Monday of the month?',
        'No. When both day-of-month and day-of-week are restricted, standard cron runs when either field matches. So 0 9 1 * 1 runs at 09:00 on the first of every month and also at 09:00 on every Monday. Five-field cron cannot express the first Monday directly; teams usually add a date check inside the job or use a scheduler extension.',
      ],
      [
        'Can the next runs differ across schedulers?',
        'Yes. Daylight-saving handling, the either-day rule, timezone defaults, and supported syntax vary between classic crontab, Kubernetes CronJobs, CI services, and cloud schedulers. This preview uses the cron-parser library with the timezone you select and your device’s current time. Treat it as a strong guide, then confirm production behavior with your scheduler’s own documentation.',
      ],
      [
        'Which cron syntax does the builder support?',
        'It supports numeric five-field cron with *, comma-separated lists, ranges such as 1-5, and steps such as */15. Sunday can be written as 0 or 7. Quartz and AWS EventBridge formats, a seconds field, @daily-style macros, month or weekday names, and the special characters ?, L, W, and # are rejected with an explanation rather than guessed.',
      ],
      [
        'How do I run a cron job every 15 minutes?',
        'Use */15 * * * *. The */15 step in the minute field matches minutes 0, 15, 30, and 45 of every hour, and the asterisks in the remaining fields allow every hour, day, month, and weekday. Select the Every 15 minutes preset to load it, then check the next five runs to confirm the timing in your timezone.',
      ],
      [
        'What timezone does cron use?',
        'That depends on the scheduler. Traditional crontab uses the server’s local timezone, while many cloud schedulers, including Cloudflare Cron Triggers, always run in UTC. The builder previews runs in UTC, several common IANA zones, or your browser timezone, and lists every run in both UTC ISO format and the selected zone so you can compare them side by side.',
      ],
    ],
  },
  'url-encoder-decoder': {
    subject: 'the URL Encoder / Decoder',
    question: 'What is the URL Encoder / Decoder?',
    answer:
      'URL Encoder / Decoder is a free browser tool that percent-encodes or decodes text with three explicit rule sets: URL component, full URI, and form query. It can also split an absolute HTTP or HTTPS URL into its query parameters, let you edit them, and rebuild the URL, without ever fetching or opening the address.',
    intro:
      'Encode a URL component, decode percent escapes, or inspect the query parameters of an absolute HTTP URL. Component encoding, full-URI encoding, and form query encoding use different rules; choosing explicitly prevents accidentally treating a delimiter as part of a value.',
    steps: [
      'Choose component, full URI, or form query encoding.',
      'Encode or decode text, or select Inspect URL for a full HTTP or HTTPS URL.',
      'Edit query keys and values in the inspection panel and rebuild the URL without navigating to it.',
    ],
    example: [
      'Component: hello world & café',
      'hello%20world%20%26%20caf%C3%A9',
    ],
    uses: [
      'Prepare one value for a query string.',
      'Inspect repeated query parameters in a callback URL.',
      'Debug space, plus-sign, and Unicode handling.',
    ],
    limitation:
      'encodeURI preserves URI delimiters such as : / ? & =; encodeURIComponent escapes them. Form encoding uses + for spaces and escapes a literal plus as %2B. Encoding an already encoded percent sign intentionally produces %25, so decode first when normalizing an existing value. URLs are never fetched or automatically opened.',
    troubleshooting:
      'Malformed percent escapes and invalid UTF-8 are reported. Select form mode when a plus sign should represent a space. Repeated query keys are preserved as separate rows. Inspection accepts absolute HTTP or HTTPS URLs only.',
    faqs: [
      [
        'Why did %20 become %2520?',
        'The encoder received text that was already percent-encoded and encoded the literal % sign as %25, so %20 became %2520. Encoding is always an explicit action here, never an automatic normalization step. If you want the underlying space encoded exactly once, decode the value first, then encode the result with the rule set you actually need.',
      ],
      [
        'Will editing a query parameter contact the destination?',
        'No. Inspection and rebuilding use the browser’s URL and URLSearchParams APIs, which work purely on strings inside this tab. Editing keys or values and rebuilding the URL performs no navigation or fetch, so private callback URLs and tokens in query strings are never requested. Repeated keys stay as separate rows, and the rebuilt query uses form encoding.',
      ],
      [
        'What is the difference between encodeURI and encodeURIComponent?',
        'encodeURIComponent escapes every reserved character, including : / ? & = and #, so use it for a single value placed inside a query string or path segment. encodeURI preserves those delimiters and escapes only characters that can never appear in a URI, so use it for a complete URL. Choosing the wrong one either breaks the URL or merges values together.',
      ],
      [
        'Should spaces be encoded as + or %20?',
        'Use %20 in paths and general URL components. A + sign means a space only in application/x-www-form-urlencoded query strings, the format HTML forms submit. Select Form query mode to encode spaces as + and a literal plus as %2B, or to decode + back into spaces. Component mode always produces %20 and leaves a + unchanged when decoding.',
      ],
      [
        'How are emoji and non-English characters encoded?',
        'They are converted to UTF-8 bytes and each byte is percent-encoded, so café becomes caf%C3%A9 and a typical emoji becomes four escaped bytes. Decoding reverses the process and reports malformed escapes, invalid UTF-8, or unmatched surrogate characters as errors instead of inserting replacement characters. Modern browsers and servers expect exactly this UTF-8 percent-encoding.',
      ],
    ],
  },
  'http-status-codes': {
    subject: 'the HTTP Status Codes reference',
    question: 'What is the HTTP Status Codes reference?',
    answer:
      'HTTP Status Codes is a free, searchable reference of 59 registered HTTP response codes from 100 to 511, checked against the IANA registry. Search by number, name, or meaning, filter by response family, and read a plain-language description, a practical example, and a troubleshooting starting point for each code, with links to detailed documentation.',
    intro:
      'Look up common registered HTTP response codes by number, name, or meaning. Responses are grouped into informational, success, redirection, client error, and server error families. Each reference entry includes a practical example and a troubleshooting starting point.',
    steps: [
      'Search for a code such as 429 or a phrase such as rate limit.',
      'Filter by response family if you need to narrow the results.',
      'Copy a status code or follow its documentation link for protocol details.',
    ],
    example: [
      '429 Too Many Requests',
      'The client exceeded a request-rate policy. Respect Retry-After when supplied and use bounded retries with backoff.',
    ],
    uses: [
      'Choose an appropriate response for an API endpoint.',
      'Distinguish an authentication challenge from a permissions failure.',
      'Triage a gateway error or failed conditional request.',
    ],
    limitation:
      'This is a bundled selection of commonly used registered codes, not a live registry or a complete HTTP implementation guide. Vendor-only codes such as 520 are excluded; unassigned codes are not given invented meanings. Deprecated or reserved entries are omitted. HTTP semantics are independent of a particular server framework.',
    troubleshooting:
      'A status alone may not identify the root cause. Inspect headers and a sanitized response body; check server logs in an authorized environment. Do not retry non-idempotent requests blindly. Follow the linked protocol documentation when choosing cache or redirect behavior.',
    faqs: [
      [
        'What is the difference between 401 and 403?',
        '401 Unauthorized means the request lacks valid authentication; the server should send a WWW-Authenticate challenge, and supplying correct credentials may succeed. 403 Forbidden means the server understood the request but refuses to fulfill it, often because the authenticated identity lacks permission, so repeating the same credentials will not help. Check roles and access policies for a 403.',
      ],
      [
        'Are nonstandard CDN error codes included?',
        'No. This reference covers codes registered with IANA, so vendor-specific responses such as Cloudflare’s 520 range or nginx’s 499 are excluded, along with unassigned numbers and deprecated or reserved entries. Interpret a vendor-specific status using that vendor’s documentation, because its meaning comes from the proxy or CDN that generated it rather than from the HTTP standard.',
      ],
      [
        'What do the five HTTP status code classes mean?',
        'The first digit sets the class. 1xx codes are informational interim responses, 2xx mean the request succeeded, 3xx ask the client to redirect or reuse a cached copy, 4xx indicate a client error such as a malformed request or missing permission, and 5xx mean the server failed to fulfill a valid request. Filter by family to browse each group.',
      ],
      [
        'Should I use 301 or 308 for a permanent redirect?',
        'Both are permanent redirects, so clients and search engines treat the new URL as the lasting address. The difference is the request method: 308 requires the client to repeat the same method and body, while 301 lets clients change a POST into a GET, as browsers historically do. Use 301 for ordinary page moves and 308 when non-GET requests must be preserved.',
      ],
      [
        'When should an API return 429 Too Many Requests?',
        'Return 429 when a client exceeds a rate limit, ideally with a Retry-After header stating how long to wait. Clients should respect that value and retry with bounded exponential backoff instead of immediately. Use 503 Service Unavailable instead when the whole server is overloaded or down for maintenance, regardless of how many requests one particular client sent.',
      ],
    ],
  },
};
