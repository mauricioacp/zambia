# Zambia - Akademia Data Management System

A comprehensive Angular application built with Nx monorepo architecture for managing Akademia's educational organization data across multiple countries.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Server](#development-server)
- [Running Tests](#running-tests)
- [Linting and Formatting](#linting-and-formatting)
- [Building for Production](#building-for-production)
- [Understanding the Monorepo with Nx](#understanding-the-monorepo-with-nx)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Zambia is a data management system designed for Akademia, an international educational organization. The system manages organizational structure across multiple countries, including headquarters, seasons (academic periods), participants (students and collaborators), and activities (workshops and events).

The application provides a comprehensive interface for:

- Managing organizational hierarchy (countries, headquarters, seasons)
- Handling participant registration and management
- Scheduling and tracking educational activities
- Managing roles and permissions

## Tech Stack

This project leverages the following technologies:

- **Core Framework**: [Angular](https://angular.io/) (v19)
- **Monorepo Management**: [Nx](https://nx.dev/) (v20)
- **Backend/Database**: [Supabase](https://supabase.io/)
- **State Management**: [RxJS](https://rxjs.dev/)
- **UI Components**:
  - [Angular Material](https://material.angular.io/)
  - Custom UI components
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
│       ├── feat-headquarter/  # Headquarter management feature
│       └── feat-shell/        # Application shell/layout
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (v8 or later)
- [Git](https://git-scm.com/)

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-organization/zambia.git
   cd zambia
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   npm run config
   ```
   This will generate the necessary environment configuration files.

## Development Server

To start the development server:

```bash
npm run serve
```

This will:

1. Generate the environment configuration
2. Start the Angular development server

The application will be available at `http://localhost:4200/`.

Alternatively, you can use:

```bash
npm run dev
```

This runs the application without regenerating the environment configuration.

## Running Tests

### Unit Tests

To run unit tests for the main application:

```bash
npm test
```

To run tests for a specific library:

```bash
npx nx test shared-ui-components
```

### End-to-End Tests

To run end-to-end tests:

```bash
npm run e2e
```

## Linting and Formatting

### Linting

To lint the entire codebase:

```bash
npx nx run-many --target=lint --all
```

To lint a specific project:

```bash
npx nx lint zambia
```

### Formatting

To format staged files:

```bash
npm run prettier:staged
```

## Building for Production

To build the application for production:

```bash
npx nx build zambia --configuration=production
```

The build artifacts will be stored in the `dist/apps/zambia` directory.

## Understanding the Monorepo with Nx

### Dependency Graph

To visualize the project's dependency graph:

```bash
npm run graph
```

This will open the Nx dependency graph in your browser, showing the relationships between the different libraries and applications.

### Generating New Code

Nx provides generators to create new components, libraries, and more:

#### Generate a new library:

```bash
npx nx g @nx/angular:lib my-new-lib
```

#### Generate a component in a library:

```bash
npx nx g @nx/angular:component my-component --project=shared-ui-components
```

#### Generate a service:

```bash
npx nx g @nx/angular:service my-service --project=shared-data-access-auth
```

### Running Affected Commands

Nx allows you to run commands only on projects affected by changes:

```bash
npx nx affected:build
npx nx affected:test
npx nx affected:lint
```

## Deployment

The application can be deployed to various hosting platforms. For production deployment:

1. Build the application:

   ```bash
   npx nx build zambia --configuration=production
   ```

2. Deploy the contents of `dist/apps/zambia` to your hosting provider.

## Contributing

We welcome contributions to the Zambia project. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes using Commitizen:
   ```bash
   npm run cm
   ```
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
