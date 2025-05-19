import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainSidebarNavItemUiComponent } from './main-sidebar-nav-item.ui-component';

describe('MainSidebarNavItemUiComponent', () => {
  let component: MainSidebarNavItemUiComponent;
  let fixture: ComponentFixture<MainSidebarNavItemUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSidebarNavItemUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainSidebarNavItemUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
