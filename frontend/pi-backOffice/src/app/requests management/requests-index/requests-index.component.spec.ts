import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsIndexComponent } from './requests-index.component';

describe('RequestsIndexComponent', () => {
  let component: RequestsIndexComponent;
  let fixture: ComponentFixture<RequestsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
