import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const publicDir = path.resolve('public');
  const sourceLogo = path.join(publicDir, 'Logo200.png');

  console.log('Generating PWA icons from', sourceLogo);

  // 1. 192x192 standard icon
  await sharp(sourceLogo)
    .resize(192, 192, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 2. 512x512 standard icon
  await sharp(sourceLogo)
    .resize(512, 512, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 3. 512x512 maskable icon (safe zone: 80% size, 10% padding on each side)
  const innerSize = Math.round(512 * 0.76); // ~389px
  const innerLogo = await sharp(sourceLogo)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 253, g: 251, b: 247, alpha: 1 } // Elegant warm brand background
    }
  })
    .composite([{ input: innerLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 4. apple-touch-icon (180x180)
  await sharp(sourceLogo)
    .resize(180, 180, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 5. SVG icon for desktop browser tabs
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dfba8a"/>
      <stop offset="50%" stop-color="#c59b6d"/>
      <stop offset="100%" stop-color="#9a7146"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#1c1917"/>
  <circle cx="50" cy="50" r="40" stroke="url(#goldGrad)" stroke-width="2" fill="none" opacity="0.4"/>
  <text x="50" y="58" font-family="'Cinzel', 'Playfair Display', serif, sans-serif" font-size="34" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle">GA</text>
  <circle cx="50" cy="22" r="3" fill="#dfba8a"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
