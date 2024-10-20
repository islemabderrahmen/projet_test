import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOfferComponent } from './filter-offer.component';

describe('FilterOfferComponent', () => {
  let component: FilterOfferComponent;
  let fixture: ComponentFixture<FilterOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
