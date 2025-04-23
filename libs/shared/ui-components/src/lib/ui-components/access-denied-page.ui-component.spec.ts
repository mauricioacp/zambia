import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessDeniedPageUiComponent } from './access-denied-page.ui-component';

describe('AccessDeniedPageUiComponent', () => {
  let component: AccessDeniedPageUiComponent;
  let fixture: ComponentFixture<AccessDeniedPageUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessDeniedPageUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedPageUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
