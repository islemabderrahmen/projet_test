import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewValiderComponent } from './interview-valider.component';

describe('InterviewValiderComponent', () => {
  let component: InterviewValiderComponent;
  let fixture: ComponentFixture<InterviewValiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewValiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewValiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
