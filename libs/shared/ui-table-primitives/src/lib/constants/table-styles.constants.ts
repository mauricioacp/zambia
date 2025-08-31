// Table Styling Constants
export const TABLE_STYLES = {
  // Container styles
  container: {
    base: 'relative overflow-hidden rounded-lg bg-white shadow-sm dark:bg-slate-800',
    glass:
      'relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20',
  },

  // Header styles
  header: {
    base: 'border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50',
    glass:
      'border-b border-gray-200/50 bg-white/50 px-6 py-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50',
    title: 'text-lg font-semibold text-gray-900 dark:text-white',
    description: 'mt-1 text-sm text-gray-600 dark:text-gray-300',
  },

  // Table styles
  table: {
    wrapper: 'overflow-x-auto',
    base: 'min-w-full divide-y divide-gray-200 dark:divide-slate-700',
    head: 'bg-gray-50 dark:bg-slate-800',
    body: 'divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-900',
    cell: 'whitespace-nowrap px-6 py-4 text-sm',
    headerCell: 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
  },

  // Row styles
  row: {
    base: 'transition-colors hover:bg-gray-50 dark:hover:bg-slate-800',
    clickable: 'cursor-pointer',
    selected: 'bg-sky-50 dark:bg-sky-900/20',
  },

  // Pagination styles
  pagination: {
    container:
      'flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-slate-700 dark:bg-slate-800',
    button: {
      base: 'relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active: 'z-10 bg-sky-50 border-sky-500 text-sky-600 dark:bg-sky-900/20 dark:border-sky-400 dark:text-sky-400',
      inactive:
        'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-700',
      disabled: 'cursor-not-allowed opacity-50',
    },
    text: 'text-sm text-gray-700 dark:text-gray-300',
  },

  // Empty state styles
  emptyState: {
    container: 'flex flex-col items-center justify-center py-12 text-center',
    icon: 'mb-4 h-12 w-12 text-gray-400 dark:text-gray-600',
    title: 'text-lg font-medium text-gray-900 dark:text-white',
    description: 'mt-2 text-sm text-gray-500 dark:text-gray-400',
    action: 'mt-4',
  },

  // Loading state styles
  loadingState: {
    container: 'flex items-center justify-center py-8',
    spinner: 'h-8 w-8 animate-spin text-sky-600 dark:text-sky-400',
    text: 'ml-3 text-sm text-gray-500 dark:text-gray-400',
  },

  // Column visibility styles
  columnVisibility: {
    trigger:
      'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:ring-slate-600 dark:hover:bg-slate-700',
    dropdown:
      'absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:ring-slate-700',
    item: 'flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700',
  },

  // Search styles
  search: {
    container: 'relative flex items-center',
    input:
      'block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-500',
    icon: 'absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500',
  },

  // Badge styles
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-400',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  },

  // Action button styles
  action: {
    base: 'inline-flex items-center rounded px-2 py-1 text-xs font-medium transition-colors',
    primary: 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700',
  },
} as const;

// Helper function to combine class names
export function tableClass(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
