import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldDevisBySocietyComponent } from './old-devis-by-society.component';

describe('OldDevisBySocietyComponent', () => {
  let component: OldDevisBySocietyComponent;
  let fixture: ComponentFixture<OldDevisBySocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldDevisBySocietyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldDevisBySocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
