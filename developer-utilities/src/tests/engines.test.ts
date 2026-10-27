import { describe, it, expect, vi } from 'vitest';
import { formatJson, parseJson, diffJson } from '../lib/json';
import { jsonToCsv, csvToJson } from '../lib/csv';
import {
  encodeBase64,
  decodeBase64,
  decodeJwt,
  transformUrl,
  editUrl,
} from '../lib/encoding';
import { generateUuids, validateUuid } from '../lib/uuid';
import { testRegex } from '../lib/regex';
import { timestamp } from '../lib/time';
import { cronPreview } from '../lib/cron';
import { searchStatuses, statusCodes } from '../data/status-codes';
import { bounded } from '../lib/shared';

describe('JSON formatter', () => {
  it('formats nested JSON without changing scalar types', () => {
    const output = formatJson('{"a":[1,true,null,"世界"]}').output;
    expect(output).toContain('\n  "a"');
    expect(JSON.parse(output)).toEqual({ a: [1, true, null, '世界'] });
  });
  it('supports tabs, four spaces and minification', () => {
    expect(formatJson('{"x":1}', '\t').output).toContain('\t"x"');
    expect(formatJson('{"x":1}', 4).output).toContain('    "x"');
    expect(formatJson(' { "x" : 1 } ', 2, true).output).toBe('{"x":1}');
  });
  it.each(['null', '[]', '{}', 'false', '0', '""'])(
    'accepts valid empty or primitive JSON: %s',
    (input) => expect(() => parseJson(input)).not.toThrow(),
  );
  it.each(['', '{', '{"x":1,}', '// comment\n{}', 'undefined'])(
    'rejects invalid input %j',
    (input) => expect(() => parseJson(input)).toThrow(),
  );
  it('warns for duplicate keys, including escaped aliases', () => {
    const parsed = parseJson('{"x":1,"\\u0078":2,"obj":{"x":3,"x":4}}');
    expect(parsed.warnings).toHaveLength(2);
    expect(parsed.value).toEqual({ x: 2, obj: { x: 4 } });
  });
  it('handles a bounded large document', () =>
    expect(
      JSON.parse(
        formatJson(
          JSON.stringify(
            Array.from({ length: 4000 }, (_, i) => ({ id: i, value: '🚀' })),
          ),
        ).output,
      ),
    ).toHaveLength(4000));
  it('limits bytes and nesting', () => {
    expect(() => bounded('😃'.repeat(250001))).toThrow('1 MB');
    expect(() => parseJson('['.repeat(152) + '0' + ']'.repeat(152))).toThrow(
      'nesting',
    );
  });
});
describe('JSON diff', () => {
  it('identifies additions, removals and typed changes at nested paths', () => {
    const result = diffJson(
      '{"x":{"n":1},"old":null}',
      '{"x":{"n":"1"},"new":false}',
    );
    expect(result.changes).toEqual(
      expect.arrayContaining([
        { type: 'changed', path: '$["x"]["n"]', before: 1, after: '1' },
        { type: 'removed', path: '$["old"]', before: null },
        { type: 'added', path: '$["new"]', after: false },
      ]),
    );
  });
  it('ignores object order by default and can compare it', () => {
    expect(diffJson('{"a":1,"b":2}', '{"b":2,"a":1}').changes).toHaveLength(0);
    expect(
      diffJson('{"a":1,"b":2}', '{"b":2,"a":1}', false).changes[0]?.path,
    ).toContain('property order');
  });
  it('compares ordered arrays by index', () =>
    expect(diffJson('[1,2]', '[2,1]').changes).toHaveLength(2));
  it('preserves duplicate elements in unordered arrays', () => {
    expect(diffJson('[1,1]', '[1]', true, true).changes).toEqual([
      { type: 'removed', path: '$[1]', before: 1 },
    ]);
    expect(diffJson('[1]', '[1,1]', true, true).changes[0]?.type).toBe('added');
  });
  it('matches nested arrays and objects as multisets', () => {
    expect(
      diffJson('[{"a":[1,2]},{"a":[1,2]}]', '[{"a":[2,1]}]', true, true)
        .changes,
    ).toHaveLength(1);
    expect(
      diffJson('[null,true,1,"1"]', '["1",1,true,null]', true, true).changes,
    ).toHaveLength(0);
  });
  it('compares nulls and empty values', () => {
    expect(diffJson('null', '{}').changes).toHaveLength(1);
    expect(diffJson('[]', '[]').changes).toHaveLength(0);
    expect(diffJson('{}', '{"__proto__":1}').changes[0]?.after).toBe(1);
  });
  it('rejects either malformed document', () => {
    expect(() => diffJson('{}', '{')).toThrow();
    expect(() => diffJson('', '{}')).toThrow();
  });
});
describe('JSON to CSV', () => {
  it('flattens nested objects and unions missing keys', () => {
    const result = jsonToCsv('[{"a":{"b":1}},{"c":2}]', ',', '_', false);
    expect(result.output).toBe('a_b,c\r\n1,\r\n,2');
  });
  it('quotes commas, quotes, newlines and Unicode', () => {
    const original = [
      { name: '世界, "Ada"\nLine two', array: [1, 2], empty: null },
    ];
    const csv = jsonToCsv(JSON.stringify(original), ',', '.', false);
    const back = JSON.parse(csvToJson(csv.output).output);
    expect(back[0].name).toBe(original[0]!.name);
    expect(back[0].array).toBe('[1,2]');
    expect(back[0].empty).toBe('');
  });
  it('rejects flattening collisions and invalid roots', () => {
    expect(() => jsonToCsv('[{"a.b":1,"a":{"b":2}}]')).toThrow('collision');
    for (const input of ['', '{}', '[]', '[1]', '[null]', '[{}]'])
      expect(() => jsonToCsv(input)).toThrow();
  });
  it('prevents prototype pollution and protects spreadsheet formula cells by default', () => {
    const out = jsonToCsv('[{"__proto__":"value","cell":"=1+1"}]');
    expect(out.output).toContain('value');
    expect(out.output).toContain("'=1+1");
    expect({}).not.toHaveProperty('cell');
  });
  it('uses configurable delimiters and explains loss', () => {
    const result = jsonToCsv('[{"x":true,"y":null}]', ';');
    expect(result.output).toContain('x;y');
    expect(result.warnings.join(' ')).toContain('data types');
  });
});
describe('CSV to JSON', () => {
  it('parses quoted multiline cells and escaped quotation marks', () => {
    const result = csvToJson(
      'name,note\r\nAda,"line 1\r\nline 2, with ""quotes"""',
    );
    expect(JSON.parse(result.output)).toEqual([
      { name: 'Ada', note: 'line 1\r\nline 2, with "quotes"' },
    ]);
  });
  it('keeps all cells as strings including empty values and leading zeros', () =>
    expect(JSON.parse(csvToJson('id,yes,empty\n001,true,').output)).toEqual([
      { id: '001', yes: 'true', empty: '' },
    ]));
  it('supports headerless rows, trimming and Unicode', () =>
    expect(
      JSON.parse(
        csvToJson(' 世界 ; 😀 \n hello ; world ', ';', false, true, 4).output,
      ),
    ).toEqual([
      ['世界', '😀'],
      ['hello', 'world'],
    ]));
  it.each(['a,a\n1,2', ',b\n1,2', 'a,b\n1', 'a,b\n"unclosed,2'])(
    'rejects malformed or ambiguous CSV: %s',
    (input) => expect(() => csvToJson(input)).toThrow(),
  );
  it('rejects empty input and unsupported delimiters', () => {
    expect(() => csvToJson('')).toThrow();
    expect(() => csvToJson('a\n1', '::')).toThrow();
  });
});
describe('Base64', () => {
  it.each(['Hello', '世界 😀', 'quotes " and\nnewlines', '\u0000\t\r'])(
    'round-trips UTF-8: %j',
    (text) => {
      expect(decodeBase64(encodeBase64(text))).toBe(text);
      expect(decodeBase64(encodeBase64(text, true), true)).toBe(text);
    },
  );
  it('supports valid unpadded values', () =>
    expect(decodeBase64('SGk')).toBe('Hi'));
  it.each(['a', '@@', 'SGk===', 'S=Gk', 'SGk=\nZ', '/w==', 'Zh=='])(
    'rejects malformed or non-text Base64: %j',
    (text) => expect(() => decodeBase64(text)).toThrow(),
  );
  it('distinguishes standard and URL alphabets', () => {
    expect(() => decodeBase64('-_8=')).toThrow();
    expect(() => decodeBase64('+w==', true)).toThrow();
  });
  it('rejects empty input', () => {
    expect(() => encodeBase64('')).toThrow();
    expect(() => decodeBase64('')).toThrow();
  });
});
describe('JWT inspection', () => {
  const token = (payload: unknown) =>
    `${encodeBase64('{"alg":"none"}', true)}.${encodeBase64(JSON.stringify(payload), true)}.`;
  it('decodes claims but explicitly never verifies signatures', () => {
    const result = decodeJwt(
      token({ sub: '世界', iat: 1700000000, exp: 1700003600 }),
      1700004000000,
    );
    expect(JSON.parse(result.output).signatureVerified).toBe(false);
    expect(result.message).toContain('expiry');
    expect(result.warnings[0]).toBe(
      'Decoded only. Signature has not been verified.',
    );
  });
  it('reports not-before and missing-expiry semantics', () => {
    expect(decodeJwt(token({ nbf: 200 }), 100000).message).toContain(
      'not yet active',
    );
    expect(decodeJwt(token({})).message).toContain('not a validity check');
  });
  it.each(['', 'a.b', 'a.b.c.d.e', '!.e30.sig', 'e30.W10.sig', 'e30.e30.*'])(
    'rejects malformed tokens %j',
    (value) => expect(() => decodeJwt(value)).toThrow(),
  );
  it('rejects malformed timestamp claims', () =>
    expect(() => decodeJwt(token({ exp: 'tomorrow' }))).toThrow('NumericDate'));
});
describe('UUID v4', () => {
  it('generates real secure UUIDs with correct version and variant', () => {
    const spy = vi.spyOn(crypto, 'randomUUID');
    const ids = generateUuids(30).split('\n');
    expect(ids.every(validateUuid)).toBe(true);
    expect(new Set(ids).size).toBe(30);
    expect(spy).toHaveBeenCalledTimes(30);
    spy.mockRestore();
  });
  it('controls letter case', () => {
    const result = generateUuids(2, true);
    expect(result).toBe(result.toUpperCase());
    expect(result.split('\n').every(validateUuid)).toBe(true);
  });
  it.each([0, -1, 1.5, 1001, NaN])('rejects unsafe batch count %s', (count) =>
    expect(() => generateUuids(count)).toThrow(),
  );
  it('validates version and variant rather than just UUID shape', () => {
    expect(validateUuid('6d5ea54e-a7df-4a83-9773-594c01714db3')).toBe(true);
    expect(validateUuid('6d5ea54e-a7df-7a83-9773-594c01714db3')).toBe(false);
    expect(validateUuid('6d5ea54e-a7df-4a83-1773-594c01714db3')).toBe(false);
    expect(validateUuid('')).toBe(false);
  });
  it('supports the 1000-ID upper bound', () =>
    expect(generateUuids(1000).split('\n')).toHaveLength(1000));
});
describe('JavaScript regex', () => {
  it('records matches, numbered and named groups and replacement', () => {
    const result = testRegex('(?<id>\\d+)', 'a12 b34', 'g', '[$<id>]');
    expect(result.matches[0]).toEqual({
      value: '12',
      index: 1,
      groups: ['12'],
      named: { id: '12' },
    });
    expect(result.output).toBe('a[12] b[34]');
  });
  it('handles zero-length matches, including Unicode code points', () => {
    expect(testRegex('(?:)', '😀', 'gu').matches.map((m) => m.index)).toEqual([
      0, 2,
    ]);
    expect(testRegex('(?:)', 'ab', 'g').matches).toHaveLength(3);
  });
  it('honors non-global and sticky flags', () => {
    expect(testRegex('a', 'aaa', '').matches).toHaveLength(1);
    expect(testRegex('a', 'aaa', 'y').matches).toHaveLength(3);
  });
  it('permits empty patterns and empty text without loops', () =>
    expect(testRegex('', '', 'g').matches).toHaveLength(1));
  it.each([
    ['[', 'g'],
    ['a', 'gg'],
    ['a', 'uv'],
    ['a', 'z'],
  ])('rejects invalid pattern or flags', (pattern, flags) =>
    expect(() => testRegex(pattern, 'text', flags)).toThrow(),
  );
  it('enforces pattern, input and match limits', () => {
    expect(() => testRegex('a'.repeat(2001), 'a')).toThrow('Pattern');
    expect(() => testRegex('a', 'a'.repeat(6000), 'g')).toThrow('Match limit');
  });
});
describe('Unix timestamps', () => {
  it('supports negative timestamps and explicit units', () => {
    expect(JSON.parse(timestamp('-1').output).iso8601).toBe(
      '1969-12-31T23:59:59.000Z',
    );
    expect(
      JSON.parse(timestamp('1000', 'milliseconds').output).unixSeconds,
    ).toBe(1);
  });
  it('accepts a leap day but rejects rollover dates', () => {
    expect(
      JSON.parse(timestamp('2024-02-29T00:00:00Z', 'date').output).iso8601,
    ).toContain('2024-02-29');
    expect(() => timestamp('2023-02-29T00:00:00Z', 'date')).toThrow();
  });
  it('keeps offset-defined DST instants unambiguous', () => {
    const first = JSON.parse(
      timestamp('2026-11-01T01:30:00-04:00', 'date', 'America/New_York').output,
    );
    const second = JSON.parse(
      timestamp('2026-11-01T01:30:00-05:00', 'date', 'America/New_York').output,
    );
    expect(second.unixSeconds - first.unixSeconds).toBe(3600);
  });
  it.each(['', 'tomorrow', '2026-01-01T00:00:00', '2026-13-01T00:00:00Z'])(
    'rejects invalid or ambiguous ISO %j',
    (input) => expect(() => timestamp(input, 'date')).toThrow(),
  );
  it('rejects invalid numeric values and timezones', () => {
    expect(() => timestamp('1e3')).toThrow();
    expect(() => timestamp('999999999999999999')).toThrow();
    expect(() => timestamp('0', 'seconds', 'Not/AZone')).toThrow();
  });
});
describe('Five-field cron', () => {
  const now = new Date('2026-01-01T00:00:00Z');
  it('previews future runs and an accurate description', () => {
    const result = cronPreview('*/15 * * * *', 'UTC', now);
    expect(result.output.split('\n')).toHaveLength(5);
    expect(result.output).toContain('2026-01-01T00:15:00.000Z');
    expect(result.message).toContain('15 minutes');
  });
  it('supports OR semantics for restricted day fields', () => {
    const result = cronPreview('0 0 1 * 1', 'UTC', now);
    expect(result.output.split('\n')[0]).toContain('2026-01-05');
  });
  it('supports Sunday as 0 or 7 and timezone conversion', () => {
    expect(cronPreview('0 9 * * 0', 'UTC', now).output).toBe(
      cronPreview('0 9 * * 7', 'UTC', now).output,
    );
    expect(cronPreview('0 9 * * *', 'Asia/Karachi', now).output).toContain(
      '2026-01-01T04:00:00.000Z',
    );
  });
  it.each([
    '',
    '* * * * * *',
    '0 9 ? * MON',
    '@daily',
    '0 9 L * *',
    '60 * * * *',
    '*/0 * * * *',
    '0 0 31 2 *',
  ])('rejects unsupported or invalid schedules: %s', (input) =>
    expect(() => cronPreview(input, 'UTC', now)).toThrow(),
  );
});
describe('URL encoding and inspection', () => {
  it('distinguishes component, URI and form rules', () => {
    expect(transformUrl('a b&+', 'encode', 'component').output).toBe(
      'a%20b%26%2B',
    );
    expect(
      transformUrl('https://example.org/?x=a b', 'encode', 'uri').output,
    ).toBe('https://example.org/?x=a%20b');
    expect(transformUrl('a b+', 'encode', 'form').output).toBe('a+b%2B');
    expect(transformUrl('a+b%2B', 'decode', 'form').output).toBe('a b+');
  });
  it('round-trips Unicode and special characters', () => {
    const text = '世界 & 😀';
    expect(
      transformUrl(transformUrl(text, 'encode').output, 'decode').output,
    ).toBe(text);
  });
  it('preserves duplicate query parameters and supports editing', () => {
    const input = 'https://example.org/?a=1&a=2#test';
    expect(transformUrl(input, 'inspect').parameters).toEqual([
      ['a', '1'],
      ['a', '2'],
    ]);
    expect(
      editUrl(input, [
        ['a', 'hello world'],
        ['a', '+'],
      ]),
    ).toBe('https://example.org/?a=hello+world&a=%2B#test');
  });
  it.each(['%', '%ZZ', '%E0%A4'])(
    'rejects malformed percent escapes %s',
    (input) => expect(() => transformUrl(input, 'decode')).toThrow(),
  );
  it('rejects empty input, malformed query escapes and unsupported schemes', () => {
    expect(() => transformUrl('', 'encode')).toThrow();
    expect(() => transformUrl('javascript:alert(1)', 'inspect')).toThrow();
    expect(() =>
      transformUrl('https://example.org/?x=%GG', 'inspect'),
    ).toThrow();
  });
});
describe('HTTP reference', () => {
  it('searches by code, meaning and family', () => {
    expect(searchStatuses('404')[0]?.name).toBe('Not Found');
    expect(searchStatuses('rate limit')[0]?.code).toBe(429);
    expect(searchStatuses('', '5').every((code) => code.code >= 500)).toBe(
      true,
    );
  });
  it('excludes unassigned and vendor codes and has an empty state', () => {
    expect(searchStatuses('520')).toHaveLength(0);
    expect(searchStatuses('banana')).toHaveLength(0);
    expect(statusCodes.every((code) => code.standard)).toBe(true);
  });
  it('includes honest semantics for 402 and distinguishes authentication', () => {
    expect(searchStatuses('402')[0]?.description).toContain('Reserved');
    expect(searchStatuses('401')[0]?.guidance).toContain('WWW-Authenticate');
    expect(new Set(statusCodes.map((s) => s.code)).size).toBe(
      statusCodes.length,
    );
  });
});

describe('precision and preview safeguards', () => {
  it('warns about unsafe JSON integers and rejects numeric overflow', () => {
    expect(parseJson('{"id":9007199254740993}').warnings.join(' ')).toContain(
      'safe integer',
    );
    expect(() => parseJson('{"value":1e999}')).toThrow('numeric range');
  });
  it('keeps the first headerless CSV record in the preview body', () => {
    expect(csvToJson('Ada,001\nLin,002', ',', false).table).toEqual([
      ['Column 1', 'Column 2'],
      ['Ada', '001'],
      ['Lin', '002'],
    ]);
  });
});
