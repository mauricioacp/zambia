# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zambia is an Angular application built with NX workspace for managing Akademia's educational organization data across multiple countries. It's designed to manage the organizational structure across different countries, including headquarters, academic seasons, participants, educational activities, and staff members. The system handles role-based access control, agreement management, workshop scheduling, and various administrative functions for the educational organization.

## Technology Stack

- **Core Framework**: Angular (v19)
- **Monorepo Management**: Nx (v20)
- **Backend/Database**: Supabase (PostgreSQL + auth)
- **UI Components**: Taiga UI
- **Styling**: Tailwind CSS
- **Component Development**: Storybook
- **Internationalization**: ngx-translate
- **Testing**: Jest (unit), Playwright (E2E)

## Architecture

### Project Structure and Naming Conventions

The project follows a clear naming convention for libraries:

- **data-access-\*** - Services for data retrieval and manipulation
- **types-\*** - TypeScript type definitions
- **ui-components** - Reusable UI components
- **util-\*** - Utility functions and helpers
- **feat-\*** - Feature modules with smart components

Components follow a type-based naming convention:

- **smart-component** - Container components with business logic
- **ui-component** - Presentational components

### Monorepo Structure

The project follows Nx's monorepo architecture with the following structure:

- **apps/zambia/**: Main Angular application
- **apps/zambia-e2e/**: End-to-end tests
- **libs/shared/**: Shared libraries used across the application
  - **data-access-\***: Data services and API connections
  - **ui-components/**: Reusable UI components
  - **util-\***: Utility functions and helpers
  - **types-\***: TypeScript type definitions
- **libs/zambia/**: Feature-specific libraries
  - **feat-\***: Feature modules (dashboard, auth, shell, countries, etc.)

### Component Organization

- **Smart/Presentational Pattern**: Components are organized into smart (container) and presentational components
- **Facade Pattern**: Services often use facades to simplify access to complex subsystems

## Environment Configuration

The project uses environment files for configuration:

- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

Example environment variables:

```
API_URL=https://api.yourdomain.com
API_PUBLIC_KEY=your-api-key
PROD=true/false
```

## Main Features and UI Structure

### Authentication

- Secure login with email and password via Supabase
- Session management with auth state tracking
- Role-based access to features

### Dashboard

- Overview statistics (countries, headquarters, students, staff)
- Role-specific views with relevant metrics
- Quick access to key features

### Entity Management

- Countries with headquarters
- Headquarters with staff and programs
- Agreements for staff and participants
- Workshops and educational activities

### UI Components

- Consistent card-based interface with Taiga UI integration
- Generic table component for data display
- Sidebar navigation with role-based menu items
- Theme toggle (dark/light mode)
- Responsive design for various screen sizes

## Internationalization

The application supports multiple languages using ngx-translate:

- Translation files in `/public/i18n/` directory
- Currently supports English (en.json) and Spanish (es.json)
- UI elements and messages are internationalized

## Angular Development Guidelines

### Key Principles

- **Use Angular v19 modern patterns**: New control flow syntax (@if, @for, @switch)
- **Standalone components only**: No NgModules
- **Signals for state management**: Prefer signals over observables
- **OnPush change detection**: For all components
- **TaigaUI + Tailwind**: Follow established design system

### Template Syntax

```html
<!-- ✅ Use new control flow -->
@if (condition) {
<div>Content</div>
} @for (item of items; track item.id) {
<div>{{ item.name }}</div>
}

<!-- ❌ Don't use old structural directives -->
<div *ngIf="condition">Content</div>
```

### Component Patterns

```typescript
export class ExampleComponent {
  // Input signals
  data = input.required<Data>();

  // State signals
  isLoading = signal(false);

  // Computed signals
  filteredItems = computed(() => this.items().filter((item) => item.status === 'active'));

  // Output signals
  itemSelected = output<Item>();
}
```

**📖 For detailed Angular guidelines, see: [docs/ANGULAR_GUIDELINES.md](docs/ANGULAR_GUIDELINES.md)**

## Essential Development Commands

### Quick Start

```bash
npx nx build zambia

# Run tests
npm test

# Lint specific library
npx nx run feat-countries:lint

# Format staged files (runs in pre-commit hook)
npm run prettier:staged

# Use standardized commits
npm run cm
```

### Project-Specific Commands

```bash
# Lint all projects
npm run lint:all

# Test affected projects only
npm run test:affected

# Generate Supabase types
npm run supabase:gen:types:local
```

**📖 For comprehensive development commands, see: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**

## Code Generation

```bash
# Generate a new feature library
npx nx g @nx/angular:library --name=feat-example --tags=scope:zambia,type:feat --directory=libs/zambia/feat-example

# Generate a smart component
nx g @nx/angular:component --path=libs/zambia/feat-example/src/lib/components/smart/example --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=example --type=smart-component

# Generate a UI component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/example --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=example --type=ui-component
```

## Common Issues & Quick Fixes

### ESLint Errors

**Issue**: "ESLint was configured to run on X file but none of the TSConfigs include this file"

**Fix**: Add missing files to `tsconfig.app.json`:

```json
{
  "include": ["src/**/*.d.ts", "src/environments/*.ts", "set-env.ts"]
}
```

### Pre-commit Hook Not Running

**Issue**: Prettier runs after commit instead of before

**Fix**: Ensure correct script syntax:

```json
{
  "prettier:staged": "npx pretty-quick --staged"
}
```

### Manual Pre-commit Testing

```bash
# Test pre-commit hook manually
./.husky/pre-commit
```

## Quick Reference

### Nx Commands

- `npx nx run [project]:[target]` - Run specific target for project
- `npm run graph` - View dependency graph
- `npx nx show projects` - List all projects

### Git Workflow

- `npm run cm` - Commitizen for standardized commits
- Pre-commit hooks automatically format and lint

**📖 For detailed troubleshooting, see: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**

## Role-Based Access Control (RBAC)

The application implements a sophisticated role-based access control system with role groups and navigation management.

### Navigation System

Navigation items are managed through a centralized configuration system:

- **Location**: `libs/shared/util-roles-definitions/src/lib/ROLES_CONSTANTS.ts`
- **Navigation Config**: Defines routes, icons, translations, and role permissions
- **Navigation Sections**: Groups navigation items with optional headers

#### Adding New Navigation Items

1. **Add to NAVIGATION_CONFIG**:

```typescript
export const NAVIGATION_CONFIG = {
  newFeature: {
    route: '/dashboard/new-feature',
    icon: 'icon-name', // Use lucide icon names
    translationKey: 'nav.new_feature',
    allowedGroups: ['ADMINISTRATION', 'TOP_MANAGEMENT'] as const, // Optional
  },
  // ... existing items
} as const;
```

2. **Add to NAVIGATION_SECTIONS**:

```typescript
export const NAVIGATION_SECTIONS = [
  {
    items: ['panel'] as const,
  },
  {
    headerKey: 'nav.management' as const,
    items: ['countries', 'headquarters', 'newFeature'] as const, // Add here
  },
] as const;
```

3. **Add translations** to both language files:

```json
// apps/zambia/public/i18n/en.json
{
  "nav.new_feature": "New Feature",
  "nav.management": "Management"
}

// apps/zambia/public/i18n/es.json
{
  "nav.new_feature": "Nueva Funcionalidad",
  "nav.management": "Administración"
}
```

4. **Types are automatically inferred** - No manual type updates needed

#### Role Groups and Access Control

- **Role Groups**: Defined in `ROLE_GROUPS` constant
- **Navigation Access**: Use `allowedGroups` property (omit for all authenticated users)
- **Route Protection**: Use `roleGuard` in route configuration

Example route with role protection:

```typescript
{
  path: 'new-feature',
  loadComponent: () => import('./new-feature.component'),
  canActivate: [roleGuard],
  data: {
    groups: ['ADMINISTRATION', 'TOP_MANAGEMENT'] // Must match navigation config
  }
}
```

### RoleService Methods

- `userRole()` - Current user's role (signal)
- `hasRole(role)` - Check specific role
- `hasAnyRole(roles[])` - Check multiple roles
- `isInGroup(group)` - Check role group membership
- `isInAnyGroup(groups[])` - Check multiple groups
- `getNavigationItems()` - Get filtered navigation (computed signal)
- `getWelcomeText()` - Role-based welcome message

## Database & Backend

The application uses Supabase with a sophisticated role-based access control system. Key entities include countries, headquarters, agreements, collaborators, students, and workshops.

**📖 For complete database schema, see: [docs/DATABASE.md](docs/DATABASE.md)**

## Additional Documentation

- **[docs/ANGULAR_GUIDELINES.md](docs/ANGULAR_GUIDELINES.md)** - Comprehensive Angular development patterns
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Complete development commands and workflows
- **[docs/DATABASE.md](docs/DATABASE.md)** - Database schema and relationships
