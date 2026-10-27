import { required, type Json, type Change } from './shared';

// Walk valid JSON tokens to detect duplicates before JSON.parse can hide them.
export function parseJson(input: string): { value: Json; warnings: string[] } {
  required(input);
  let value: Json;
  try {
    value = JSON.parse(input) as Json;
  } catch (error) {
    throw new Error(
      `Invalid JSON: ${error instanceof Error ? error.message : 'check syntax'}`,
      { cause: error },
    );
  }
  const tokens =
    input.match(
      /"(?:[^"\\]|\\.)*"|[{}[\]:,]|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/g,
    ) || [];
  let i = 0;
  const warnings: string[] = [];
  for (const token of tokens) {
    if (!/^-?\d/.test(token)) continue;
    const numeric = Number(token);
    if (!Number.isFinite(numeric))
      throw new Error(
        'A JSON number exceeds the finite JavaScript numeric range. Store it as a string to preserve it.',
      );
    if (Number.isInteger(numeric) && !Number.isSafeInteger(numeric))
      warnings.push(
        'A number exceeds JavaScript safe integer precision. Store large numeric identifiers as strings to preserve exact values.',
      );
  }
  function walk(depth: number, path: string) {
    if (depth > 150) throw new Error('JSON nesting exceeds 150 levels.');
    const token = tokens[i++];
    if (token === '{') {
      const keys = new Set<string>();
      while (tokens[i] !== '}') {
        const key = JSON.parse(tokens[i++]!) as string;
        if (keys.has(key))
          warnings.push(
            `Duplicate key at ${path}[${JSON.stringify(key)}]. The last value is retained by JSON.parse.`,
          );
        keys.add(key);
        i++;
        walk(depth + 1, `${path}[${JSON.stringify(key)}]`);
        if (tokens[i] !== ',') break;
        i++;
      }
      i++;
    } else if (token === '[') {
      let index = 0;
      while (tokens[i] !== ']') {
        walk(depth + 1, `${path}[${index++}]`);
        if (tokens[i] !== ',') break;
        i++;
      }
      i++;
    }
  }
  walk(0, '$');
  return { value, warnings: [...new Set(warnings)].slice(0, 20) };
}
export function formatJson(
  input: string,
  indent: string | number = 2,
  minify = false,
) {
  const { value, warnings } = parseJson(input);
  return {
    output: JSON.stringify(value, null, minify ? undefined : indent),
    warnings,
    message: 'Valid JSON',
  };
}
function signature(
  value: Json,
  ignoreProperties: boolean,
  ignoreArrays: boolean,
): string {
  if (Array.isArray(value)) {
    const items = value.map((v) =>
      signature(v, ignoreProperties, ignoreArrays),
    );
    return `[${(ignoreArrays ? items.sort() : items).join(',')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value);
    if (ignoreProperties) keys.sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${signature(value[key]!, ignoreProperties, ignoreArrays)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
export function diffJson(
  left: string,
  right: string,
  ignoreProperties = true,
  ignoreArrays = false,
) {
  const a = parseJson(left),
    b = parseJson(right);
  const changes: Change[] = [];
  function diff(before: Json, after: Json, path: string) {
    if (
      signature(before, ignoreProperties, ignoreArrays) ===
      signature(after, ignoreProperties, ignoreArrays)
    )
      return;
    if (Array.isArray(before) && Array.isArray(after)) {
      if (ignoreArrays) {
        // Multiset comparison. Every matched element consumes exactly one occurrence.
        const available = new Map<string, number[]>();
        after.forEach((item, index) => {
          const key = signature(item, ignoreProperties, true);
          available.set(key, [...(available.get(key) || []), index]);
        });
        const used = new Set<number>();
        before.forEach((item, index) => {
          const bucket = available.get(signature(item, ignoreProperties, true));
          const match = bucket?.shift();
          if (match === undefined)
            changes.push({
              type: 'removed',
              path: `${path}[${index}]`,
              before: item,
            });
          else used.add(match);
        });
        after.forEach((item, index) => {
          if (!used.has(index))
            changes.push({
              type: 'added',
              path: `${path}[${index}]`,
              after: item,
            });
        });
      } else {
        for (
          let index = 0;
          index < Math.max(before.length, after.length);
          index++
        ) {
          if (index >= before.length)
            changes.push({
              type: 'added',
              path: `${path}[${index}]`,
              after: after[index],
            });
          else if (index >= after.length)
            changes.push({
              type: 'removed',
              path: `${path}[${index}]`,
              before: before[index],
            });
          else diff(before[index]!, after[index]!, `${path}[${index}]`);
        }
      }
    } else if (
      before !== null &&
      after !== null &&
      typeof before === 'object' &&
      typeof after === 'object' &&
      !Array.isArray(before) &&
      !Array.isArray(after)
    ) {
      for (const key of Object.keys(before)) {
        if (!Object.hasOwn(after, key))
          changes.push({
            type: 'removed',
            path: `${path}[${JSON.stringify(key)}]`,
            before: before[key],
          });
        else diff(before[key]!, after[key]!, `${path}[${JSON.stringify(key)}]`);
      }
      for (const key of Object.keys(after))
        if (!Object.hasOwn(before, key))
          changes.push({
            type: 'added',
            path: `${path}[${JSON.stringify(key)}]`,
            after: after[key],
          });
      if (
        !ignoreProperties &&
        Object.keys(before)
          .filter((key) => Object.hasOwn(after, key))
          .join('\0') !==
          Object.keys(after)
            .filter((key) => Object.hasOwn(before, key))
            .join('\0')
      )
        changes.push({
          type: 'changed',
          path: `${path} (property order)`,
          before,
          after,
        });
    } else changes.push({ type: 'changed', path, before, after });
    if (changes.length > 10_000)
      throw new Error(
        'More than 10,000 differences. Compare smaller documents.',
      );
  }
  diff(a.value, b.value, '$');
  const counts = (type: string) =>
    changes.filter((c) => c.type === type).length;
  return {
    changes,
    output: JSON.stringify(changes, null, 2),
    warnings: [...a.warnings, ...b.warnings],
    message: `${counts('added')} added · ${counts('removed')} removed · ${counts('changed')} changed`,
  };
}
