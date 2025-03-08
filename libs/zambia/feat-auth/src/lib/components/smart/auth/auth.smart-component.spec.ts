import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthSmartComponent } from './auth.smart-component';

describe('AuthSmartComponent', () => {
  let component: AuthSmartComponent;
  let fixture: ComponentFixture<AuthSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSmartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
