import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCandidatComponent } from './detail-candidat.component';

describe('DetailCandidatComponent', () => {
  let component: DetailCandidatComponent;
  let fixture: ComponentFixture<DetailCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCandidatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
