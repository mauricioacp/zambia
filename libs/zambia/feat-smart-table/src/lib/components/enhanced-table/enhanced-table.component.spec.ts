import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EnhancedTableComponent } from './enhanced-table.component';
import { TableStateService } from '../../services/table-state.service';
import { TableColumnWithTemplate, TableActionButton, EnhancedTableConfig } from '../../types/table.types';

describe('EnhancedTableComponent', () => {
  let component: EnhancedTableComponent<any>;
  let fixture: ComponentFixture<EnhancedTableComponent<any>>;
  let tableStateService: jest.Mocked<TableStateService<any>>;

  // Mock data based on real PostgreSQL data
  const mockAgreements = [
    {
      id: '1812a6e1-968a-4de2-933b-f10d06042a39',
      name: 'Super',
      last_name: 'Admin',
      email: 'test@test.com',
      status: 'active',
      created_at: '2025-06-19T12:15:29.767Z',
      headquarter: { name: 'Mendoza' },
      role: { name: 'Super administrador' },
    },
    {
      id: '43f39ab2-f77d-48ef-b0e2-2a27ec8c42bf',
      name: 'Lidia',
      last_name: 'Ribera Lorente',
      email: 'lidiaribera@gmail.com',
      status: 'prospect',
      created_at: '2023-06-23T11:10:23.600Z',
      headquarter: { name: 'Konsejo Akademiko' },
      role: { name: 'Director/a de Comunicación Local' },
    },
  ];

  const mockColumns: TableColumnWithTemplate<any>[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'created_at', label: 'Created', type: 'date' },
  ];

  const mockActions: TableActionButton<any>[] = [
    {
      label: 'View',
      icon: '@tui.eye',
      handler: jest.fn(),
      color: 'primary',
    },
    {
      label: 'Edit',
      icon: '@tui.pencil',
      handler: jest.fn(),
      color: 'secondary',
      visible: (item) => item.status === 'active',
    },
    {
      label: 'Delete',
      icon: '@tui.trash-2',
      handler: jest.fn(),
      color: 'danger',
      disabled: (item) => item.status === 'prospect',
    },
  ];

  const mockConfig: EnhancedTableConfig<any> = {
    title: 'Test Table',
    description: 'Test description',
    enablePagination: true,
    enableFiltering: true,
    enableColumnVisibility: true,
    enableAdvancedSearch: true,
    enableSorting: true,
    showCreateButton: true,
    createButtonLabel: 'Add New',
    pageSize: 10,
    pageSizeOptions: [10, 25, 50],
    searchableColumns: ['name', 'email'],
    emptyStateTitle: 'No data',
    emptyStateDescription: 'No items found',
  };

  beforeEach(() => {
    const tableStateServiceSpy = {
      setItems: jest.fn(),
      setSearchTerm: jest.fn(),
      setSort: jest.fn(),
      setPage: jest.fn(),
      setPageSize: jest.fn(),
      setColumnVisibility: jest.fn(),
      searchTerm: signal(''),
      sortConfig: signal(null),
      currentPage: signal(1),
      pageSize: signal(10),
      totalItems: signal(2),
      columnVisibility: signal({}),
    } as unknown as jest.Mocked<TableStateService<any>>;

    TestBed.configureTestingModule({
      imports: [EnhancedTableComponent, TranslateModule.forRoot()],
      providers: [{ provide: TableStateService, useValue: tableStateServiceSpy }, provideRouter([])],
    });

    fixture = TestBed.createComponent(EnhancedTableComponent);
    component = fixture.componentInstance;
    tableStateService = TestBed.inject(TableStateService) as jest.Mocked<TableStateService<any>>;

    // Set input values
    fixture.componentRef.setInput('items', mockAgreements);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('actions', mockActions);
    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('loading', false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with provided inputs', () => {
      fixture.detectChanges();

      expect(component.items()).toEqual(mockAgreements);
      expect(component.columns()).toEqual(mockColumns);
      expect(component.actions()).toEqual(mockActions);
      expect(component.config()).toEqual(mockConfig);
    });

    it('should update table state when items change', () => {
      fixture.detectChanges();

      expect(tableStateService.setItems).toHaveBeenCalled();
    });

    it('should initialize page size from config', () => {
      fixture.detectChanges();

      expect(tableStateService.setPageSize).toHaveBeenCalledWith(10);
    });
  });

  describe('Header Section', () => {
    it('should display title when provided', () => {
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent).toContain('Test Table');
    });

    it('should display create button when showCreateButton is true', () => {
      fixture.detectChanges();

      const createButton = fixture.debugElement.query(By.css('button[iconStart="@tui.plus"]'));
      expect(createButton).toBeTruthy();
      expect(createButton.nativeElement.textContent).toContain('Add New');
    });

    it('should emit createClick event when create button is clicked', () => {
      jest.spyOn(component.createClick, 'emit');
      fixture.detectChanges();

      const createButton = fixture.debugElement.query(By.css('button[iconStart="@tui.plus"]'));
      createButton.nativeElement.click();

      expect(component.createClick.emit).toHaveBeenCalled();
    });

    it('should display description when provided', () => {
      fixture.detectChanges();

      const descElement = fixture.debugElement.query(By.css('.text-gray-600'));
      expect(descElement.nativeElement.textContent).toContain('Test description');
    });
  });

  describe('Controls Section', () => {
    it('should show search input when enableFiltering is true', () => {
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('#table-search'));
      expect(searchInput).toBeTruthy();
    });

    it('should call setSearchTerm when search input changes', () => {
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('#table-search'));
      searchInput.nativeElement.value = 'test search';
      searchInput.nativeElement.dispatchEvent(new Event('input'));

      expect(tableStateService.setSearchTerm).toHaveBeenCalledWith('test search');
    });

    it('should show advanced search button when enableAdvancedSearch is true', () => {
      fixture.detectChanges();

      const advancedSearchButton = fixture.debugElement.query(By.css('z-table-search-trigger'));
      expect(advancedSearchButton).toBeTruthy();
    });

    it('should emit advancedSearchClick event', () => {
      jest.spyOn(component.advancedSearchClick, 'emit');
      fixture.detectChanges();

      // Simulate the searchClick event from the child component
      const searchTrigger = fixture.debugElement.query(By.css('z-table-search-trigger'));
      searchTrigger.triggerEventHandler('searchClick', {});

      expect(component.advancedSearchClick.emit).toHaveBeenCalled();
    });

    it('should show column visibility component when enableColumnVisibility is true', () => {
      fixture.detectChanges();

      const columnVisibility = fixture.debugElement.query(By.css('z-table-column-visibility'));
      expect(columnVisibility).toBeTruthy();
    });
  });

  describe('Table Display', () => {
    it('should render table headers correctly', () => {
      fixture.detectChanges();

      const headers = fixture.debugElement.queryAll(By.css('th'));
      expect(headers.length).toBe(mockColumns.length);
      expect(headers[0].nativeElement.textContent).toContain('Name');
      expect(headers[1].nativeElement.textContent).toContain('Email');
    });

    it('should render table rows correctly', () => {
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(mockAgreements.length);
    });

    it('should apply sortable class to sortable columns', () => {
      fixture.detectChanges();

      const nameHeader = fixture.debugElement.query(By.css('th.sortable'));
      expect(nameHeader).toBeTruthy();
      expect(nameHeader.nativeElement.textContent).toContain('Name');
    });

    it('should call setSort when sortable column header is clicked', () => {
      fixture.detectChanges();

      const nameHeader = fixture.debugElement.query(By.css('th.sortable'));
      nameHeader.nativeElement.click();

      expect(tableStateService.setSort).toHaveBeenCalledWith('name');
    });

    it('should emit rowClick event when row is clicked', () => {
      jest.spyOn(component.rowClick, 'emit');
      fixture.detectChanges();

      const firstRow = fixture.debugElement.query(By.css('tbody tr'));
      firstRow.nativeElement.click();

      expect(component.rowClick.emit).toHaveBeenCalledWith(mockAgreements[0]);
    });
  });

  describe('Cell Rendering', () => {
    it('should render text cells correctly', () => {
      fixture.detectChanges();

      const nameCells = fixture.debugElement.queryAll(By.css('tbody tr td:first-child'));
      expect(nameCells[0].nativeElement.textContent).toContain('Super');
      expect(nameCells[1].nativeElement.textContent).toContain('Lidia');
    });

    it('should render status cells with proper styling', () => {
      fixture.detectChanges();

      const statusCells = fixture.debugElement.queryAll(By.css('tbody tr td:nth-child(3) span[tuiStatus]'));
      expect(statusCells.length).toBe(2);
    });

    it('should render date cells with chip component', () => {
      fixture.detectChanges();

      const dateCells = fixture.debugElement.queryAll(By.css('tbody tr td:nth-child(4) tui-chip'));
      expect(dateCells.length).toBe(2);
    });
  });

  describe('Actions Column', () => {
    beforeEach(() => {
      const columnsWithActions = [
        ...mockColumns,
        {
          key: 'actions',
          label: 'Actions',
          type: 'actions' as const,
        },
      ];
      fixture.componentRef.setInput('columns', columnsWithActions);
    });

    it('should render action buttons', () => {
      fixture.detectChanges();

      const actionButtons = fixture.debugElement.queryAll(By.css('.actions-group button'));
      expect(actionButtons.length).toBeGreaterThan(0);
    });

    it('should call action handler when button is clicked', () => {
      fixture.detectChanges();

      const firstActionButton = fixture.debugElement.query(By.css('.actions-group button'));
      firstActionButton.nativeElement.click();

      expect(mockActions[0].handler).toHaveBeenCalledWith(mockAgreements[0]);
    });

    it('should hide actions based on visible function', () => {
      fixture.detectChanges();

      // For the prospect item, edit button should not be visible
      const secondRowActions = fixture.debugElement.queryAll(By.css('tbody tr:nth-child(2) .actions-group button'));
      const hasEditButton = secondRowActions.some((btn) => btn.nativeElement.getAttribute('aria-label') === 'Edit');
      expect(hasEditButton).toBe(false);
    });

    it('should disable actions based on disabled function', () => {
      fixture.detectChanges();

      // For the prospect item, delete button should be disabled
      const secondRowActions = fixture.debugElement.queryAll(By.css('tbody tr:nth-child(2) .actions-group button'));
      const deleteButton = secondRowActions.find((btn) => btn.nativeElement.getAttribute('aria-label') === 'Delete');
      expect(deleteButton?.nativeElement.disabled).toBe(true);
    });
  });

  describe('Pagination', () => {
    it('should show pagination component when enablePagination is true', () => {
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('z-table-pagination'));
      expect(pagination).toBeTruthy();
    });

    it('should pass correct config to pagination component', () => {
      fixture.detectChanges();

      const paginationConfig = component.paginationConfig();
      expect(paginationConfig.currentPage).toBe(1);
      expect(paginationConfig.pageSize).toBe(10);
      expect(paginationConfig.totalItems).toBe(2);
      expect(paginationConfig.pageSizeOptions).toEqual([10, 25, 50]);
    });

    it('should call setPage when page changes', () => {
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('z-table-pagination'));
      pagination.triggerEventHandler('pageChange', 2);

      expect(tableStateService.setPage).toHaveBeenCalledWith(2);
    });

    it('should call setPageSize when page size changes', () => {
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('z-table-pagination'));
      pagination.triggerEventHandler('pageSizeChange', 25);

      expect(tableStateService.setPageSize).toHaveBeenCalledWith(25);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no items', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('z-table-empty-state'));
      expect(emptyState).toBeTruthy();
    });

    it('should pass correct config to empty state', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      const emptyStateConfig = component.emptyStateConfig();
      expect(emptyStateConfig.title).toBe('No data');
      expect(emptyStateConfig.description).toBe('No items found');
    });
  });

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const loadingState = fixture.debugElement.query(By.css('z-table-loading-state'));
      expect(loadingState).toBeTruthy();
    });

    it('should hide table content when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table).toBeFalsy();
    });
  });

  describe('Computed Properties', () => {
    it('should compute display columns based on visibility', () => {
      (tableStateService as any).columnVisibility = signal({ email: false });
      fixture.detectChanges();

      const displayColumns = component.displayColumns();
      expect(displayColumns.length).toBe(mockColumns.length - 1);
      expect(displayColumns.find((col) => col.key === 'email')).toBeFalsy();
    });

    it('should compute search placeholder correctly', () => {
      const placeholder = component.searchPlaceholder();
      expect(placeholder).toBe('Search in 2 columns...');
    });

    it('should show controls when any control feature is enabled', () => {
      expect(component.showControls()).toBe(true);

      fixture.componentRef.setInput('config', {
        ...mockConfig,
        enableFiltering: false,
        enableColumnVisibility: false,
        enableAdvancedSearch: false,
      });
      fixture.detectChanges();

      expect(component.showControls()).toBe(false);
    });
  });

  describe('Helper Methods', () => {
    it('should get cell value correctly', () => {
      const value = component.getCellValue(mockAgreements[0], mockColumns[0]);
      expect(value).toBe('Super');
    });

    it('should use valueGetter when provided', () => {
      const columnWithGetter: TableColumnWithTemplate<any> = {
        key: 'fullName',
        label: 'Full Name',
        valueGetter: (item) => `${item.name} ${item.last_name}`,
      };

      const value = component.getCellValue(mockAgreements[0], columnWithGetter);
      expect(value).toBe('Super Admin');
    });

    it('should check if column is sorted', () => {
      (tableStateService as any).sortConfig = signal({ key: 'name', direction: 'asc' });
      fixture.detectChanges();

      expect(component.isColumnSorted(mockColumns[0])).toBe(true);
      expect(component.isColumnSorted(mockColumns[1])).toBe(false);
    });

    it('should get correct sort icon', () => {
      (tableStateService as any).sortConfig = signal({ key: 'name', direction: 'asc' });
      fixture.detectChanges();

      expect(component.getSortIcon(mockColumns[0])).toBe('@tui.chevron-up');

      (tableStateService as any).sortConfig = signal({ key: 'name', direction: 'desc' });
      fixture.detectChanges();

      expect(component.getSortIcon(mockColumns[0])).toBe('@tui.chevron-down');
    });
  });
});
