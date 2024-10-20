import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterIndexComponent } from './footer-index.component';

describe('FooterIndexComponent', () => {
  let component: FooterIndexComponent;
  let fixture: ComponentFixture<FooterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
