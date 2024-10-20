import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizedPackComponent } from './personalized-pack.component';

describe('PersonalizedPackComponent', () => {
  let component: PersonalizedPackComponent;
  let fixture: ComponentFixture<PersonalizedPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizedPackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalizedPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
