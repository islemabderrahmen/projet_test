import { ComponentFixture, TestBed } from '@angular/core/testing';


import { MyOldInvoicesComponent } from './my-old-invoices.component';

describe('MyOldInvoicesComponent', () => {
  let component: MyOldInvoicesComponent;
  let fixture: ComponentFixture<MyOldInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOldInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOldInvoicesComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
