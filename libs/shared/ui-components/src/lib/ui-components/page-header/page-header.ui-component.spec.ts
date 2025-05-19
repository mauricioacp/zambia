import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderUiComponent } from './page-header.ui-component';

describe('PageHeaderUiComponent', () => {
  let component: PageHeaderUiComponent;
  let fixture: ComponentFixture<PageHeaderUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
