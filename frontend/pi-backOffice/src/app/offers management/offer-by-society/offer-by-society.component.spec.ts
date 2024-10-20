import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferBySocietyComponent } from './offer-by-society.component';

describe('OfferBySocietyComponent', () => {
  let component: OfferBySocietyComponent;
  let fixture: ComponentFixture<OfferBySocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferBySocietyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferBySocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
