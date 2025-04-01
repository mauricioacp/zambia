import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSmartComponent } from './dashboard.smart-component';

describe('DashboardSmartComponent', () => {
  let component: DashboardSmartComponent;
  let fixture: ComponentFixture<DashboardSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSmartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
