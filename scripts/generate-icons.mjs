import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'branding', 'logo-mark.svg');
const iconsDir = join(root, 'build', 'icons');
const icoPath = join(root, 'build', 'icon.ico');

const sizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

async function main() {
  if (!existsSync(svgPath)) {
    throw new Error(`Missing source SVG at ${svgPath}`);
  }
  await mkdir(iconsDir, { recursive: true });
  const svgBuffer = await readFile(svgPath);

  const pngPaths = [];
  for (const size of sizes) {
    const outPath = join(iconsDir, `${size}x${size}.png`);
    await sharp(svgBuffer, { density: 384 }).resize(size, size).png().toFile(outPath);
    pngPaths.push(outPath);
    console.log(`generated ${outPath}`);
  }

  const icoSizes = [16, 24, 32, 48, 256];
  const icoBuffer = await pngToIco(
    icoSizes.map((size) => join(iconsDir, `${size}x${size}.png`)),
  );
  await writeFile(icoPath, icoBuffer);
  console.log(`generated ${icoPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
