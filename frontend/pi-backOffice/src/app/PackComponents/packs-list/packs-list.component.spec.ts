import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksListComponent } from './packs-list.component';

describe('PacksListComponent', () => {
  let component: PacksListComponent;
  let fixture: ComponentFixture<PacksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacksListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
