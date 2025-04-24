import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgreementsSmartComponent } from './agreements.smart-component';

describe('AgreementsSmartComponent', () => {
  let component: AgreementsSmartComponent;
  let fixture: ComponentFixture<AgreementsSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgreementsSmartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgreementsSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
