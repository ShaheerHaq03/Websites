import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import { required } from './shared';
export function cronPreview(
  expression: string,
  zone = 'UTC',
  now = new Date(),
  count = 5,
) {
  required(expression);
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5 || fields.some((field) => !/^[\d*,/-]+$/.test(field)))
    throw new Error(
      'Use numeric five-field cron: minute hour day-of-month month day-of-week. Extensions, names, and seconds are not supported.',
    );
  if (
    fields.some((field) =>
      field
        .split(',')
        .some(
          (part) =>
            part === '' ||
            (part.includes('/') &&
              !/^(?:\*|\d+(?:-\d+)?)\/[1-9]\d*$/.test(part)),
        ),
    )
  )
    throw new Error('Invalid cron list, range, or step.');
  try {
    const schedule = CronExpressionParser.parse(expression, {
      currentDate: now,
      tz: zone,
    });
    const dates = Array.from({ length: count }, () => schedule.next().toDate());
    return {
      output: dates
        .map(
          (date) =>
            `${date.toISOString()}  |  ${new Intl.DateTimeFormat('en-GB', { timeZone: zone, dateStyle: 'medium', timeStyle: 'long' }).format(date)}`,
        )
        .join('\n'),
      message: cronstrue.toString(expression, {
        throwExceptionOnParseError: true,
        use24HourTimeFormat: true,
      }),
      warnings: [
        `Timezone: ${zone}. When both day fields are restricted, either day-of-month OR day-of-week matches. DST follows cron-parser timezone rules; verify against your production scheduler.`,
      ],
    };
  } catch (e) {
    throw new Error(
      `Invalid or unsupported cron schedule: ${e instanceof Error ? e.message : 'no next run found'}`,
      { cause: e },
    );
  }
}
