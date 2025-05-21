const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const environment = process.env['NODE_ENV'] || 'development';
console.log(`Generating environment files for: ${environment}`);

const envFilePaths = [path.resolve(process.cwd(), `.env`), path.resolve(process.cwd(), `.env.${environment}`)];

envFilePaths.forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    console.log(`Loading env file: ${envPath}`);
    const envConfig = dotenv.config({ path: envPath });
    if (envConfig.error) {
      console.error(`Error loading ${envPath}:`, envConfig.error);
    }
  }
});

const createEnvironmentContent = (isProd: boolean) => `export const environment = {
  production: ${isProd},
  API_URL: '${process.env['API_URL'] || 'http://localhost:54321'}',
  API_PUBLIC_KEY: '${process.env['API_PUBLIC_KEY'] || ''}',
  PROD: '${process.env['PROD'] || ''}',
};
`;

const environmentsDir = path.resolve(__dirname, 'src/environments');
if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, { recursive: true });
}

const defaultEnvPath = path.resolve(environmentsDir, 'environment.ts');
fs.writeFileSync(defaultEnvPath, createEnvironmentContent(false));
console.log(`Default environment file generated at ${defaultEnvPath}`);

const devEnvPath = path.resolve(environmentsDir, 'environment.development.ts');
fs.writeFileSync(devEnvPath, createEnvironmentContent(false));
console.log(`Development environment file generated at ${devEnvPath}`);

const prodEnvPath = path.resolve(environmentsDir, 'environment.production.ts');
fs.writeFileSync(prodEnvPath, createEnvironmentContent(true));
console.log(`Production environment file generated at ${prodEnvPath}`);
