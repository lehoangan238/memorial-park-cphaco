// Script to generate PWA icons
// Run: node scripts/generate-pwa-icons.js

const fs = require('fs');
const path = require('path');

// Simple SVG for PWA icon - Memorial Park theme
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="64" fill="#10B981"/>
  <circle cx="256" cy="256" r="160" fill="#fff" fill-opacity="0.15"/>
  <circle cx="256" cy="256" r="120" fill="#fff" fill-opacity="0.1"/>
  <path d="M256 120c-75 0-136 61-136 136s61 136 136 136 136-61 136-136-61-136-136-136zm0 240c-57.4 0-104-46.6-104-104s46.6-104 104-104 104 46.6 104 104-46.6 104-104 104z" fill="#fff"/>
  <circle cx="256" cy="256" r="48" fill="#fff"/>
  <path d="M256 160v48M256 304v48M160 256h48M304 256h48" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
  <path d="M192 192l24 24M296 296l24 24M192 320l24-24M296 216l24-24" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
  <text x="256" y="420" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="48" font-weight="bold">HV</text>
</svg>`;

// Write SVG file
const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'pwa-icon.svg'), svgContent);

console.log('SVG icon created at public/pwa-icon.svg');
console.log('');
console.log('To generate PNG files, you can use one of these methods:');
console.log('');
console.log('1. Online converter: https://cloudconvert.com/svg-to-png');
console.log('2. Using sharp (npm install sharp):');
console.log('   const sharp = require("sharp");');
console.log('   sharp("public/pwa-icon.svg").resize(192).png().toFile("public/pwa-192x192.png");');
console.log('   sharp("public/pwa-icon.svg").resize(512).png().toFile("public/pwa-512x512.png");');
console.log('');
console.log('3. Using Inkscape CLI:');
console.log('   inkscape public/pwa-icon.svg -w 192 -h 192 -o public/pwa-192x192.png');
console.log('   inkscape public/pwa-icon.svg -w 512 -h 512 -o public/pwa-512x512.png');
