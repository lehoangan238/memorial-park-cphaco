import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="64" fill="#10B981"/>
  <circle cx="256" cy="256" r="160" fill="#fff" fill-opacity="0.15"/>
  <circle cx="256" cy="256" r="120" fill="#fff" fill-opacity="0.1"/>
  <path d="M256 120c-75 0-136 61-136 136s61 136 136 136 136-61 136-136-61-136-136-136zm0 240c-57.4 0-104-46.6-104-104s46.6-104 104-104 104 46.6 104 104-46.6 104-104 104z" fill="#fff"/>
  <circle cx="256" cy="256" r="48" fill="#fff"/>
  <path d="M256 160v48M256 304v48M160 256h48M304 256h48" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
  <text x="256" y="380" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="64" font-weight="bold">HV</text>
</svg>`;

const publicDir = join(__dirname, '..', 'public');

async function generateIcons() {
  const svgBuffer = Buffer.from(svgContent);
  
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'pwa-192x192.png'));
  
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'pwa-512x512.png'));
  
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  
  console.log('✅ PWA icons generated successfully!');
  console.log('   - pwa-192x192.png');
  console.log('   - pwa-512x512.png');
  console.log('   - apple-touch-icon.png');
}

generateIcons().catch(console.error);
