import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldRequestsComponent } from './old-requests.component';

describe('OldRequestsComponent', () => {
  let component: OldRequestsComponent;
  let fixture: ComponentFixture<OldRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
