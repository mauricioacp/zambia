# Zambia Project

Angular application built with NX workspace for managing Akademia's educational organization data across multiple countries.

## Tech Stack

This project leverages the following technologies:

- **Core Framework**: [Angular](https://angular.io/) (v19)
- **Monorepo Management**: [Nx](https://nx.dev/) (v20)
- **Backend/Database**: [Supabase](https://supabase.io/)
- **UI Components**: [Taiga UI](https://taiga-ui.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Development**: [Storybook](https://storybook.js.org/)
- **Internationalization**: [ngx-translate](https://github.com/ngx-translate/core)
- **Testing**:
  - [Jest](https://jestjs.io/) (Unit tests)
  - [Playwright](https://playwright.dev/) (E2E tests)
- **Code Quality**:
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
  - [Husky](https://typicode.github.io/husky/) (Git hooks)
  - [Commitizen](https://github.com/commitizen/cz-cli) (Standardized commits)

## Monorepo Structure

The project follows Nx's monorepo architecture with the following structure:

```
zambia/
├── apps/
│   ├── zambia/                # Main Angular application
│   └── zambia-e2e/            # End-to-end tests for the application
├── libs/
│   ├── shared/                # Shared libraries used across applications
│   │   ├── data-access-auth/  # Authentication services
│   │   ├── data-access-roles-permissions/ # Role and permission management
│   │   ├── data-access-supabase/ # Supabase database access
│   │   ├── types-supabase/    # TypeScript types for Supabase data
│   │   ├── ui-components/     # Shared UI components
│   │   ├── util-config/       # Configuration utilities
│   │   └── util-guards/       # Route guards for auth/authorization
│   └── zambia/                # Application-specific libraries
│       ├── feat-auth/         # Authentication feature
│       ├── feat-dashboard/    # Dashboard feature
│       ├── feat-agreements/   # Dashboard page for agreements review and approval
│       ├── feat-headquarter/  # Headquarter management feature
│       └── feat-shell/        # Application shell/layout
```

## Environment Setup

This project supports different environment configurations for development and production.

### Environment Files

> **IMPORTANT**: The environment file structure has been updated to use root-level .env files instead of app-level files.

- `.env`: Base environment variables shared across all environments
- `.env.development`: Development-specific environment variables (local development)
- `.env.production`: Production-specific environment variables (deployment)

Example environment variables:

```
API_URL=https://api.yourdomain.com
API_PUBLIC_KEY=your-api-key
PROD=true/false
```

Environment template files are provided (`.env.development.example` and `.env.production.example`). Copy these to create your own environment files:

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
```

If you previously had .env files in the apps/zambia directory, please move their contents to the corresponding root-level files.

## Local Development

### Option 1: Standard Development

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Generate environment files:

   ```bash
   npm run config:dev
   ```

3. Start the development server:
   ```bash
   npm run serve
   ```

The application will be available at http://localhost:4200.

### Option 2: Docker Development (with Hot Reloading)

For development with Docker (includes hot reloading):

```bash
npm run docker:dev
```

Or to rebuild the container:

```bash
npm run docker:dev:build
```

The application will be available at http://localhost:4200.

## Production Build

### Local Production Build

To build the application for production locally:

```bash
npm run build:prod
```

The build output will be in `dist/apps/zambia/browser/`.

### Docker Production Build

Build and run the production Docker image:

```bash
npm run docker:prod:build
```

This will build the application with production configuration and serve it using Nginx on port 80.

## Deployment to Coolify

To deploy to Coolify:

1. Push your code to a Git repository
2. In Coolify, connect to your repository
3. Configure the environment variables in Coolify:
   - `API_URL`
   - `API_PUBLIC_KEY`
   - `PROD=true`
4. Set the build command to use the Docker Compose file:
   ```
   docker-compose up -d --build
   ```

## Environment Variables Management

Environment variables can be managed in three ways:

1. **Build-time variables**: Defined in `.env` files or passed as build arguments
2. **Runtime variables**: Passed to containers as environment variables
3. **Coolify variables**: Set in the Coolify dashboard

The application has a runtime environment variable substitution mechanism for changing environment settings without rebuilding the application.

## Working with the Codebase

### Dependency Graph

To visualize the project's dependency graph:

```bash
npm run graph
```

This will open the Nx dependency graph in your browser, showing the relationships between the different libraries and applications.

### Running Tests

To run unit tests for the main application:

```bash
npm test
```

To run end-to-end tests:

```bash
npm run e2e
```

### Linting and Formatting

To format staged files:

```bash
npm run prettier:staged
```

## Project Structure and Configuration Files

- `apps/zambia`: Main Angular application
- `libs/`: Shared libraries and feature modules
- `docker-compose.yaml`: Production Docker Compose configuration
- `docker-compose.dev.yaml`: Development Docker Compose with hot reloading
- `dockerfile`: Production Dockerfile
- `nginx.conf`: Nginx configuration for hosting the built application
- `.env.*`: Environment configuration files
