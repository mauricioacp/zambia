import {
  getDisplayValue,
  getStatusColor,
  getStatusIcon,
  getActionButtonClass,
  trackByField,
  getNestedValue,
  formatDate,
  debounce,
} from './table.utils';

describe('Table Utils', () => {
  describe('getDisplayValue', () => {
    it('should return string for string values', () => {
      expect(getDisplayValue('test')).toBe('test');
    });

    it('should return string for number values', () => {
      expect(getDisplayValue(123)).toBe('123');
      expect(getDisplayValue(0)).toBe('0');
    });

    it('should return Yes/No for boolean values', () => {
      expect(getDisplayValue(true)).toBe('Yes');
      expect(getDisplayValue(false)).toBe('No');
    });

    it('should return formatted date for Date objects', () => {
      const date = new Date('2023-06-23T11:10:23.600Z');
      const result = getDisplayValue(date);
      expect(result).toContain('2023');
    });

    it('should return display value for objects with name property', () => {
      const obj = { id: 1, name: 'test' };
      expect(getDisplayValue(obj)).toBe('test');
    });

    it('should return display value for objects with title property', () => {
      const obj = { id: 1, title: 'Test Title' };
      expect(getDisplayValue(obj)).toBe('Test Title');
    });

    it('should return dash for objects without display properties', () => {
      const obj = { id: 1, other: 'value' };
      expect(getDisplayValue(obj)).toBe('-');
    });

    it('should return dash for arrays', () => {
      const arr = [1, 2, 3];
      expect(getDisplayValue(arr)).toBe('-');
    });

    it('should return dash for null', () => {
      expect(getDisplayValue(null)).toBe('-');
    });

    it('should return dash for undefined', () => {
      expect(getDisplayValue(undefined)).toBe('-');
    });
  });

  describe('getStatusColor', () => {
    it('should return positive color for active status', () => {
      expect(getStatusColor('active')).toBe('var(--tui-status-positive)');
      expect(getStatusColor('Active')).toBe('var(--tui-status-positive)');
      expect(getStatusColor('ACTIVE')).toBe('var(--tui-status-positive)');
    });

    it('should return negative color for inactive status', () => {
      expect(getStatusColor('inactive')).toBe('var(--tui-status-negative)');
      expect(getStatusColor('Inactive')).toBe('var(--tui-status-negative)');
      expect(getStatusColor('INACTIVE')).toBe('var(--tui-status-negative)');
    });

    it('should return warning color for pending status', () => {
      expect(getStatusColor('pending')).toBe('var(--tui-status-warning)');
      expect(getStatusColor('Pending')).toBe('var(--tui-status-warning)');
      expect(getStatusColor('PENDING')).toBe('var(--tui-status-warning)');
    });

    it('should return warning color for warning status', () => {
      expect(getStatusColor('warning')).toBe('var(--tui-status-warning)');
      expect(getStatusColor('Warning')).toBe('var(--tui-status-warning)');
      expect(getStatusColor('WARNING')).toBe('var(--tui-status-warning)');
    });

    it('should return negative color for error status', () => {
      expect(getStatusColor('error')).toBe('var(--tui-status-negative)');
      expect(getStatusColor('Error')).toBe('var(--tui-status-negative)');
      expect(getStatusColor('ERROR')).toBe('var(--tui-status-negative)');
    });

    it('should return positive color for success status', () => {
      expect(getStatusColor('success')).toBe('var(--tui-status-positive)');
      expect(getStatusColor('Success')).toBe('var(--tui-status-positive)');
      expect(getStatusColor('SUCCESS')).toBe('var(--tui-status-positive)');
    });

    it('should return neutral color for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('var(--tui-status-neutral)');
      expect(getStatusColor('custom')).toBe('var(--tui-status-neutral)');
      expect(getStatusColor(123)).toBe('var(--tui-status-neutral)');
    });

    it('should return positive/negative for boolean values', () => {
      expect(getStatusColor(true)).toBe('var(--tui-status-positive)');
      expect(getStatusColor(false)).toBe('var(--tui-status-negative)');
    });
  });

  describe('getStatusIcon', () => {
    it('should return check for active status', () => {
      expect(getStatusIcon('active')).toBe('@tui.check');
    });

    it('should return x for inactive status', () => {
      expect(getStatusIcon('inactive')).toBe('@tui.x');
    });

    it('should return alert-circle for pending status', () => {
      expect(getStatusIcon('pending')).toBe('@tui.alert-circle');
    });

    it('should return alert-circle for warning status', () => {
      expect(getStatusIcon('warning')).toBe('@tui.alert-circle');
    });

    it('should return x for error status', () => {
      expect(getStatusIcon('error')).toBe('@tui.x');
    });

    it('should return check for success status', () => {
      expect(getStatusIcon('success')).toBe('@tui.check');
    });

    it('should return circle-help for unknown status', () => {
      expect(getStatusIcon('unknown')).toBe('@tui.circle-help');
      expect(getStatusIcon('custom')).toBe('@tui.circle-help');
    });

    it('should return check/x for boolean values', () => {
      expect(getStatusIcon(true)).toBe('@tui.check');
      expect(getStatusIcon(false)).toBe('@tui.x');
    });
  });

  describe('getActionButtonClass', () => {
    it('should return primary button class', () => {
      expect(getActionButtonClass('primary')).toBe('action-button view-button');
    });

    it('should return secondary button class', () => {
      expect(getActionButtonClass('secondary')).toBe('action-button secondary-button');
    });

    it('should return warning button class', () => {
      expect(getActionButtonClass('warning')).toBe('action-button edit-button');
    });

    it('should return danger button class', () => {
      expect(getActionButtonClass('danger')).toBe('action-button delete-button');
    });

    it('should return base class for undefined color', () => {
      expect(getActionButtonClass(undefined)).toBe('action-button');
    });

    it('should return base class for unknown color', () => {
      expect(getActionButtonClass('unknown' as any)).toBe('action-button');
    });
  });

  describe('trackByField', () => {
    const items = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
      { id: '3', name: 'Item 3' },
    ];

    it('should track by specified field', () => {
      const trackFn = trackByField<any>('id');

      expect(trackFn(0, items[0])).toBe('1');
      expect(trackFn(1, items[1])).toBe('2');
      expect(trackFn(2, items[2])).toBe('3');
    });

    it('should track by different field', () => {
      const trackFn = trackByField<any>('name');

      expect(trackFn(0, items[0])).toBe('Item 1');
      expect(trackFn(1, items[1])).toBe('Item 2');
      expect(trackFn(2, items[2])).toBe('Item 3');
    });

    it('should return id when field does not exist but id is present', () => {
      const trackFn = trackByField<any>('nonexistent');

      expect(trackFn(0, items[0])).toBe('1');
      expect(trackFn(1, items[1])).toBe('2');
      expect(trackFn(2, items[2])).toBe('3');
    });

    it('should return index when item is null', () => {
      const trackFn = trackByField<any>('id');

      expect(trackFn(5, null as any)).toBe(5);
    });

    it('should return index when item is undefined', () => {
      const trackFn = trackByField<any>('id');

      expect(trackFn(7, undefined as any)).toBe(7);
    });

    it('should return index for items without id or requested field', () => {
      const itemsWithoutId = [
        { name: 'Item 1', value: 'A' },
        { name: 'Item 2', value: 'B' },
      ];
      const trackFn = trackByField<any>('nonexistent');

      expect(trackFn(0, itemsWithoutId[0])).toBe(0);
      expect(trackFn(1, itemsWithoutId[1])).toBe(1);
    });
  });

  describe('getNestedValue', () => {
    const obj = {
      name: 'John',
      address: {
        city: 'New York',
        country: {
          name: 'USA',
          code: 'US',
        },
      },
    };

    it('should get top-level value', () => {
      expect(getNestedValue(obj, 'name')).toBe('John');
    });

    it('should get nested value', () => {
      expect(getNestedValue(obj, 'address.city')).toBe('New York');
    });

    it('should get deeply nested value', () => {
      expect(getNestedValue(obj, 'address.country.name')).toBe('USA');
    });

    it('should return null for non-existent path', () => {
      expect(getNestedValue(obj, 'address.street')).toBeNull();
    });

    it('should return null for invalid path', () => {
      expect(getNestedValue(obj, 'address.city.name')).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('should format date object', () => {
      const date = new Date('2023-06-23T11:10:23.600Z');
      const result = formatDate(date);
      expect(result).toContain('23');
    });

    it('should format date string', () => {
      const result = formatDate('2023-06-23T11:10:23.600Z');
      expect(result).toContain('23');
    });

    it('should return dash for null', () => {
      expect(formatDate(null)).toBe('-');
    });

    it('should return dash for undefined', () => {
      expect(formatDate(undefined)).toBe('-');
    });

    it('should return dash for invalid date', () => {
      expect(formatDate('invalid')).toBe('-');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      expect(mockFn).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('should call function after delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('test');

      jest.advanceTimersByTime(299);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledWith('test');
    });
  });
});
