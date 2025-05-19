import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarHeaderUiComponent } from './sidebar-header.ui-component';

describe('SidebarHeaderUiComponent', () => {
  let component: SidebarHeaderUiComponent;
  let fixture: ComponentFixture<SidebarHeaderUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarHeaderUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarHeaderUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
