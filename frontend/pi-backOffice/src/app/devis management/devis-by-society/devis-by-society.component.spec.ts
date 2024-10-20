import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisBySocietyComponent } from './devis-by-society.component';

describe('DevisBySocietyComponent', () => {
  let component: DevisBySocietyComponent;
  let fixture: ComponentFixture<DevisBySocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevisBySocietyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisBySocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
