import { required } from './shared';
export function encodeBase64(input: string, url = false) {
  required(input);
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary);
  return url
    ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    : encoded;
}
export function decodeBase64(input: string, url = false) {
  required(input);
  const text = input.trim();
  const alphabet = url ? /^[A-Za-z0-9_-]*={0,2}$/ : /^[A-Za-z0-9+/]*={0,2}$/;
  const raw = text.replace(/=+$/, '');
  if (
    !alphabet.test(text) ||
    raw.length % 4 === 1 ||
    (text.includes('=') && text.length % 4 !== 0)
  )
    throw new Error('Invalid Base64 alphabet, length, or padding.');
  const normalized = raw.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const bytes = Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
    // Re-encoding also rejects nonzero padding bits.
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    if (btoa(binary).replace(/=+$/, '') !== normalized)
      throw new Error('Noncanonical padding bits.');
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(
      'Invalid Base64 or non-UTF-8 binary data. This tool decodes UTF-8 text only.',
    );
  }
}
export function decodeJwt(input: string, now = Date.now()) {
  required(input);
  const parts = input.trim().split('.');
  if (parts.length !== 3)
    throw new Error('A compact JWT must have three dot-separated segments.');
  if (!parts[0] || !parts[1] || !/^[A-Za-z0-9_-]*$/.test(parts[2]!))
    throw new Error('Malformed JWT segments.');
  let header: unknown, payload: unknown;
  try {
    header = JSON.parse(decodeBase64(parts[0], true));
    payload = JSON.parse(decodeBase64(parts[1], true));
  } catch {
    throw new Error('JWT header and payload must be Base64URL-encoded JSON.');
  }
  if (
    !header ||
    !payload ||
    typeof header !== 'object' ||
    typeof payload !== 'object' ||
    Array.isArray(header) ||
    Array.isArray(payload)
  )
    throw new Error('JWT header and payload must be JSON objects.');
  const claims = payload as Record<string, unknown>;
  const timestamps: Record<string, string> = {};
  for (const name of ['iat', 'exp', 'nbf'])
    if (claims[name] !== undefined) {
      if (typeof claims[name] !== 'number' || !Number.isFinite(claims[name]))
        throw new Error(`Claim ${name} must be a NumericDate in seconds.`);
      const date = new Date(claims[name] * 1000);
      if (Number.isNaN(date.getTime()))
        throw new Error(`Claim ${name} is out of date range.`);
      timestamps[name] = date.toISOString();
    }
  const state =
    typeof claims.exp === 'number' && claims.exp * 1000 <= now
      ? 'Timestamp indicates expiry'
      : typeof claims.nbf === 'number' && claims.nbf * 1000 > now
        ? 'Timestamp indicates not yet active'
        : 'No timestamp restriction detected (not a validity check)';
  return {
    output: JSON.stringify(
      {
        header,
        payload,
        timestamps,
        timestampStatus: state,
        signatureVerified: false,
      },
      null,
      2,
    ),
    message: state,
    warnings: ['Decoded only. Signature has not been verified.'],
  };
}
export type UrlMode = 'component' | 'uri' | 'form';
export function transformUrl(
  input: string,
  action: string,
  mode: UrlMode = 'component',
) {
  required(input);
  if (action === 'inspect') {
    let url: URL;
    try {
      url = new URL(input);
    } catch {
      throw new Error(
        'Enter an absolute URL including its scheme, such as https://example.org/search?q=hello.',
      );
    }
    if (!['http:', 'https:'].includes(url.protocol))
      throw new Error('URL inspection supports HTTP and HTTPS URLs.');
    // URLSearchParams tolerates malformed escapes; inspection reports them rather than silently repairing.
    try {
      decodeURIComponent(url.search);
    } catch {
      throw new Error(
        'URL contains malformed percent escapes or invalid UTF-8 in its query.',
      );
    }
    const parameters: [string, string][] = [...url.searchParams];
    return {
      output: JSON.stringify(
        {
          protocol: url.protocol,
          host: url.host,
          pathname: url.pathname,
          fragment: url.hash,
          query: parameters,
        },
        null,
        2,
      ),
      parameters,
      urlBase: `${url.origin}${url.pathname}${url.hash}`,
      message: `${parameters.length} query parameters · URL was not fetched`,
    };
  }
  try {
    const output =
      action === 'encode'
        ? mode === 'uri'
          ? encodeURI(input)
          : mode === 'form'
            ? new URLSearchParams({ value: input }).toString().slice(6)
            : encodeURIComponent(input)
        : mode === 'uri'
          ? decodeURI(input)
          : decodeURIComponent(
              mode === 'form' ? input.replace(/\+/g, ' ') : input,
            );
    return {
      output,
      message: `${action === 'encode' ? 'Encoded' : 'Decoded'} using ${mode} rules`,
    };
  } catch {
    throw new Error(
      'Malformed percent escape, invalid UTF-8, or unmatched Unicode surrogate. Check the input.',
    );
  }
}
export function editUrl(input: string, parameters: [string, string][]) {
  const url = new URL(input);
  url.search = new URLSearchParams(parameters).toString();
  return url.href;
}
