# Enhanced Table Refactoring Project Plan

## Project Overview

Refactor the enhanced table UI component into a modern, scalable three-layer architecture with improved search capabilities, proper separation of concerns, and strict TypeScript typing following Angular 19 best practices.

## Phase 1: Foundation & Base Components (Days 1-2)

### 1.1 Project Setup & Type Definitions

- [ ] Create new library for table primitives: `libs/shared/ui-table-primitives`
- [ ] Define all TypeScript interfaces in `table.types.ts`
  - TableColumn interface
  - TableAction interface
  - PaginationState interface
  - ColumnConfig interface
- [ ] Create shared styling constants file for Tailwind classes
- [ ] Set up barrel exports for clean imports

### 1.2 Empty State Component

- [ ] Generate `empty-state.ui-component.ts` with OnPush
- [ ] Implement inputs: icon, title, description, actionLabel
- [ ] Implement output: action event
- [ ] Add glass morphism styling
- [ ] Create unit tests
- [ ] Add to barrel exports

### 1.3 Loading State Component

- [ ] Generate `loading-state.ui-component.ts` with OnPush
- [ ] Implement configurable skeleton rows/columns
- [ ] Add TuiSkeleton integration
- [ ] Apply consistent styling
- [ ] Create unit tests
- [ ] Add to barrel exports

### 1.4 Pagination Component

- [ ] Generate `pagination.ui-component.ts` with OnPush
- [ ] Implement page navigation (first, prev, next, last)
- [ ] Fix items per page dropdown using TuiSelect
- [ ] Add "Showing X-Y of Z" display
- [ ] Implement pageChange and pageSizeChange outputs
- [ ] Ensure mobile responsiveness
- [ ] Create comprehensive unit tests
- [ ] Add to barrel exports

### 1.5 Column Visibility Component

- [ ] Generate `column-visibility.ui-component.ts` with OnPush
- [ ] Implement TuiDropdown with checkboxes
- [ ] Add "Show All" / "Hide All" actions
- [ ] Implement localStorage persistence
- [ ] Handle column visibility state with signals
- [ ] Create unit tests
- [ ] Add to barrel exports

### 1.6 Table Header Component

- [ ] Generate `table-header.ui-component.ts` with OnPush
- [ ] Implement title and description inputs
- [ ] Add content projection for actions slot
- [ ] Apply glass morphism styling
- [ ] Create unit tests
- [ ] Add to barrel exports

## Phase 2: Middle Layer - Enhanced Table Refactoring (Days 3-5)

### 2.1 Create Pipes & Directives Library

- [ ] Create new library: `libs/shared/util-table-helpers`
- [ ] Implement TableSearchPipe for filtering data
- [ ] Implement TableSortPipe for sorting functionality
- [ ] Create TableRowClickDirective for row interactions
- [ ] Create TableActionVisibleDirective for conditional actions
- [ ] Add comprehensive unit tests for all pipes/directives
- [ ] Set up barrel exports

### 2.2 Prepare Enhanced Table Refactoring

- [ ] Create a copy of current enhanced table as backup
- [ ] Analyze current implementation for reusable parts
- [ ] Document all breaking changes needed
- [ ] Create migration checklist for dependent components

### 2.3 Refactor Enhanced Table Component

- [ ] Remove all methods from template
- [ ] Replace method calls with pipes and directives
- [ ] Integrate base components (pagination, column visibility, etc.)
- [ ] Implement proper TypeScript types throughout
- [ ] Convert to use Angular 19 signals for state
- [ ] Add computed signals for filtered/sorted data
- [ ] Ensure OnPush change detection works correctly
- [ ] Update component to use new control flow (@if, @for)

### 2.4 Enhanced Table Testing & Optimization

- [ ] Create comprehensive unit tests
- [ ] Test with various data sizes (10, 100, 1000 rows)
- [ ] Verify pagination dropdown fix
- [ ] Test column visibility persistence
- [ ] Ensure all existing features still work
- [ ] Performance testing and optimization
- [ ] Fix any regression issues

### 2.5 Update Existing Table Consumers

- [ ] Update countries list to use refactored table
- [ ] Update headquarters list
- [ ] Update student demographics
- [ ] Verify all implementations work correctly
- [ ] Document any API changes

## Phase 3: Agreement-Specific Components (Days 6-7)

### 3.1 Agreement Search Service

- [ ] Create `agreement-search.service.ts`
- [ ] Implement searchAgreements method with tsvector
- [ ] Add debouncing logic (300ms)
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Create unit tests

### 3.2 Agreement Search Modal Component

- [ ] Generate `agreement-search-modal.ui-component.ts`
- [ ] Integrate TuiDialog
- [ ] Implement search input with TuiInput
- [ ] Add real-time search results display
- [ ] Implement single-select functionality
- [ ] Add loading and empty states
- [ ] Apply glass morphism styling to results
- [ ] Create unit tests

### 3.3 Role Filter Selector Component

- [ ] Generate `role-filter-selector.ui-component.ts`
- [ ] Load all roles from ROLES_CONSTANTS
- [ ] Fix incomplete role filtering issue
- [ ] Implement two-way binding with model signal
- [ ] Add type-safe role handling
- [ ] Create unit tests

### 3.4 Agreements Smart Table Component

- [ ] Generate `agreements-smart-table.component.ts`
- [ ] Compose all components together
- [ ] Implement search modal integration
- [ ] Configure default visible columns
- [ ] Set up role filter integration
- [ ] Define agreement-specific actions
- [ ] Add translation keys
- [ ] Create comprehensive tests

### 3.5 Agreements Facade Service Updates

- [ ] Add searchAgreements method to facade
- [ ] Implement proper TypeScript types
- [ ] Add error handling
- [ ] Update to avoid querying signature_data
- [ ] Create unit tests for new methods

## Phase 4: Integration & Polish (Days 8-9)

### 4.1 Integration with Agreements List

- [ ] Replace current table in agreements list component
- [ ] Wire up search functionality
- [ ] Connect role filter
- [ ] Test all existing actions still work
- [ ] Verify navigation to agreement details
- [ ] Performance testing with real data

### 4.2 Documentation

- [ ] Create comprehensive README for table primitives library
- [ ] Document enhanced table API changes
- [ ] Create migration guide for other teams
- [ ] Add code examples for common use cases
- [ ] Document new search functionality

### 4.3 Accessibility & UX Polish

- [ ] Add ARIA labels to all interactive elements
- [ ] Implement keyboard navigation for search modal
- [ ] Test with screen readers
- [ ] Add focus management in modals
- [ ] Verify dark mode works correctly
- [ ] Add loading skeletons for better UX

### 4.4 Performance Optimization

- [ ] Implement virtual scrolling for large datasets
- [ ] Add memoization where needed
- [ ] Optimize change detection
- [ ] Profile and fix any performance bottlenecks
- [ ] Test with 3000 agreements

### 4.5 Final Testing & Cleanup

- [ ] Run full test suite
- [ ] Manual testing of all features
- [ ] Fix any remaining bugs
- [ ] Remove old/unused code
- [ ] Update translations
- [ ] Final build and lint check

## Critical Path Items

1. **Pagination Dropdown Fix** - This is blocking user experience
2. **Role Filter Fix** - Currently not showing all roles
3. **Search Implementation** - New critical feature
4. **Template Method Removal** - Technical debt that affects performance

## Risk Mitigation

1. **Backward Compatibility**: Keep old component available during transition
2. **Incremental Rollout**: Test with one page before full migration
3. **Data Safety**: No database changes required
4. **Performance**: Test with production-size datasets early

## Success Metrics

- [ ] All unit tests passing (100% coverage for new components)
- [ ] Pagination dropdown working correctly
- [ ] All roles visible in filter
- [ ] Search returning results in <500ms
- [ ] No methods in templates
- [ ] Build and lint passing
- [ ] Performance: Table renders 1000 rows in <2s
- [ ] All existing features maintained

## Dependencies to Verify

- [ ] Supabase client supports textSearch method
- [ ] TaigaUI components are available and up to date
- [ ] Angular 19 features are properly configured
- [ ] Nx workspace is properly set up for new libraries

## Notes for Implementation

1. Always use OnPush change detection
2. Use signals instead of BehaviorSubjects
3. Implement proper error boundaries
4. Add loading states for all async operations
5. Test on mobile devices
6. Consider future bulk actions feature in design

---

This plan breaks down the 9-day timeline into specific, actionable tasks that can be assigned to engineers. Each task is small enough to be completed safely but meaningful enough to show progress.
