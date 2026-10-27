import type { Task, TaskResult } from '../lib/shared';
self.onmessage = async (event: MessageEvent<Task>) => {
  const { kind, input, second = '', options: o = {} } = event.data;
  try {
    let result: TaskResult;
    switch (kind) {
      case 'json-format':
      case 'json-minify':
      case 'json-validate': {
        const { formatJson } = await import('../lib/json');
        result = formatJson(
          input,
          o.indent === 'tab' ? '\t' : Number(o.indent || 2),
          kind === 'json-minify',
        );
        break;
      }
      case 'json-diff': {
        const { diffJson } = await import('../lib/json');
        result = diffJson(
          input,
          second,
          o.ignoreProperties !== false,
          o.ignoreArrays === true,
        );
        break;
      }
      case 'json-to-csv': {
        const { jsonToCsv } = await import('../lib/csv');
        result = jsonToCsv(
          input,
          String(o.delimiter || ','),
          String(o.separator || '.'),
          o.safeFormulas !== false,
        );
        break;
      }
      case 'csv-to-json': {
        const { csvToJson } = await import('../lib/csv');
        result = csvToJson(
          input,
          String(o.delimiter || ','),
          o.headers !== false,
          o.trim === true,
          Number(o.indent || 2),
        );
        break;
      }
      case 'jwt': {
        const { decodeJwt } = await import('../lib/encoding');
        result = decodeJwt(input);
        break;
      }
      case 'base64-encode':
      case 'base64-decode': {
        const { encodeBase64, decodeBase64 } = await import('../lib/encoding');
        result = {
          output: (kind === 'base64-encode' ? encodeBase64 : decodeBase64)(
            input,
            o.url === true,
          ),
          message: 'Completed locally · UTF-8 text',
        };
        break;
      }
      case 'regex': {
        const { testRegex } = await import('../lib/regex');
        result = testRegex(
          input,
          second,
          String(o.flags ?? 'g'),
          String(o.replacement ?? ''),
        );
        break;
      }
      case 'timestamp': {
        const { timestamp } = await import('../lib/time');
        result = timestamp(
          input,
          String(o.units || 'seconds'),
          String(o.zone || 'UTC'),
        );
        break;
      }
      case 'cron': {
        const { cronPreview } = await import('../lib/cron');
        result = cronPreview(input, String(o.zone || 'UTC'));
        break;
      }
      case 'url-encode':
      case 'url-decode':
      case 'url-inspect': {
        const { transformUrl } = await import('../lib/encoding');
        result = transformUrl(
          input,
          kind.slice(4),
          o.mode as 'component' | 'uri' | 'form',
        );
        break;
      }
      default:
        throw new Error('Unknown operation.');
    }
    self.postMessage({ result });
  } catch (error) {
    self.postMessage({
      error:
        error instanceof Error ? error.message : 'Unable to process input.',
    });
  }
};
