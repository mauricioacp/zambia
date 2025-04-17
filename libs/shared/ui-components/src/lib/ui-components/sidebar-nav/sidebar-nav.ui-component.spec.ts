import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarNavUiComponent } from './sidebar-nav.ui-component';

describe('SidebarNavUiComponent', () => {
  let component: SidebarNavUiComponent;
  let fixture: ComponentFixture<SidebarNavUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
