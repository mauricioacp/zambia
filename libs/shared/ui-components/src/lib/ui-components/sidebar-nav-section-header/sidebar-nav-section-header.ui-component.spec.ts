import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarNavSectionHeaderUiComponent } from './sidebar-nav-section-header.ui-component';

describe('SidebarNavSectionHeaderUiComponent', () => {
  let component: SidebarNavSectionHeaderUiComponent;
  let fixture: ComponentFixture<SidebarNavSectionHeaderUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavSectionHeaderUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavSectionHeaderUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
