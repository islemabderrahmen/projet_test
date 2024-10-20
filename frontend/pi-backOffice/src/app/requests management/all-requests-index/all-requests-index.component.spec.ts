import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRequestsIndexComponent } from './all-requests-index.component';

describe('AllRequestsIndexComponent', () => {
  let component: AllRequestsIndexComponent;
  let fixture: ComponentFixture<AllRequestsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRequestsIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRequestsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
