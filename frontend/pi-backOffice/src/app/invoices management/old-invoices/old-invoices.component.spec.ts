import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OldInvoicesComponent } from './old-invoices.component';

describe('OldInvoicesComponent', () => {
  let component: OldInvoicesComponent;
  let fixture: ComponentFixture<OldInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldInvoicesComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
