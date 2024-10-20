import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexOffersComponent } from './index-offers.component';

describe('IndexOffersComponent', () => {
  let component: IndexOffersComponent;
  let fixture: ComponentFixture<IndexOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexOffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
