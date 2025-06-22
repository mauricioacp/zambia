# Enhanced Table Refactoring - TODO List

## 📋 Overview

This document tracks the remaining tasks for completing the enhanced table refactoring project. The project is approximately 85-90% complete.

## ✅ Completed Tasks

- ✅ Created `libs/shared/ui-table-primitives` library with all base components
- ✅ Created `libs/shared/util-table-helpers` library with pipes and directives
- ✅ Built all primitive components (pagination, column visibility, empty state, loading state, header, search trigger)
- ✅ Refactored enhanced table component with new architecture
- ✅ Created agreement-specific components (search service, search modal, advanced search, smart table)
- ✅ Updated agreements facade service

## 🔲 Remaining Tasks

### 1. Create Role Filter Selector Component

**Priority: HIGH** - This is a missing critical component

**File to create**:
`libs/zambia/feat-agreements/src/lib/components/ui/role-filter-selector.ui-component.ts`

**Tasks**:

- [ ] Generate the component with proper naming convention
- [ ] Import all roles from `ROLES_CONSTANTS`
- [ ] Implement TuiSelect for role selection
- [ ] Add two-way binding with model signal
- [ ] Ensure all roles are displayed (fix the incomplete role filtering issue)
- [ ] Add proper TypeScript types
- [ ] Style with glass morphism pattern
- [ ] Create unit tests

**Implementation details**:

```typescript
// Key features needed:
- Load roles from shared/util-roles ROLES_CONSTANTS
- Support filtering by role group
- Show role display names with proper translations
- Handle "All Roles" option
- Emit role selection changes
```

### 2. Complete Agreements List Integration

**Priority: HIGH** - Main integration point

**File to update**:
`libs/zambia/feat-agreements/src/lib/components/smart/agreements-list.smart-component.ts`

**Tasks**:

- [ ] Remove old enhanced table import (line 26)
- [ ] Remove old table section from template (lines 211-291)
- [ ] Remove "New Refactored Table (for comparison)" header (line 310)
- [ ] Remove data transformation methods:
  - [ ] `transformAgreementsData` method (lines 600-617)
  - [ ] `tableData` computed property (line 377)
  - [ ] `filteredTableData` computed property (lines 412-443)
- [ ] Remove old table configuration:
  - [ ] `tableColumns` property (lines 445-499)
  - [ ] `tableActions` property (lines 501-551)
- [ ] Keep only the new smart table component (lines 314-336)
- [ ] Test all functionality works correctly

### 3. Verify and Fix Core Issues

**Priority: HIGH** - User-reported bugs

#### 3.1 Pagination Dropdown Fix

**Files to verify**:

- `libs/shared/ui-table-primitives/src/lib/components/table-pagination.ui-component.ts`
- Test in `libs/zambia/feat-agreements/src/lib/components/smart/agreements-list.smart-component.ts`

**Tasks**:

- [ ] Verify TuiSelect dropdown opens correctly
- [ ] Test page size changes work
- [ ] Ensure dropdown styling is correct
- [ ] Fix any z-index or overlay issues

#### 3.2 Role Filter Completeness

**Files involved**:

- New role filter component (to be created)
- `libs/shared/util-roles/src/lib/constants/roles.constants.ts`

**Tasks**:

- [ ] Ensure ALL roles from ROLES_CONSTANTS are available
- [ ] Verify role groups are properly displayed
- [ ] Test filtering works for all role types
- [ ] Add "All Roles" option

### 4. Testing & Quality Assurance

**Priority: HIGH** - Code quality

#### 4.1 Build and Lint

**Commands to run**:

```bash
cd /home/mcpo/developer/zambia
npm run build
npm run lint:all
```

**Tasks**:

- [ ] Run build command and fix any compilation errors
- [ ] Run lint command and fix all linting issues
- [ ] Ensure no TypeScript errors
- [ ] Check for unused imports

#### 4.2 Unit Tests

**Files to check/create tests for**:

- [ ] All components in `libs/shared/ui-table-primitives/src/lib/components/`
- [ ] All pipes/directives in `libs/shared/util-table-helpers/src/lib/`
- [ ] Agreement-specific components
- [ ] New role filter component

#### 4.3 Integration Testing

**Test scenarios**:

- [ ] Create new agreement
- [ ] Edit existing agreement
- [ ] Delete agreement
- [ ] Search agreements (both quick and advanced)
- [ ] Filter by role
- [ ] Change pagination
- [ ] Toggle column visibility
- [ ] Export data (if implemented)

### 5. Performance Testing

**Priority: MEDIUM**

**Tasks**:

- [ ] Test with 10 agreements
- [ ] Test with 100 agreements
- [ ] Test with 1000 agreements
- [ ] Measure render time
- [ ] Check memory usage
- [ ] Optimize if needed

### 6. Documentation

**Priority: MEDIUM**

#### 6.1 Create README for table primitives

**File**: `libs/shared/ui-table-primitives/README.md`

**Content to include**:

- [ ] Overview of the library
- [ ] List of available components
- [ ] Usage examples for each component
- [ ] API documentation
- [ ] Styling guidelines

#### 6.2 Update Enhanced Table Documentation

**File**: Create `libs/shared/ui-components/src/lib/ui-components/generic-table/README.md`

**Content to include**:

- [ ] Migration guide from old to new table
- [ ] API changes
- [ ] New features
- [ ] Example implementations

#### 6.3 Agreement Table Usage Guide

**File**: Create `libs/zambia/feat-agreements/README.md`

**Content to include**:

- [ ] How to use the smart table
- [ ] Search functionality guide
- [ ] Role filter usage
- [ ] Customization options

### 7. Final Cleanup

**Priority: LOW**

**Tasks**:

- [ ] Remove old enhanced table component (if not used elsewhere)
- [ ] Remove any debug console.log statements
- [ ] Update barrel exports to ensure clean imports
- [ ] Remove commented-out code
- [ ] Update any outdated comments

## 📍 Critical Path Items

1. **Create Role Filter Component** → Blocks full integration
2. **Fix Pagination Dropdown** → User-reported bug
3. **Complete Agreements List Integration** → Main deliverable
4. **Run Build & Lint** → Quality gate

## 🎯 Success Criteria

- [ ] All unit tests passing
- [ ] Pagination dropdown working correctly
- [ ] All roles visible in filter
- [ ] Search returning results in <500ms
- [ ] No methods in templates
- [ ] Build and lint passing
- [ ] Performance: Table renders 1000 rows in <2s
- [ ] All existing features maintained
- [ ] Zero TypeScript errors
- [ ] Clean integration with no duplicate code

## 📊 Progress Tracking

| Phase                                 | Status         | Completion |
| ------------------------------------- | -------------- | ---------- |
| Phase 1: Foundation & Base Components | ✅ Complete    | 100%       |
| Phase 2: Enhanced Table Refactoring   | ✅ Complete    | 100%       |
| Phase 3: Agreement Components         | 🔧 In Progress | 90%        |
| Phase 4: Integration & Polish         | 🔲 Pending     | 20%        |

**Overall Project Completion: ~85%**

## 🚀 Next Steps

1. Start with creating the role filter selector component
2. Test and fix the pagination dropdown issue
3. Complete the agreements list integration
4. Run comprehensive testing
5. Create documentation
6. Final cleanup and polish

---

**Note**: After each task, run `npm run build && npm run lint:all` to ensure code quality.
