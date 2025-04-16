import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageFooterUiComponent } from './footer.ui-component';

describe('PageFooterUiComponent', () => {
  let component: PageFooterUiComponent;
  let fixture: ComponentFixture<PageFooterUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFooterUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFooterUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
