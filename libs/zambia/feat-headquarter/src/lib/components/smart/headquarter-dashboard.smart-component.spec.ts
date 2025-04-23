import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeadquarterDashboardSmartComponent } from './headquarter-dashboard.smart-component';

describe('HeadquarterDashboardSmartComponent', () => {
  let component: HeadquarterDashboardSmartComponent;
  let fixture: ComponentFixture<HeadquarterDashboardSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadquarterDashboardSmartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadquarterDashboardSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
