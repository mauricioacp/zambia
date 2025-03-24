const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const envFileContent = `
export const environment = {
  production: false,
  API_URL: '${process.env['API_URL'] || 'not loaded'}',
};
`;
console.log(process.env['API_URL']);

const environmentsDir = path.resolve(__dirname, 'src/environments');
if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

const targetPath = path.resolve(environmentsDir, 'environment.ts');
fs.writeFileSync(targetPath, envFileContent);

console.log(`Environment file generated at ${targetPath}`);
