import { useRef, type PointerEvent } from 'react';
import { centeredCrop, rotatedSize } from '../../lib/math';
import type { Dimensions, Rect } from '../../lib/types';
export default function CropStage({
  url,
  size,
  rotation,
  rect,
  onChange,
  ratio,
  zoom = 1,
}: {
  url: string;
  size: Dimensions;
  rotation: number;
  rect: Rect;
  onChange: (rect: Rect) => void;
  ratio: number | null;
  zoom?: number;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const image = rotatedSize(size, rotation);
  const drag = (event: PointerEvent<HTMLElement>, resize = false) => {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const bounds = stage.current!.getBoundingClientRect();
    const start = { clientX: event.clientX, clientY: event.clientY, ...rect };
    element.setPointerCapture(event.pointerId);
    const move = (e: globalThis.PointerEvent) => {
      const dx =
          ((e.clientX - start.clientX) * image.width) / (bounds.width * zoom),
        dy =
          ((e.clientY - start.clientY) * image.height) / (bounds.height * zoom);
      if (!resize)
        onChange({
          ...rect,
          x: Math.round(
            Math.max(0, Math.min(image.width - rect.width, start.x + dx)),
          ),
          y: Math.round(
            Math.max(0, Math.min(image.height - rect.height, start.y + dy)),
          ),
        });
      else {
        let width = Math.max(
          1,
          Math.min(image.width - start.x, Math.round(start.width + dx)),
        );
        let height = ratio
          ? Math.max(1, Math.round(width / ratio))
          : Math.max(
              1,
              Math.min(image.height - start.y, Math.round(start.height + dy)),
            );
        if (height > image.height - start.y) {
          height = image.height - start.y;
          width = ratio ? Math.round(height * ratio) : width;
        }
        onChange({
          ...rect,
          width: Math.max(1, width),
          height: Math.max(1, height),
        });
      }
    };
    const end = () => {
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', end);
      element.removeEventListener('pointercancel', end);
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', end);
    element.addEventListener('pointercancel', end);
  };
  return (
    <div className="crop-area">
      <div
        ref={stage}
        className="crop-stage"
        style={{
          width: Math.min(640, (420 * image.width) / image.height),
          aspectRatio: image.width / image.height,
        }}
      >
        <div className="crop-inner" style={{ transform: `scale(${zoom})` }}>
          <img
            src={url}
            alt="Image to crop"
            draggable={false}
            style={{
              width: `${(size.width / image.width) * 100}%`,
              height: `${(size.height / image.height) * 100}%`,
              transform: `translate(-50%,-50%) rotate(${rotation}deg)`,
            }}
          />
          <div
            className="crop-box"
            style={{
              left: `${(rect.x / image.width) * 100}%`,
              top: `${(rect.y / image.height) * 100}%`,
              width: `${(rect.width / image.width) * 100}%`,
              height: `${(rect.height / image.height) * 100}%`,
            }}
          >
            <button
              className="crop-move"
              aria-label="Move crop area with arrow keys or drag"
              onPointerDown={(e) => drag(e)}
              onKeyDown={(e) => {
                const delta = e.shiftKey ? 10 : 1;
                if (
                  ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  onChange({
                    ...rect,
                    x: Math.max(
                      0,
                      Math.min(
                        image.width - rect.width,
                        rect.x +
                          (e.key === 'ArrowLeft'
                            ? -delta
                            : e.key === 'ArrowRight'
                              ? delta
                              : 0),
                      ),
                    ),
                    y: Math.max(
                      0,
                      Math.min(
                        image.height - rect.height,
                        rect.y +
                          (e.key === 'ArrowUp'
                            ? -delta
                            : e.key === 'ArrowDown'
                              ? delta
                              : 0),
                      ),
                    ),
                  });
                }
              }}
            >
              <span className="crop-grid" aria-hidden="true" />
              <span className="crop-badge" aria-hidden="true">
                {rect.width} × {rect.height}
              </span>
            </button>
            <button
              className="crop-handle"
              aria-label="Resize crop area with arrow keys or drag"
              onPointerDown={(e) => drag(e, true)}
              onKeyDown={(e) => {
                if (
                  ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  const width = Math.max(
                    1,
                    Math.min(
                      image.width - rect.x,
                      rect.width +
                        (e.key === 'ArrowLeft'
                          ? -1
                          : e.key === 'ArrowRight'
                            ? 1
                            : 0),
                    ),
                  );
                  const height = ratio
                    ? Math.max(1, Math.round(width / ratio))
                    : Math.max(
                        1,
                        Math.min(
                          image.height - rect.y,
                          rect.height +
                            (e.key === 'ArrowUp'
                              ? -1
                              : e.key === 'ArrowDown'
                                ? 1
                                : 0),
                        ),
                      );
                  if (rect.y + height <= image.height)
                    onChange({ ...rect, width, height });
                }
              }}
            >
              <span aria-hidden="true">↘</span>
            </button>
          </div>
        </div>
      </div>
      <p>
        Drag the box to move, or its corner to resize. Exact pixel controls are
        below.
      </p>
      <button
        className="text-button"
        onClick={() =>
          onChange(centeredCrop(image, ratio || image.width / image.height))
        }
      >
        Center crop selection
      </button>
    </div>
  );
}
