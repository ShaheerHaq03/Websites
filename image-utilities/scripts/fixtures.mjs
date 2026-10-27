import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
await mkdir('e2e/fixtures', { recursive: true });
await sharp(await readFile('public/images/landscape.svg'))
  .png()
  .toFile('public/images/sample-landscape.png');
await sharp(await readFile('public/images/landscape.svg'))
  .resize(1200, 800)
  .webp({ quality: 85 })
  .toFile('public/images/landscape.webp');
const grid = Buffer.alloc(120 * 80 * 3);
const colors = [
  [240, 30, 40],
  [30, 180, 70],
  [25, 80, 220],
  [245, 190, 30],
];
for (let y = 0; y < 80; y++)
  for (let x = 0; x < 120; x++) {
    const c = colors[(y >= 40 ? 2 : 0) + (x >= 60 ? 1 : 0)];
    for (let k = 0; k < 3; k++) grid[(y * 120 + x) * 3 + k] = c[k];
  }
await sharp(grid, { raw: { width: 120, height: 80, channels: 3 } })
  .png()
  .toFile('e2e/fixtures/grid.png');
await sharp(grid, { raw: { width: 120, height: 80, channels: 3 } })
  .jpeg({ quality: 95 })
  .withExif({
    IFD0: { Make: 'PixelTools', Model: 'Fixture Camera' },
    IFD2: { DateTimeOriginal: '2024:01:02 03:04:05' },
  })
  .toFile('e2e/fixtures/camera.jpg');
await sharp(grid, { raw: { width: 120, height: 80, channels: 3 } })
  .jpeg({ quality: 90 })
  .withMetadata({ orientation: 6 })
  .toFile('e2e/fixtures/orientation.jpg');
const alpha = Buffer.alloc(80 * 60 * 4);
for (let y = 15; y < 45; y++)
  for (let x = 20; x < 60; x++) {
    const i = (y * 80 + x) * 4;
    alpha[i] = 255;
    alpha[i + 3] = 255;
  }
await sharp(alpha, { raw: { width: 80, height: 60, channels: 4 } })
  .png()
  .toFile('e2e/fixtures/alpha.png');
await sharp(alpha, { raw: { width: 80, height: 60, channels: 4 } })
  .webp({ lossless: true })
  .toFile('e2e/fixtures/alpha.webp');
const noise = Buffer.alloc(640 * 480 * 3);
let seed = 1234567;
for (let i = 0; i < noise.length; i++) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  noise[i] = seed >>> 24;
}
await sharp(noise, { raw: { width: 640, height: 480, channels: 3 } })
  .png()
  .toFile('e2e/fixtures/noise.png');
await writeFile('e2e/fixtures/invalid.png', 'This is text, not a PNG.');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f4f8ff"/><rect x="75" y="65" width="50" height="50" rx="12" fill="#2563eb"/><text x="145" y="103" font-family="Arial" font-size="35" font-weight="700" fill="#0f172a">PixelTools</text><text x="75" y="270" font-family="Arial" font-size="74" font-weight="700" fill="#0f172a">Every image.</text><text x="75" y="365" font-family="Arial" font-size="74" font-weight="700" fill="#2563eb">Just the right size.</text><text x="75" y="470" font-family="Arial" font-size="29" fill="#475569">Resize, compress, crop and convert. Free and private.</text></svg>`;
await sharp(Buffer.from(social))
  .png()
  .toFile('public/images/social-preview.png');
console.log(
  'Generated original sample artwork, deterministic image fixtures, and social image.',
);
// Synthetic GPS EXIF fixture. Coordinates are demonstration data, not user data.
const jpeg = await sharp(grid, { raw: { width: 120, height: 80, channels: 3 } })
  .jpeg({ quality: 90 })
  .toBuffer();
const tiff = Buffer.alloc(164);
tiff.write('II', 0);
tiff.writeUInt16LE(42, 2);
tiff.writeUInt32LE(8, 4);
tiff.writeUInt16LE(3, 8);
function tag(offset, id, type, count, value) {
  tiff.writeUInt16LE(id, offset);
  tiff.writeUInt16LE(type, offset + 2);
  tiff.writeUInt32LE(count, offset + 4);
  tiff.writeUInt32LE(value, offset + 8);
}
tag(10, 0x010f, 2, 11, 50);
tag(22, 0x0112, 3, 1, 1);
tag(34, 0x8825, 4, 1, 62);
tiff.write('PixelTools\0', 50);
tiff.writeUInt16LE(4, 62);
tag(64, 1, 2, 2, 78);
tag(76, 2, 5, 3, 116);
tag(88, 3, 2, 2, 87);
tag(100, 4, 5, 3, 140);
for (const [offset, values] of [
  [116, [51, 1, 30, 1, 0, 1]],
  [140, [0, 1, 7, 1, 0, 1]],
])
  values.forEach((value, index) =>
    tiff.writeUInt32LE(value, offset + index * 4),
  );
const payload = Buffer.concat([Buffer.from('Exif\0\0'), tiff]);
const app1 = Buffer.alloc(4);
app1[0] = 255;
app1[1] = 225;
app1.writeUInt16BE(payload.length + 2, 2);
await writeFile(
  'e2e/fixtures/gps.jpg',
  Buffer.concat([jpeg.subarray(0, 2), app1, payload, jpeg.subarray(2)]),
);
