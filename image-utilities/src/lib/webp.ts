import encode, { init } from '@jsquash/webp/encode.js';
import scalarWasm from '@jsquash/webp/codec/enc/webp_enc.wasm?url';
import simdWasm from '@jsquash/webp/codec/enc/webp_enc_simd.wasm?url';
let ready: Promise<unknown> | undefined;
export async function encodeWebP(
  pixels: ImageData,
  quality: number,
): Promise<Blob> {
  if (typeof WebAssembly === 'undefined')
    throw new Error(
      'This browser has neither native WebP encoding nor WebAssembly support. Choose PNG or JPEG.',
    );
  ready ??= init({
    locateFile: (path: string) =>
      path.includes('simd') ? simdWasm : scalarWasm,
  });
  await ready;
  const buffer = await encode(pixels, {
    quality: Math.round(quality * 100),
    lossless: 0,
    method: 4,
  });
  return new Blob([buffer], { type: 'image/webp' });
}
