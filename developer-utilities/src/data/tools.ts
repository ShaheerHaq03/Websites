export const categories = [
  'All tools',
  'JSON & Data',
  'Encoding & Security',
  'Generators & Text',
  'Time & Reference',
] as const;
export const tools = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    label: 'Format & validate',
    description:
      'Make messy JSON readable. Format, validate, and minify in a click.',
    category: 'JSON & Data',
    icon: '{ }',
    color: 'blue',
    keywords: 'pretty print beautify lint nested indentation',
    related: ['json-diff', 'json-to-csv', 'csv-to-json'],
    seo: 'JSON Formatter & Validator Online',
    metaDescription:
      'Format, validate, and minify JSON online with a free JSON formatter that runs in your browser. Spot syntax errors and duplicate keys without uploading data.',
  },
  {
    id: 'json-diff',
    name: 'JSON Diff Checker',
    label: 'Compare data',
    description:
      'Find what changed. Compare JSON structures, values, and nested data.',
    category: 'JSON & Data',
    icon: '±',
    color: 'violet',
    keywords: 'compare difference arrays ignore order objects',
    related: ['json-formatter', 'json-to-csv', 'csv-to-json'],
    seo: 'JSON Diff Checker: Compare JSON',
    metaDescription:
      'Compare two JSON documents online and see every added, removed, and changed value by path. Free JSON diff that can ignore array order and runs locally.',
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    label: 'Convert formats',
    description: 'Turn JSON arrays into clean, spreadsheet-ready CSV files.',
    category: 'JSON & Data',
    icon: '⇥',
    color: 'green',
    keywords: 'convert flatten nested spreadsheet export delimiter',
    related: ['csv-to-json', 'json-formatter', 'json-diff'],
    seo: 'JSON to CSV Converter Online',
    metaDescription:
      'Convert JSON arrays to CSV in your browser. This free JSON to CSV converter flattens nested objects, quotes cells safely, and never uploads your data.',
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    label: 'Convert formats',
    description: 'Convert CSV into structured JSON, with the options you need.',
    category: 'JSON & Data',
    icon: '⇤',
    color: 'amber',
    keywords: 'convert table delimiter header quoted multiline',
    related: ['json-to-csv', 'json-formatter', 'json-diff'],
    seo: 'CSV to JSON Converter Online',
    metaDescription:
      'Convert CSV to JSON with a real CSV parser that handles quoted commas and multiline cells, keeping leading zeros intact. Free, private, and in your browser.',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    label: 'Inspect tokens',
    description:
      'Inspect token headers, payloads, and timestamps. All locally.',
    category: 'Encoding & Security',
    icon: '◇',
    color: 'rose',
    keywords: 'jwt token decode payload claims expiration base64url',
    related: [
      'base64-encoder-decoder',
      'unix-timestamp-converter',
      'json-formatter',
    ],
    seo: 'JWT Decoder: Inspect Token Claims',
    metaDescription:
      'Decode a JWT to read its header, payload, and iat, exp, and nbf times. Free JWT decoder that runs in your browser and never sends the token anywhere.',
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    label: 'Encode & decode',
    description: 'Encode or decode UTF-8 text with Base64 and Base64URL.',
    category: 'Encoding & Security',
    icon: '64',
    color: 'cyan',
    keywords: 'unicode emoji base64url encoding decoding',
    related: ['jwt-decoder', 'url-encoder-decoder', 'json-formatter'],
    seo: 'Base64 Encoder & Decoder (UTF-8)',
    metaDescription:
      'Encode text to Base64 or decode Base64 to UTF-8 text, with Base64URL support for emoji and multilingual input. Free, strict, and processed in your browser.',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    label: 'Generate identifiers',
    description: 'Generate secure random UUID v4s, one at a time or in bulk.',
    category: 'Generators & Text',
    icon: '#',
    color: 'violet',
    keywords: 'random id guid batch bulk v4 validate',
    related: ['regex-tester', 'json-formatter', 'unix-timestamp-converter'],
    seo: 'UUID v4 Generator: Bulk Random IDs',
    metaDescription:
      'Generate up to 1,000 random UUID v4 identifiers at once with the browser crypto API, then copy or download them. Free UUID generator with a v4 validator.',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    label: 'Test expressions',
    description:
      'Test patterns, inspect capture groups, and preview replacements.',
    category: 'Generators & Text',
    icon: '.*',
    color: 'blue',
    keywords: 'regular expression match named groups replace javascript',
    related: [
      'url-encoder-decoder',
      'json-formatter',
      'base64-encoder-decoder',
    ],
    seo: 'JavaScript Regex Tester Online',
    metaDescription:
      'Test JavaScript regular expressions online: highlight matches, inspect numbered and named capture groups, and preview replacements. Free and runs locally.',
  },
  {
    id: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    label: 'Convert time',
    description:
      'Go from Unix seconds or milliseconds to readable dates, and back.',
    category: 'Time & Reference',
    icon: '◷',
    color: 'amber',
    keywords: 'epoch seconds milliseconds date iso timezone utc',
    related: ['cron-expression-builder', 'jwt-decoder', 'uuid-generator'],
    seo: 'Unix Timestamp Converter (Epoch)',
    metaDescription:
      'Convert Unix timestamps in seconds or milliseconds to ISO 8601 dates in UTC, your local zone, or a listed IANA timezone, and back. Free and in your browser.',
  },
  {
    id: 'cron-expression-builder',
    name: 'Cron Expression Builder',
    label: 'Build schedules',
    description:
      'Build five-field cron schedules and preview the next executions.',
    category: 'Time & Reference',
    icon: '▦',
    color: 'green',
    keywords: 'schedule minute hour next execution timezone cron',
    related: ['unix-timestamp-converter', 'regex-tester', 'http-status-codes'],
    seo: 'Cron Expression Builder & Preview',
    metaDescription:
      'Build five-field cron expressions, read a plain-English description, and preview the next five run times in your timezone. Free cron builder in your browser.',
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    label: 'Work with URLs',
    description:
      'Encode components, decode escapes, and inspect query parameters.',
    category: 'Encoding & Security',
    icon: '↗',
    color: 'cyan',
    keywords: 'uri percent query parameters form encoding',
    related: ['base64-encoder-decoder', 'regex-tester', 'http-status-codes'],
    seo: 'URL Encoder & Decoder Online',
    metaDescription:
      'URL encode or decode text with component, full-URI, or form rules, and inspect and edit query parameters. Free URL encoder that never fetches your links.',
  },
  {
    id: 'http-status-codes',
    name: 'HTTP Status Codes',
    label: 'Quick reference',
    description:
      'Find the meaning, usage, and fixes for common HTTP responses.',
    category: 'Time & Reference',
    icon: '≋',
    color: 'rose',
    keywords: 'response api server error code 200 301 400 401 403 404 500',
    related: ['url-encoder-decoder', 'json-formatter', 'jwt-decoder'],
    seo: 'HTTP Status Codes Reference',
    metaDescription:
      'Look up 59 registered HTTP status codes by number or meaning, with examples and troubleshooting tips for each. A free, searchable HTTP status code reference.',
  },
] as const;
export type Tool = (typeof tools)[number];
export type ToolId = Tool['id'];
export const getTool = (id: string) => tools.find((tool) => tool.id === id)!;
