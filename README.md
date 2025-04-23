## Application Routes

This application uses Angular's routing mechanism to navigate between different features.

-   The base path `/` redirects to `/dashboard`.
-   The `/dashboard` path serves as the main entry point after the initial redirect.
  -   `/dashboard/headquarter`: Loads the headquarter module. Requires authentication and 'admin' or 'editor' role.
  -   `/dashboard/access-denied`: Shows an access denied page.
  -   Any other route under `/dashboard/` (e.g., `/dashboard/invalid`) redirects to `/dashboard/access-denied`.
-   Any top-level route that doesn't match the defined paths (e.g., `/unknown`) redirects to `/dashboard`.
