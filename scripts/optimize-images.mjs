import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('public/assets/aistudio');
const OUT_DIR = path.resolve('public/assets/photos');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.jpg') && !f.startsWith('Screenshot_'));

console.log(`Found ${files.length} photos to optimize:`);

const results = [];

for (const file of files) {
  const inputPath = path.join(SRC_DIR, file);
  const baseName = path.parse(file).name;
  const outWebp = path.join(OUT_DIR, `${baseName}.webp`);
  const outJpg = path.join(OUT_DIR, `${baseName}.jpg`);

  const initialStat = fs.statSync(inputPath);
  const initialSizeKB = (initialStat.size / 1024).toFixed(1);

  // The two Snapchat photos need 270-degree rotation to be upright
  const isSnapchat = file.startsWith('Snapchat-');
  const rotateArg = isSnapchat ? '-rotate 270' : '-auto-orient';

  // 1. Convert to high-quality compressed WebP (max 1200px width/height, quality 82)
  const cmdWebp = `convert "${inputPath}" ${rotateArg} -resize "1200x1200>" -quality 82 -define webp:method=6 "${outWebp}"`;
  execSync(cmdWebp);

  // 2. Also create optimized fallback JPG (max 1200px, quality 80)
  const cmdJpg = `convert "${inputPath}" ${rotateArg} -resize "1200x1200>" -quality 80 -strip "${outJpg}"`;
  execSync(cmdJpg);

  const webpStat = fs.statSync(outWebp);
  const webpSizeKB = (webpStat.size / 1024).toFixed(1);

  const jpgStat = fs.statSync(outJpg);
  const jpgSizeKB = (jpgStat.size / 1024).toFixed(1);

  // 3. Generate micro placeholder (32px wide) for instant blurred preview
  const thumbBase64 = execSync(`convert "${inputPath}" ${rotateArg} -resize "32x32" -quality 50 -strip webp:- | base64 -w 0`).toString().trim();
  const placeholderUrl = `data:image/webp;base64,${thumbBase64}`;

  results.push({
    file,
    baseName,
    initialSizeKB,
    webpSizeKB,
    jpgSizeKB,
    placeholderUrl,
    isSnapchat
  });

  console.log(`✓ ${file}: ${initialSizeKB} KB -> WebP: ${webpSizeKB} KB, JPG: ${jpgSizeKB} KB`);
}

// Write a manifest with metadata and placeholder data URLs
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(results, null, 2));
console.log('\nOptimization complete! Summary saved to manifest.json');
