# Commands Reference

Quick reference for common Nx/Angular commands in the Zambia project.

## 🚀 Quick Commands

### Development

```bash
npm run dev                    # Start dev server
npm run build                  # Build for development
npm run build:prod             # Build for production
npm start                      # Start Storybook
```

### Code Quality

```bash
npm run lint:all               # Lint all projects
npm run lint:affected          # Lint only affected projects
npm test                       # Run tests
npm run test:affected          # Test only affected projects
npx nx reset                   # Clear Nx cache
```

### Git Workflow

```bash
npm run cm                     # Commitizen (guided commit)
npm run prettier:staged        # Format staged files
```

## 📦 Generate New Code

### Feature Library

```bash
npx nx g @nx/angular:library \
  --name=feat-[name] \
  --tags=scope:zambia,type:feat \
  --directory=libs/zambia/feat-[name]
```

### Smart Component (Container)

```bash
npx nx g @nx/angular:component \
  --path=libs/zambia/feat-[name]/src/lib/components/smart/[name] \
  --name=[name] \
  --type=smart-component \
  --changeDetection=OnPush \
  --inlineStyle=true \
  --inlineTemplate=true \
  --export=true
```

### UI Component (Presentational)

```bash
npx nx g @nx/angular:component \
  --path=libs/shared/ui-components/src/lib/ui-components/[name] \
  --name=[name] \
  --type=ui-component \
  --changeDetection=OnPush \
  --inlineStyle=true \
  --inlineTemplate=true \
  --export=true
```

### Service

```bash
npx nx g @nx/angular:service \
  --name=[name] \
  --project=[project-name] \
  --path=libs/[path]/src/lib \
  --skipTests
```

### Directive

```bash
npx nx g @nx/angular:directive \
  --name=[name] \
  --project=[project-name] \
  --path=libs/[path]/src/lib \
  --export=true
```

## 🔧 Project-Specific Commands

### Lint Specific Project

```bash
npx nx run [project]:lint
npx nx run [project]:lint --quiet    # Errors only
```

### Test Specific Project

```bash
npx nx test [project]
npx nx test [project] --watch
```

### Build Specific Project

```bash
npx nx build [project]
```

### Type Check

```bash
npx tsc --noEmit -p libs/[path]/tsconfig.lib.json
```

## 📊 Analysis Commands

### Dependency Graph

```bash
npm run graph                  # Visual dependency graph
npx nx graph --affected        # Only affected projects
```

### Bundle Analysis

```bash
npx nx build zambia --stats-json
npx webpack-bundle-analyzer dist/apps/zambia/stats.json
```

### List Projects

```bash
npx nx show projects
npx nx show projects --affected
```

## 🗄️ Database Commands

### Generate Supabase Types

```bash
npm run supabase:gen:types:local
```

## 🧹 Maintenance Commands

### Format Code

```bash
npx prettier --write "**/*.{ts,html,scss,json}"
npm run prettier:staged        # Format staged files only
```

### Update Dependencies

```bash
npx nx migrate latest
npx nx migrate --run-migrations
```

### Clean & Reset

```bash
npx nx reset                   # Clear cache
rm -rf node_modules           # Clean dependencies
npm install                   # Reinstall
```

## 💡 Pro Tips

1. **Add `--dry-run`** to any generate command to preview without creating files
2. **Use `--help`** with any nx command for detailed options
3. **Add `--skip-tests`** to skip test file generation
4. **Use `--affected`** to only run commands on changed projects

## 🎯 Common Patterns

### Full Feature Creation Flow

```bash
# 1. Create feature library
npx nx g @nx/angular:library --name=feat-example --tags=scope:zambia,type:feat --directory=libs/zambia/feat-example

# 2. Create smart component
npx nx g @nx/angular:component --path=libs/zambia/feat-example/src/lib/components/smart --name=example-list --type=smart-component --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --export=true

# 3. Create facade service
npx nx g @nx/angular:service --name=example-facade --project=feat-example --path=libs/zambia/feat-example/src/lib/services --skipTests

# 4. Add routes
# Edit libs/zambia/feat-example/src/lib/lib.routes.ts

# 5. Update navigation
# Edit ROLES_CONSTANTS.ts to add navigation config
```

### Data Access Library Creation

```bash
# 1. Create data access library
npx nx g @nx/angular:library --name=data-access-example --tags=scope:shared,type:api --directory=libs/shared/data-access-example

# 2. Create service
npx nx g @nx/angular:service --name=example --project=data-access-example --path=libs/shared/data-access-example/src/lib --skipTests
```
