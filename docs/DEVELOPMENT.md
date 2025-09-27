# Development Guide

Comprehensive development commands and workflows for the Zambia project.

## Running the Application

```bash
npx nx build zambia
# or directly
npm run dev

# Build development version
npm run build

# Build production version
npm run build:prod

```

## Code Quality and Linting

The project uses ESLint for code quality. To run linting on specific libraries:

```bash
# Lint a specific library (replace 'feat-countries' with your library name)
npx nx run feat-countries:lint

# Lint with quiet mode (only show errors, not warnings)
npx nx run feat-countries:lint --quiet

# Run TypeScript type checking on a specific library
npx tsc --noEmit -p libs/zambia/feat-countries/tsconfig.lib.json

# Format code with Prettier (for staged files)
npm run prettier:staged
```

## Testing

```bash
# Run unit tests for the main app
npm test

# Run unit tests for a specific library
npx nx test feat-countries

# Run e2e tests
npm run e2e

# Run tests in watch mode
npx nx test feat-countries --watch
```

## Nx Commands

```bash
# View project dependency graph
npm run graph

# List all available projects
npx nx show projects

# Run any target for a specific project
npx nx run [project]:[target]

# Example: build for a specific library
npx nx run feat-countries:build
```

## Git Workflow

```bash
# Use Commitizen for standardized commit messages
npm run cm

# This will guide you through creating a properly formatted commit message
```

## Database and Types

```bash
# Generate TypeScript types from Supabase database
npm run supabase:gen:types:local
```

## Additional Development Commands

The following commands are available for broader operations:

```bash
# Lint all projects
npm run lint:all

# Lint only affected projects (based on git changes)
npm run lint:affected

# Run all tests
npm run test:all

# Test only affected projects
npm run test:affected

# Run TypeScript type checking on entire codebase
npm run typecheck

# Format all files with Prettier
npm run format

# Check formatting without making changes
npm run format:check

# Reset Nx cache
npm run reset
```

```bash
# Run development environment in Docker
npm run docker:dev

# Build and run development environment
npm run docker:dev:build

# Run production environment
npm run docker:prod

# Build and run production environment
npm run docker:prod:build
```

## Code Generation

```bash
# Generate a new feature library
npx nx g @nx/angular:library --name=feat-example --tags=scope:zambia,type:feat --directory=libs/zambia/feat-example

# Generate a smart component
nx g @nx/angular:component --path=libs/zambia/feat-example/src/lib/components/smart/example --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=example --type=smart-component

# Generate a UI component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/example --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=example --type=ui-component
```

## Other Utilities

```bash
# Generate Supabase types
npm run supabase:gen:types:local

# View dependency graph
npm run graph
```

## Debugging Tips

When debugging or working with the codebase:

1. **Check available commands**: Use `npm run` to list all available scripts
2. **Project-specific commands**: Use `npx nx run [project]:[target]` for project-specific operations
3. **Lint specific libraries**: Always lint per library, not globally
4. **Type checking**: Use TypeScript compiler directly for type validation
5. **Build to verify**: Run build commands to catch compilation errors
