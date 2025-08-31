export function getNestedValue<T = unknown>(obj: Record<string, unknown>, path: string): T | null {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    value = (value as Record<string, unknown>)?.[key];
    if (value === undefined || value === null) {
      return null;
    }
  }

  return value as T;
}

export function getDisplayValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Check common display properties
    const displayValue =
      obj['name'] || obj['title'] || obj['label'] || obj['code'] || obj['role_name'] || obj['display'] || obj['value'];

    if (displayValue !== undefined) {
      return getDisplayValue(displayValue);
    }

    return '-';
  }

  return String(value);
}

/**
 * Track by function for ngFor loops
 */
export function trackByField<T extends Record<string, unknown>>(
  field: keyof T | string = 'id'
): (index: number, item: T) => unknown {
  return (index: number, item: T) => {
    // Handle null/undefined items
    if (!item) {
      return index;
    }

    // Check if field exists in item
    if (field && typeof item === 'object' && field in item) {
      return item[field as keyof T];
    }

    // Fallback to 'id' if it exists
    if (typeof item === 'object' && 'id' in item) {
      return item['id'];
    }

    // Use index as fallback
    return index;
  };
}

/**
 * Get status color based on value
 */
export function getStatusColor(status: unknown): string {
  if (typeof status === 'string') {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'success':
      case 'completed':
        return 'var(--tui-status-positive)';
      case 'inactive':
      case 'error':
      case 'failed':
        return 'var(--tui-status-negative)';
      case 'pending':
      case 'warning':
      case 'in_progress':
        return 'var(--tui-status-warning)';
      default:
        return 'var(--tui-status-neutral)';
    }
  }

  if (typeof status === 'boolean') {
    return status ? 'var(--tui-status-positive)' : 'var(--tui-status-negative)';
  }

  return 'var(--tui-status-neutral)';
}

/**
 * Get status icon based on value
 */
export function getStatusIcon(status: unknown): string {
  if (typeof status === 'string') {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'success':
      case 'completed':
        return '@tui.check';
      case 'inactive':
      case 'error':
      case 'failed':
        return '@tui.x';
      case 'pending':
      case 'warning':
      case 'in_progress':
        return '@tui.alert-circle';
      default:
        return '@tui.circle-help';
    }
  }

  if (typeof status === 'boolean') {
    return status ? '@tui.check' : '@tui.x';
  }

  return '@tui.circle-help';
}

export function formatDate(value: unknown, format = 'short'): string {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(String(value));

  if (isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString(undefined, {
    dateStyle: format as 'short' | 'medium' | 'long' | 'full',
  });
}

export function getActionButtonClass(color?: string): string {
  const baseClass = 'action-button';

  switch (color) {
    case 'primary':
      return `${baseClass} view-button`;
    case 'warning':
      return `${baseClass} edit-button`;
    case 'danger':
      return `${baseClass} delete-button`;
    case 'secondary':
      return `${baseClass} secondary-button`;
    default:
      return baseClass;
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
