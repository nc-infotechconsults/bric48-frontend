// scripts/update-version.js
const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const version = packageJson.version;

const content = `export const version = '${version}';\n`;

fs.writeFileSync(
    path.join(__dirname, '../src/environments/version.ts'),
    content,
    'utf8'
);
console.log(`Updated version.ts to version ${version}`);
