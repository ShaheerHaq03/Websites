import { lazy, Suspense } from 'react';
import type { ToolId } from '../../data/tools';
const DataTools = lazy(() => import('./DataTools'));
const EncodingTools = lazy(() => import('./EncodingTools'));
const UuidTool = lazy(() => import('./UuidTool'));
const RegexTool = lazy(() => import('./RegexTool'));
const TimeTools = lazy(() => import('./TimeTools'));
const StatusTool = lazy(() => import('./StatusTool'));
export default function ToolApp({ id }: { id: ToolId }) {
  return (
    <Suspense
      fallback={
        <div className="tool-loading" role="status">
          <span className="loading-dot" />
          Preparing your local workspace…
          <noscript>
            Enable JavaScript to use this browser-based tool. The guide below is
            available without JavaScript.
          </noscript>
        </div>
      }
    >
      {['json-formatter', 'json-diff', 'json-to-csv', 'csv-to-json'].includes(
        id,
      ) ? (
        <DataTools id={id} />
      ) : [
          'jwt-decoder',
          'base64-encoder-decoder',
          'url-encoder-decoder',
        ].includes(id) ? (
        <EncodingTools id={id} />
      ) : id === 'uuid-generator' ? (
        <UuidTool />
      ) : id === 'regex-tester' ? (
        <RegexTool />
      ) : id === 'http-status-codes' ? (
        <StatusTool />
      ) : (
        <TimeTools id={id} />
      )}
    </Suspense>
  );
}
