import Papa from 'papaparse';
import { parseJson } from './json';
import { required, type Json } from './shared';
function delimiterCheck(delimiter: string) {
  if (![',', ';', '\t', '|'].includes(delimiter))
    throw new Error('Choose a comma, semicolon, tab, or pipe delimiter.');
}
export function jsonToCsv(
  input: string,
  delimiter = ',',
  separator = '.',
  safeFormulas = true,
) {
  delimiterCheck(delimiter);
  if (!separator || separator.length > 5)
    throw new Error('Flattening separator must be 1–5 characters.');
  const { value, warnings } = parseJson(input);
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.some((v) => v === null || typeof v !== 'object' || Array.isArray(v))
  )
    throw new Error('Use a nonempty JSON array of objects.');
  function flatten(
    object: Record<string, Json>,
    prefix = '',
    output: Record<string, string> = Object.create(null) as Record<
      string,
      string
    >,
  ) {
    for (const [key, item] of Object.entries(object)) {
      const name = prefix ? `${prefix}${separator}${key}` : key;
      if (
        item !== null &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        Object.keys(item).length
      )
        flatten(item, name, output);
      else {
        if (Object.hasOwn(output, name))
          throw new Error(
            `Flattening collision at “${name}”. Choose a different separator.`,
          );
        output[name] =
          item === null
            ? ''
            : typeof item === 'object'
              ? JSON.stringify(item)
              : String(item);
      }
    }
    return output;
  }
  const rows = (value as Record<string, Json>[]).map((row) => flatten(row));
  const headers = [...new Set(rows.flatMap(Object.keys))];
  if (!headers.length) throw new Error('Objects contain no fields to export.');
  const table = [
    headers,
    ...rows.map((row) => headers.map((key) => row[key] ?? '')),
  ];
  return {
    output: Papa.unparse(table, {
      delimiter,
      newline: '\r\n',
      escapeFormulae: safeFormulas,
    }),
    table: table.slice(0, 21),
    warnings: [
      ...warnings,
      'CSV has no data types: null and missing fields become empty cells; arrays and empty objects are JSON strings. Round trips can lose type and nesting information.',
      ...(safeFormulas
        ? [
            'Spreadsheet safety is enabled: formula-like cells receive an apostrophe prefix. This changes their text representation.',
          ]
        : []),
    ],
    message: `${rows.length} rows · ${headers.length} columns`,
  };
}
export function csvToJson(
  input: string,
  delimiter = ',',
  headers = true,
  trim = false,
  indent = 2,
) {
  required(input);
  delimiterCheck(delimiter);
  const parsed = Papa.parse<string[]>(input, {
    delimiter,
    skipEmptyLines: 'greedy',
  });
  if (parsed.errors.length)
    throw new Error(`CSV error: ${parsed.errors[0]!.message}`);
  const rows = parsed.data.map((row) =>
    row.map((cell) => (trim ? cell.trim() : cell)),
  );
  if (!rows.length) throw new Error('No CSV records found.');
  const fields = rows[0]!;
  if (
    headers &&
    (fields.some((h) => !h) || new Set(fields).size !== fields.length)
  )
    throw new Error(
      'Headers must be nonempty and unique. Rename duplicate headers or turn off the header row.',
    );
  const body = headers ? rows.slice(1) : rows;
  const mismatch = body.findIndex((row) => row.length !== fields.length);
  if (mismatch !== -1)
    throw new Error(
      `Row ${mismatch + (headers ? 2 : 1)} has a different number of columns. Check quoting and the delimiter.`,
    );
  const value = headers
    ? body.map((row) =>
        Object.fromEntries(fields.map((key, index) => [key, row[index]!])),
      )
    : body;
  return {
    output: JSON.stringify(value, null, indent),
    table: headers
      ? rows.slice(0, 21)
      : [fields.map((_, index) => `Column ${index + 1}`), ...rows.slice(0, 20)],
    message: `${body.length} records · All values preserved as strings`,
  };
}
