import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShellSmartComponent } from './shell.smart-component';

describe('ShellSmartComponent', () => {
  let component: ShellSmartComponent;
  let fixture: ComponentFixture<ShellSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellSmartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
