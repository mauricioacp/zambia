import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageContainerUiComponent } from './page-container.ui-component';

describe('PageContainerUiComponent', () => {
  let component: PageContainerUiComponent;
  let fixture: ComponentFixture<PageContainerUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContainerUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageContainerUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
