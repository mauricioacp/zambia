import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandUiComponent } from './brand.ui-component';

describe('BrandUiComponent', () => {
  let component: BrandUiComponent;
  let fixture: ComponentFixture<BrandUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
