import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { GenericSearchModalComponent } from './generic-search-modal.component';
import { SearchModalConfig, SearchModalResult, SearchService } from '../../types/search.types';

describe('GenericSearchModalComponent', () => {
  let component: GenericSearchModalComponent<any>;
  let fixture: ComponentFixture<GenericSearchModalComponent<any>>;
  let mockContext: TuiDialogContext<SearchModalResult<any>, { config: SearchModalConfig<any> }>;

  // Mock data based on real PostgreSQL data
  const mockData = [
    {
      id: '1812a6e1-968a-4de2-933b-f10d06042a39',
      name: 'Super',
      last_name: 'Admin',
      email: 'test@test.com',
      status: 'active',
      role: 'Super administrador',
    },
    {
      id: '43f39ab2-f77d-48ef-b0e2-2a27ec8c42bf',
      name: 'Lidia',
      last_name: 'Ribera Lorente',
      email: 'lidiaribera@gmail.com',
      status: 'prospect',
      role: 'Director/a de Comunicación Local',
    },
    {
      id: 'b890aedd-a54b-45c2-a141-18ae665ce623',
      name: 'Aurelia',
      last_name: 'Alvarez Alonso',
      email: 'aureliaescuela@gmail.com',
      status: 'prospect',
      role: 'Asistente a la dirección',
    },
  ];

  const mockConfig: SearchModalConfig<any> = {
    title: 'Search Users',
    multiple: false,
    showRecent: true,
    recentItemsKey: 'recent-users',
    maxRecentItems: 5,
    data: mockData,
    searchConfig: {
      placeholder: 'Type to search...',
      minLength: 2,
      debounceTime: 300,
      searchKeys: ['name', 'email', 'role'],
    },
  };

  const mockSearchService: Partial<SearchService<any>> = {
    search: jest.fn().mockResolvedValue([
      { item: mockData[0], score: 1 },
      { item: mockData[1], score: 0.8 },
    ]),
    searchState: signal({ term: '', isSearching: false, results: [], totalResults: 0 }),
    config: signal({}),
    clearSearch: jest.fn(),
    setConfig: jest.fn(),
    recentSearches: signal([]),
    addRecentSearch: jest.fn(),
    clearRecentSearches: jest.fn(),
  };

  beforeEach(() => {
    mockContext = {
      completeWith: jest.fn(),
      data: { config: mockConfig },
    } as any;

    TestBed.configureTestingModule({
      imports: [GenericSearchModalComponent],
      providers: [
        {
          provide: POLYMORPHEUS_CONTEXT,
          useValue: mockContext,
        },
      ],
    });

    fixture = TestBed.createComponent(GenericSearchModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with config from context', () => {
      expect(component.config).toEqual(mockConfig);
    });

    it('should initialize form controls', () => {
      expect(component.searchControl).toBeInstanceOf(FormControl);
      expect(component.selectionControl).toBeInstanceOf(FormControl);
      expect(component.searchControl.value).toBe('');
      expect(component.selectionControl.value).toBeNull();
    });

    it('should load recent items if showRecent is true', () => {
      const recentItems = [mockData[0], mockData[1]];
      localStorage.setItem('recent-users', JSON.stringify(recentItems));

      fixture = TestBed.createComponent(GenericSearchModalComponent);
      component = fixture.componentInstance;

      expect(component.recentItems()).toEqual(recentItems);
    });
  });

  describe('Search Functionality', () => {
    it('should debounce search input', fakeAsync(() => {
      component.searchControl.setValue('t');
      component.searchControl.setValue('te');
      component.searchControl.setValue('test');

      tick(200);
      expect(component.searchTerm()).toBe('');

      tick(100);
      expect(component.searchTerm()).toBe('test');
    }));

    it('should perform search when term meets minimum length', fakeAsync(() => {
      jest.spyOn<any, any>(component, 'performSearch').mockResolvedValue(undefined);

      component.searchControl.setValue('Li');
      tick(300);

      expect(component['performSearch']).toHaveBeenCalledWith('Li');
    }));

    it('should not search when term is below minimum length', fakeAsync(() => {
      jest.spyOn<any, any>(component, 'performSearch');

      component.searchControl.setValue('L');
      tick(300);

      expect(component['performSearch']).not.toHaveBeenCalled();
    }));

    it('should clear results when search term is empty', fakeAsync(() => {
      component.searchResults.set(mockData);
      component.hasSearched.set(true);

      component.searchControl.setValue('');
      tick(300);

      expect(component.searchResults()).toEqual([]);
      expect(component.hasSearched()).toBe(false);
    }));

    it('should filter data correctly with client-side search', fakeAsync(() => {
      component.searchControl.setValue('lidia');
      tick(300);

      expect(component.searchResults().length).toBe(1);
      expect(component.searchResults()[0].name).toBe('Lidia');
    }));

    it('should use search service when provided', fakeAsync(() => {
      component.config.searchService = mockSearchService as SearchService<any>;

      component.searchControl.setValue('test');
      tick(300);

      expect((mockSearchService as any).search).toHaveBeenCalledWith('test', mockData);

      tick(); // Wait for promise
      expect(component.searchResults().length).toBe(2);
    }));

    it('should handle search errors gracefully', fakeAsync(() => {
      component.config.searchService = {
        search: jest.fn().mockRejectedValue(new Error('Search failed')),
        searchState: signal({ term: '', isSearching: false, results: [], totalResults: 0 }),
        config: signal({}),
        clearSearch: jest.fn(),
        setConfig: jest.fn(),
        recentSearches: signal([]),
        addRecentSearch: jest.fn(),
        clearRecentSearches: jest.fn(),
      } as SearchService<any>;

      jest.spyOn(console, 'error').mockImplementation();

      component.searchControl.setValue('test');
      tick(300);
      tick(); // Wait for promise rejection

      expect(console.error).toHaveBeenCalled();
      expect(component.searchResults()).toEqual([]);
      expect(component.isSearching()).toBe(false);
    }));
  });

  describe('UI Display', () => {
    it('should display title', () => {
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h2'));
      expect(title.nativeElement.textContent).toContain('Search Users');
    });

    it('should display search input with placeholder', () => {
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('#search-input'));
      expect(searchInput.nativeElement.placeholder).toBe('Type to search...');
    });

    it('should show loading state while searching', () => {
      component.isSearching.set(true);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('tui-loader'));
      expect(loader).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Searching...');
    });

    it('should show results when available', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      fixture.detectChanges();

      const results = fixture.debugElement.queryAll(By.css('.result-item'));
      expect(results.length).toBe(2);
    }));

    it('should show empty state when no results found', () => {
      component.hasSearched.set(true);
      component.searchResults.set([]);
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('z-table-empty-state'));
      expect(emptyState).toBeTruthy();
    });

    it('should show recent items when enabled and available', () => {
      component.recentItems.set([mockData[0], mockData[1]]);
      fixture.detectChanges();

      const recentSection = fixture.debugElement.query(By.css('.recent-section'));
      expect(recentSection).toBeTruthy();

      const recentChips = fixture.debugElement.queryAll(By.css('.recent-chip'));
      expect(recentChips.length).toBe(2);
    });
  });

  describe('Single Selection Mode', () => {
    beforeEach(() => {
      component.config.multiple = false;
      fixture.detectChanges();
    });

    it('should render radio buttons for single selection', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      fixture.detectChanges();

      const radioList = fixture.debugElement.query(By.css('tui-radio-list'));
      expect(radioList).toBeTruthy();
    }));

    it('should update selection control when item is selected', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      fixture.detectChanges();

      const firstOption = fixture.debugElement.query(By.css('button[tuiOption]'));
      firstOption.nativeElement.click();

      expect(component.selectionControl.value).toEqual(mockData[1]);
    }));

    it('should enable confirm button when selection is made', () => {
      component.selectionControl.setValue(mockData[0]);
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.query(By.css('button[appearance="primary"]'));
      expect(confirmButton.nativeElement.disabled).toBe(false);
    });

    it('should complete with selected item on confirm', () => {
      component.selectionControl.setValue(mockData[0]);
      component.confirm();

      expect(mockContext.completeWith).toHaveBeenCalledWith({
        selected: mockData[0],
        searchTerm: '',
      });
    });
  });

  describe('Multiple Selection Mode', () => {
    beforeEach(() => {
      component.config.multiple = true;
      fixture.detectChanges();
    });

    it('should render checkboxes for multiple selection', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      expect(checkboxes.length).toBe(2);
    }));

    it('should toggle item selection when checkbox is clicked', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      fixture.detectChanges();

      const firstCheckbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      firstCheckbox.nativeElement.click();

      expect(component.isItemSelected(mockData[1])).toBe(true);

      firstCheckbox.nativeElement.click();
      expect(component.isItemSelected(mockData[1])).toBe(false);
    }));

    it('should show selection count in confirm button', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      component.toggleItemSelection(mockData[1]);
      component.toggleItemSelection(mockData[2]);
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.query(By.css('button[appearance="primary"]'));
      expect(confirmButton.nativeElement.textContent).toContain('Select (2)');
    }));

    it('should complete with selected items array on confirm', fakeAsync(() => {
      component.searchControl.setValue('gmail');
      tick(300);
      component.toggleItemSelection(mockData[1]);
      component.toggleItemSelection(mockData[2]);

      component.confirm();

      expect(mockContext.completeWith).toHaveBeenCalledWith({
        selected: [mockData[1], mockData[2]],
        searchTerm: 'gmail',
      });
    }));
  });

  describe('Recent Items', () => {
    it('should select recent item in single mode', () => {
      component.config.multiple = false;
      component.recentItems.set([mockData[0]]);
      fixture.detectChanges();

      const recentChip = fixture.debugElement.query(By.css('.recent-chip'));
      recentChip.nativeElement.click();

      expect(component.selectionControl.value).toEqual(mockData[0]);
      expect(mockContext.completeWith).toHaveBeenCalled();
    });

    it('should toggle recent item in multiple mode', () => {
      component.config.multiple = true;
      component.recentItems.set([mockData[0]]);
      fixture.detectChanges();

      const recentChip = fixture.debugElement.query(By.css('.recent-chip'));
      recentChip.nativeElement.click();

      expect(component.isItemSelected(mockData[0])).toBe(true);
    });

    it('should save recent items on confirm', () => {
      component.selectionControl.setValue(mockData[0]);
      component.confirm();

      const saved = localStorage.getItem('recent-users');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed[0]).toEqual(mockData[0]);
    });

    it('should limit recent items to maxRecentItems', () => {
      component.config.maxRecentItems = 2;

      // Add 3 items
      component.selectionControl.setValue(mockData[0]);
      component.confirm();

      component.selectionControl.setValue(mockData[1]);
      component.confirm();

      component.selectionControl.setValue(mockData[2]);
      component.confirm();

      const saved = localStorage.getItem('recent-users');
      const parsed = JSON.parse(saved!);
      expect(parsed.length).toBe(2);
      expect(parsed[0]).toEqual(mockData[2]); // Most recent first
    });
  });

  describe('Cancel Functionality', () => {
    it('should complete with null on cancel', () => {
      component.cancel();

      expect(mockContext.completeWith).toHaveBeenCalledWith({
        selected: null,
      });
    });

    it('should trigger cancel when close button is clicked', () => {
      jest.spyOn(component, 'cancel');
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.close-button'));
      closeButton.nativeElement.click();

      expect(component.cancel).toHaveBeenCalled();
    });
  });

  describe('Helper Methods', () => {
    it('should get item ID correctly', () => {
      expect(component.getItemId(mockData[0])).toBe(mockData[0].id);

      const itemWithoutId = { name: 'Test' };
      expect(component.getItemId(itemWithoutId)).toBe(JSON.stringify(itemWithoutId));
    });

    it('should get result display text', () => {
      expect(component.getResultDisplay(mockData[0])).toBe('Super');

      const itemWithTitle = { id: '1', title: 'My Title' };
      expect(component.getResultDisplay(itemWithTitle)).toBe('My Title');

      const itemWithLabel = { id: '1', label: 'My Label' };
      expect(component.getResultDisplay(itemWithLabel)).toBe('My Label');
    });

    it('should get result subtitle', () => {
      const itemWithNameAndEmail = { name: 'John', email: 'john@example.com' };
      expect(component.getResultSubtitle(itemWithNameAndEmail)).toBe('john@example.com');

      const itemWithNameAndCode = { name: 'Product', code: 'PRD-001' };
      expect(component.getResultSubtitle(itemWithNameAndCode)).toBe('Code: PRD-001');

      const itemWithRole = { name: 'User', role: 'Admin' };
      expect(component.getResultSubtitle(itemWithRole)).toBe('Admin');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data array', fakeAsync(() => {
      component.config.data = [];
      component.searchControl.setValue('test');
      tick(300);

      expect(component.searchResults()).toEqual([]);
    }));

    it('should handle null/undefined in searchable columns', fakeAsync(() => {
      const dataWithNull = [
        { id: '1', name: null, email: 'test@example.com' },
        { id: '2', name: 'John', email: null },
      ];
      component.config.data = dataWithNull;

      component.searchControl.setValue('john');
      tick(300);

      expect(component.searchResults().length).toBe(1);
      expect(component.searchResults()[0].id).toBe('2');
    }));

    it('should handle localStorage errors gracefully', () => {
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      jest.spyOn(console, 'error').mockImplementation();

      fixture = TestBed.createComponent(GenericSearchModalComponent);
      component = fixture.componentInstance;

      expect(console.error).toHaveBeenCalled();
      expect(component.recentItems()).toEqual([]);
    });
  });
});
