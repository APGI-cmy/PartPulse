/**
 * Shared utility functions for reports
 */

/**
 * Generic sorting comparator for reports
 */
export function sortItems<T>(
  items: T[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  getValueFn: (item: T, sortBy: string) => number | string
): T[] {
  return [...items].sort((a, b) => {
    const aValue = getValueFn(a, sortBy);
    const bValue = getValueFn(b, sortBy);
    
    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
