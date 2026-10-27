import { lazy, Suspense, useState } from 'react';
import { ImageDropzone, Select } from './controls';
import type { ToolId } from '../../data/tools';
const ToolApp = lazy(() => import('./ToolApp'));
export default function HomeEntry() {
  const [files, setFiles] = useState<File[]>([]),
    [tool, setTool] = useState<ToolId>('image-compressor'),
    [open, setOpen] = useState(false);
  return (
    <div className={open ? 'home-workspace' : 'home-entry'}>
      {!open ? (
        <>
          <ImageDropzone
            onFiles={(files) => setFiles(files)}
            multiple={false}
          />
          {files.length > 0 && (
            <div className="home-file-choice">
              <div>
                <strong>{files[0]!.name}</strong>
                <span>Selected locally. Choose what you’d like to do.</span>
              </div>
              <Select
                label="Choose a tool"
                value={tool}
                onChange={(v) => setTool(v as ToolId)}
                options={[
                  ['image-compressor', 'Compress'],
                  ['image-resizer', 'Resize'],
                  ['image-to-webp', 'Convert to WebP'],
                  ['image-cropper', 'Crop'],
                  ['image-metadata-viewer', 'Inspect metadata'],
                ]}
              />
              <button className="btn primary" onClick={() => setOpen(true)}>
                Open workspace →
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="home-workspace-heading">
            <span>YOUR LOCAL WORKSPACE</span>
            <button
              className="btn small"
              onClick={() => {
                setOpen(false);
                setFiles([]);
              }}
            >
              Start over
            </button>
          </div>
          <Suspense
            fallback={
              <p className="tool-loading">Preparing your image workspace…</p>
            }
          >
            <ToolApp key={tool} id={tool} initialFiles={files} />
          </Suspense>
        </>
      )}
    </div>
  );
}
