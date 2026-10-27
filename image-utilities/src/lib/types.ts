export type Format = 'image/jpeg' | 'image/png' | 'image/webp';
export type Dimensions = { width: number; height: number };
export type Rect = { x: number; y: number; width: number; height: number };
export type ImageInfo = Dimensions & {
  format: Format;
  size: number;
  animated: boolean;
  alpha?: boolean;
  bitDepth?: number;
  metadata?: Record<string, string | number | boolean | null>;
};
export type ImageSettings = {
  action:
    'resize' | 'compress' | 'convert' | 'crop' | 'ratio' | 'metadata' | 'strip';
  format: Format;
  quality: number;
  width: number;
  height: number;
  background: string;
  transparent: boolean;
  fit: 'crop' | 'fit' | 'stretch';
  rotation: number;
  crop: Rect;
  targetBytes: number;
  mode: 'quality' | 'balanced' | 'smallest';
  allowReduction: boolean;
};
export type ProcessResult = {
  blob?: Blob;
  info: ImageInfo;
  width: number;
  height: number;
  attempts: number;
  targetAchieved?: boolean;
  warnings: string[];
};
export const limits = {
  file: 20_000_000,
  batchBytes: 60_000_000,
  batch: 10,
  pixels: 16_000_000,
  side: 8192,
  fallbackPixels: 4_000_000,
  timeout: 45_000,
} as const;
export const defaults: ImageSettings = {
  action: 'resize',
  format: 'image/jpeg',
  quality: 0.85,
  width: 1200,
  height: 800,
  background: '#ffffff',
  transparent: false,
  fit: 'crop',
  rotation: 0,
  crop: { x: 0, y: 0, width: 100, height: 100 },
  targetBytes: 100_000,
  mode: 'balanced',
  allowReduction: false,
};
