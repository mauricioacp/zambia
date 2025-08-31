import { NAVIGATION_ITEMS } from './navigation.config';

export function getRouteDataFromNavigation(routePath: string): { groups?: string[] } {
  const navItem = NAVIGATION_ITEMS.find((item) => item.route === routePath);

  if (!navItem || !navItem.allowedGroups) {
    return {};
  }

  return { groups: [...navItem.allowedGroups] };
}

export function getProtectedRoutes(): { path: string; groups: string[] }[] {
  return NAVIGATION_ITEMS.filter((item) => item.allowedGroups && item.allowedGroups.length > 0).map((item) => ({
    path: item.route.replace('/dashboard/', ''),
    groups: [...(item.allowedGroups as string[])],
  }));
}

export function isProtectedRoute(routePath: string): boolean {
  const navItem = NAVIGATION_ITEMS.find((item) => item.route === routePath);
  return !!(navItem?.allowedGroups && navItem.allowedGroups.length > 0);
}
