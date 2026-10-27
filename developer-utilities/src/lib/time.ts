import { required } from './shared';
export function timestamp(
  input: string,
  units: string = 'seconds',
  zone = 'UTC',
) {
  required(input);
  let date: Date;
  if (units === 'date') {
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(
        input,
      )
    )
      throw new Error(
        'Use an ISO 8601 date with an explicit offset or Z, e.g. 2026-01-15T09:30:00Z.',
      );
    const [year, month, day] = input.slice(0, 10).split('-').map(Number) as [
      number,
      number,
      number,
    ];
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days =
      [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ||
      0;
    if (month < 1 || month > 12 || day < 1 || day > days)
      throw new Error('Invalid calendar date.');
    date = new Date(input);
  } else {
    if (!/^-?\d+(?:\.\d+)?$/.test(input.trim()))
      throw new Error(
        'Enter a numeric Unix timestamp and explicitly choose seconds or milliseconds.',
      );
    const value = Number(input) * (units === 'seconds' ? 1000 : 1);
    if (!Number.isSafeInteger(value))
      throw new Error(
        'Timestamp must resolve to a safe integer number of milliseconds.',
      );
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime()))
    throw new Error('Invalid date or timestamp outside the supported range.');
  let zoned: string;
  try {
    zoned = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(date);
  } catch {
    throw new Error(
      'Unsupported IANA timezone. Try UTC, America/New_York, or Asia/Karachi.',
    );
  }
  return {
    output: JSON.stringify(
      {
        unixSeconds: Math.floor(date.getTime() / 1000),
        unixMilliseconds: date.getTime(),
        iso8601: date.toISOString(),
        timezone: zone,
        zoned,
        local: date.toString(),
      },
      null,
      2,
    ),
    message: `Converted · ${zone}`,
  };
}
