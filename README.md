# Zambia Project

Multi-tenant educational management platform built with Angular 19 and Nx for Akademia's international organization. Features role-based access control (RBAC), real-time data synchronization, and comprehensive administrative tools for managing educational programs across multiple countries and headquarters.

## 🚀 Tech Stack

This project leverages modern web technologies:

- **Core Framework**: [Angular](https://angular.io/) (v19) with standalone components & signals
- **Monorepo Management**: [Nx](https://nx.dev/) (v20) for scalable architecture
- **Backend/Database**: [Supabase](https://supabase.io/) (PostgreSQL + Auth + Realtime)
- **UI Components**: [Taiga UI](https://taiga-ui.dev/) + Custom design system
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 with dark mode support
- **Component Development**: [Storybook](https://storybook.js.org/)
- **Internationalization**: [ngx-translate](https://github.com/ngx-translate/core) (EN/ES)
- **Testing**:
  - [Jest](https://jestjs.io/) (Unit tests)
  - [Playwright](https://playwright.dev/) (E2E tests)
- **Code Quality**:
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
  - [Husky](https://typicode.github.io/husky/) (Git hooks)
  - [Commitizen](https://github.com/commitizen/cz-cli) (Semantic commits)

## 📁 Monorepo Structure

The project follows Nx's domain-driven monorepo architecture:

```
zambia/
├── apps/
│   ├── zambia/                # Main Angular application
│   └── zambia-e2e/            # End-to-end tests
├── libs/
│   ├── shared/                # Cross-application libraries
│   │   ├── data-access-auth/  # Authentication services & guards
│   │   ├── data-access-dashboard/ # Dashboard data management
│   │   ├── data-access-generic/ # Edge functions & utilities
│   │   ├── data-access-roles-permissions/ # RBAC implementation
│   │   ├── data-access-supabase/ # Database connection
│   │   ├── types-supabase/    # TypeScript types from DB
│   │   ├── ui-components/     # Reusable UI component library
│   │   ├── util-config/       # App configuration
│   │   ├── util-constants/    # Shared constants
│   │   ├── util-guards/       # Route guards
│   │   └── util-roles-definitions/ # Role definitions
│   └── zambia/                # Feature modules
│       ├── feat-agreements/   # Agreement management
│       ├── feat-auth/         # Login/authentication
│       ├── feat-countries/    # Country management
│       ├── feat-dashboard/    # Main dashboard panel
│       ├── feat-headquarter/  # HQ management
│       ├── feat-homepage/     # Role-based homepage
│       ├── feat-profile/      # User profile
│       ├── feat-shell/        # App shell/layout
│       ├── feat-students/     # Student analytics
│       └── feat-workshops/    # Workshop management
├── docs/                      # Project documentation
├── database/                  # SQL functions & migrations
└── public/                    # Static assets
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

## 🏗️ Key Features

### Role-Based Access Control (RBAC)

- **Multi-level hierarchy**: 50+ role levels with granular permissions
- **Dynamic navigation**: Menu items adapt based on user role
- **Secure routes**: Guard-protected pages with role verification
- **Data filtering**: Role-based data visibility at API level

### Core Modules

- **Authentication**: Supabase Auth with JWT tokens
- **Dashboard**: Role-specific KPIs and analytics
- **Agreement Management**: Workflow for agreement approval
- **Workshop Tracking**: Schedule and monitor educational workshops
- **Student Analytics**: Progress tracking and demographics
- **Multi-tenancy**: Country and HQ-level data isolation

### UI/UX Design

- **Glass morphism**: Modern glassmorphic design patterns
- **Dark mode**: Full dark/light theme support
- **Responsive**: Mobile-first responsive design
- **i18n**: English/Spanish translations
- **Accessible**: WCAG compliance focus

## 📘 Development Guidelines

### Angular 19 Best Practices

```typescript
// ✅ Use standalone components
@Component({
  selector: 'z-example',
  standalone: true,
  imports: [CommonModule],
  template: `...`
})

// ✅ Use signals for state
isLoading = signal(false);
data = computed(() => this.items().filter(item => item.active));

// ✅ Use new control flow
@if (condition) { }
@for (item of items; track item.id) { }

// ✅ Use inject() for DI
private service = inject(MyService);
```

### Naming Conventions

- **Smart Components**: `*.smart-component.ts` (containers)
- **UI Components**: `*.ui-component.ts` (presentational)
- **Services**: `*-facade.service.ts` (feature facades)
- **Files**: kebab-case throughout

### Git Workflow

```bash
# Use semantic commits
npm run cm

# Automatic formatting on commit
git add .
git commit # Husky will run linting/formatting
```

## 🛠️ Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run test                   # Run unit tests
npm run e2e                    # Run E2E tests
npm run lint:all               # Lint entire workspace
npm run graph                  # View dependency graph

# Code Generation
npx nx g @nx/angular:library --name=feat-[name] --directory=libs/zambia
npx nx g @nx/angular:component --name=[name] --type=smart-component

# Docker Operations
npm run docker:dev             # Dev with hot reload
npm run docker:prod:build      # Production build
```

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - AI assistant instructions
- [Development Guide](./docs/DEVELOPMENT.md) - Detailed dev setup
- [Angular Guidelines](./docs/ANGULAR_GUIDELINES.md) - Angular best practices
- [Database Schema](./docs/DATABASE.md) - Supabase structure
- [Dashboard Analysis](./DASHBOARD_HOMEPAGE_ANALYSIS.md) - Feature analysis

## 🚢 Deployment

The application is designed for deployment on various platforms:

- **Coolify**: Self-hosted PaaS deployment
- **Vercel**: Edge deployment with SSR support
- **Docker**: Containerized deployment anywhere
- **Traditional**: Nginx static hosting

See [deployment documentation](./docs/DEVELOPMENT.md#deployment) for detailed instructions.

## 🤝 Contributing

1. Follow the semantic commit convention
2. Ensure all tests pass
3. Update documentation as needed
4. Submit PR with clear description
