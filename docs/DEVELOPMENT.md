# Development Guide

Comprehensive development commands and workflows for the Zambia project.

## Running the Application

```bash
# Start development server with hot reloading
npm run serve
# or directly
npm run dev

# Build development version
npm run build

# Build production version
npm run build:prod

# Start Storybook for component development
npm start
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

**Note**: There's no global lint command currently. You must run lint per library using the Nx command structure.

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

# Example: Run serve for a specific library
npx nx run feat-countries:serve
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

## Working with Docker

The project includes Docker configurations for both development and production:

- `docker-compose.dev.yaml`: Development with hot reloading
- `docker-compose.yaml`: Production setup with Nginx

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

# Use Commitizen for standardized commits
npm run cm
```

## Debugging Tips

When debugging or working with the codebase:

1. **Check available commands**: Use `npm run` to list all available scripts
2. **Project-specific commands**: Use `npx nx run [project]:[target]` for project-specific operations
3. **Lint specific libraries**: Always lint per library, not globally
4. **Type checking**: Use TypeScript compiler directly for type validation
5. **Build to verify**: Run build commands to catch compilation errors

## Common Issues and Solutions

### ESLint Configuration Issues

If you encounter errors like "ESLint was configured to run on X file but none of the TSConfigs include this file":

1. **Environment files not included**: Add environment files to `tsconfig.app.json`:

   ```json
   {
     "include": ["src/**/*.d.ts", "src/environments/*.ts", "set-env.ts"]
   }
   ```

2. **Missing file patterns**: Ensure all TypeScript files in your project are included in at least one tsconfig file

### Pre-commit Hook Issues

If Prettier runs after commit instead of before:

1. **Check the script syntax**: Ensure `--staged` flag is correct in package.json:

   ```json
   {
     "prettier:staged": "npx pretty-quick --staged"
   }
   ```

2. **Verify hook permissions**: Make sure the hook is executable:
   ```bash
   chmod +x .husky/pre-commit
   ```

### Manual Pre-commit Testing

To manually run the pre-commit hook before committing (useful for testing):

```bash
# Run the pre-commit hook manually
./.husky/pre-commit

# Or run the prettier formatting directly on staged files
npm run prettier:staged

# Or format and lint affected files
npm run prettier:staged && npm run lint:affected
```

### Skip Hooks Temporarily

If you need to skip hooks temporarily (not recommended for regular use):

```bash
git commit --no-verify -m "your message"
```
