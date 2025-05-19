import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarMiniUiComponent } from './sidebar-mini.ui-component';

describe('SidebarMiniUiComponent', () => {
  let component: SidebarMiniUiComponent;
  let fixture: ComponentFixture<SidebarMiniUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMiniUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarMiniUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
