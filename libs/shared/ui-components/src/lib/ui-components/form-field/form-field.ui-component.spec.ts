import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldUiComponent } from './form-field.ui-component';

describe('FormFieldUiComponent', () => {
  let component: FormFieldUiComponent;
  let fixture: ComponentFixture<FormFieldUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
