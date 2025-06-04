# Environment Variables Guide

## Overview

This guide explains how to configure environment variables for the Zambia application across different environments.

## Environment Variables

### Required Variables

| Variable         | Description            | Example                                                                       | Where Used                |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| `API_URL`        | Supabase API URL       | `http://127.0.0.1:54321` (local)<br>`https://your-project.supabase.co` (prod) | API calls, Edge Functions |
| `API_PUBLIC_KEY` | Supabase Anonymous Key | `eyJhbGci...`                                                                 | Authentication, API calls |
| `PROD`           | Production flag        | `true` or leave empty                                                         | Build optimization        |

### Optional Variables

| Variable   | Description      | Example                     | Where Used    |
| ---------- | ---------------- | --------------------------- | ------------- |
| `NODE_ENV` | Node environment | `development`, `production` | Build process |

## Configuration Files

### 1. Local Development (.env)

Create a `.env` file in the root directory:

```bash
# Development environment variables
API_URL=http://127.0.0.1:54321
API_PUBLIC_KEY=your-supabase-anon-key
# Uncomment in production
#PROD=true
```

### 2. Production (.env.production)

Create a `.env.production` file for production deployments:

```bash
# Production environment variables
API_URL=https://your-project.supabase.co
API_PUBLIC_KEY=your-production-anon-key
PROD=true
```

### 3. Docker Configuration

#### docker-compose.yaml

The production Docker Compose file uses environment variables with fallbacks:

```yaml
services:
  zambia-app:
    build:
      args:
        - API_URL=${API_URL:-https://api.yourdomain.com}
        - API_PUBLIC_KEY=${API_PUBLIC_KEY:-your-api-key}
        - PROD=true
    env_file:
      - .env
      - .env.production
```

#### docker-compose.dev.yaml

For development with Docker:

```yaml
services:
  zambia-app-dev:
    build:
      args:
        - API_URL=${API_URL:-http://127.0.0.1:54321}
        - API_PUBLIC_KEY=${API_PUBLIC_KEY:-your-dev-key}
    env_file:
      - .env
```

### 4. Environment Files Generation

The application uses a dynamic environment generation script (`set-env.ts`) that:

1. Reads from `.env` files
2. Generates TypeScript environment files
3. Supports multiple environments (development, production)

## Edge Functions Configuration

### Calling Edge Functions

The edge functions are accessed through the Supabase API URL:

- **Local**: `http://127.0.0.1:54321/functions/v1/akademy-app/{endpoint}`
- **Production**: `https://your-project.supabase.co/functions/v1/akademy-app/{endpoint}`

### Available Endpoints

1. **Migrate**: `/akademy-app/migrate` (POST)
2. **Create User**: `/akademy-app/create-user` (POST)
3. **Reset Password**: `/akademy-app/reset-password` (POST)
4. **Deactivate User**: `/akademy-app/deactivate-user` (POST)

### Authentication

All edge function calls require a valid JWT token from Supabase Auth:

```typescript
// The AkademyEdgeFunctionsService handles this automatically
// It uses the SupabaseService which includes the auth token
```

## Deployment Instructions

### Local Development

1. Copy `.env.example` to `.env`
2. Update values for your local Supabase instance
3. Run `npm run dev`

### Docker Development

1. Ensure `.env` file exists
2. Run `docker-compose -f docker-compose.dev.yaml up`

### Production with Docker

1. Create `.env.production` with production values
2. Run `docker-compose up -d`

### Production without Docker

1. Set environment variables in your hosting platform
2. Build with: `npm run build`
3. Deploy the `dist/` folder

## CI/CD Integration

### GitHub Actions

```yaml
env:
  API_URL: ${{ secrets.API_URL }}
  API_PUBLIC_KEY: ${{ secrets.API_PUBLIC_KEY }}
  PROD: true
```

### Vercel/Netlify

Add environment variables in the platform dashboard:

- `API_URL`
- `API_PUBLIC_KEY`
- `PROD`

## Security Best Practices

1. **Never commit** `.env` files with real values
2. **Use secrets** in CI/CD pipelines
3. **Rotate keys** regularly
4. **Different keys** for each environment
5. **Restrict** Supabase row-level security (RLS) policies

## Troubleshooting

### Common Issues

1. **Edge functions not working**

   - Check `API_URL` is correct
   - Verify JWT token is valid
   - Check user role permissions

2. **Build failures**

   - Ensure all required env vars are set
   - Check `.env` file formatting

3. **Docker issues**
   - Verify `.env` files exist
   - Check Docker build args

### Debugging

1. Check generated environment files:

   ```bash
   cat apps/zambia/src/environments/environment.ts
   ```

2. Verify environment in browser console:

   ```javascript
   console.log(environment);
   ```

3. Check edge function URLs:
   ```typescript
   // In AkademyEdgeFunctionsService
   console.log(`${this.supabase.supabaseUrl}/functions/v1/akademy-app`);
   ```
