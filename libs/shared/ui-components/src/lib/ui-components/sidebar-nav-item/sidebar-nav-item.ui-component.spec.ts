import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarNavItemUiComponent } from './sidebar-nav-item.ui-component';

describe('SidebarNavItemUiComponent', () => {
  let component: SidebarNavItemUiComponent;
  let fixture: ComponentFixture<SidebarNavItemUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavItemUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavItemUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
