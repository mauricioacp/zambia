const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const envFileContent = `export const environment = {
  production: false,
  API_URL: '${process.env['API_URL'] || 'not loaded'}',
  API_PUBLIC_KEY: '${process.env['API_PUBLIC_KEY'] || 'not loaded'}',
  PROD: '${process.env['PROD'] ?? ''}',
};
`;

const environmentsDir = path.resolve(__dirname, 'src/environments');
if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

const targetPath = path.resolve(environmentsDir, 'environment.ts');
fs.writeFileSync(targetPath, envFileContent);

console.log(`Environment file generated at ${targetPath}`);
