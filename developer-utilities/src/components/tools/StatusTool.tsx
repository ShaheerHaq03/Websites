import { useState } from 'react';
import { searchStatuses } from '../../data/status-codes';
import { CopyButton, DownloadButton } from './shared';
export default function StatusTool() {
  const [query, setQuery] = useState(''),
    [family, setFamily] = useState('all');
  const results = searchStatuses(query, family);
  const text = results
    .map(
      (item) =>
        `${item.code} ${item.name}\n${item.description}\nExample: ${item.example}\nTroubleshooting: ${item.guidance}`,
    )
    .join('\n\n');
  return (
    <div className="tool-workspace status-tool">
      <div className="status-controls">
        <label className="field">
          Find a status code
          <div className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search code, name, or meaning…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </label>
        <button
          className="btn"
          onClick={() => {
            setQuery('');
            setFamily('all');
          }}
        >
          Clear filters
        </button>
        <button
          className="btn"
          onClick={() => {
            setQuery('rate limit');
            setFamily('all');
          }}
        >
          Load sample
        </button>
      </div>
      <div className="filter-tabs" aria-label="Status code families">
        {[
          ['all', 'All codes'],
          ['1', '1xx Info'],
          ['2', '2xx Success'],
          ['3', '3xx Redirect'],
          ['4', '4xx Client error'],
          ['5', '5xx Server error'],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={family === value}
            onClick={() => setFamily(value!)}
            className={family === value ? 'active' : ''}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="section-heading">
        <p className="muted" role="status">
          {results.length} registered status codes
        </p>
        <div className="toolbar">
          <CopyButton text={text} label="Copy results" />
          <DownloadButton text={text} filename="http-status-codes.txt" />
        </div>
      </div>
      <div className="status-list">
        {results.length ? (
          results.map((item) => (
            <article className="status-card" key={item.code}>
              <div className="status-card-top">
                <span
                  className={`http-code family-${Math.floor(item.code / 100)}`}
                >
                  {item.code}
                </span>
                <h2>{item.name}</h2>
                <CopyButton
                  text={String(item.code)}
                  label={`Copy ${item.code}`}
                />
              </div>
              <p>{item.description}</p>
              <p>
                <strong>Example:</strong> {item.example}
              </p>
              <p className="muted">
                <strong>Check:</strong> {item.guidance}
              </p>
              <a
                href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/${item.code}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read HTTP documentation <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))
        ) : (
          <p className="empty-state">
            No status codes match. Try a number such as 404 or a phrase such as
            gateway.
          </p>
        )}
      </div>
      <p className="inline-help">
        Bundled registered-code selection, checked October 27, 2026. Vendor
        codes, unassigned values, and reserved or deprecated entries are
        excluded.{' '}
        <a
          href="https://www.iana.org/assignments/http-status-codes/"
          target="_blank"
          rel="noopener noreferrer"
        >
          IANA registry ↗
        </a>
      </p>
    </div>
  );
}
