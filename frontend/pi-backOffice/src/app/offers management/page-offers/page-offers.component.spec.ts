import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOffersComponent } from './page-offers.component';

describe('PageOffersComponent', () => {
  let component: PageOffersComponent;
  let fixture: ComponentFixture<PageOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageOffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
