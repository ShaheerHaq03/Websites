import { bounded, type RegexMatch } from './shared';
export function testRegex(
  pattern: string,
  text: string,
  flags = 'g',
  replacement = '',
) {
  bounded(text);
  if (pattern.length > 2000)
    throw new Error('Pattern limit is 2,000 characters.');
  if (
    !/^[dgimsuvy]*$/.test(flags) ||
    new Set(flags).size !== flags.length ||
    (flags.includes('u') && flags.includes('v'))
  )
    throw new Error('Invalid or duplicate JavaScript RegExp flags.');
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    throw new Error(
      `Invalid pattern: ${e instanceof Error ? e.message : 'syntax error'}`,
      { cause: e },
    );
  }
  const matches: RegexMatch[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      value: match[0],
      index: match.index,
      groups: match.slice(1),
      named: match.groups || {},
    });
    if (matches.length >= 5000)
      throw new Error(
        'Match limit is 5,000. Narrow the pattern or reduce the test string.',
      );
    if (!regex.global && !regex.sticky) break;
    if (match[0] === '') {
      const index = regex.lastIndex;
      const point = text.codePointAt(index);
      regex.lastIndex +=
        (regex.unicode || flags.includes('v')) &&
        point !== undefined &&
        point > 0xffff
          ? 2
          : 1;
    }
  }
  const output = text.replace(new RegExp(pattern, flags), replacement);
  return {
    output,
    matches,
    message: `${matches.length} matches · JavaScript RegExp`,
  };
}
