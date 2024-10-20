import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPacksComponent } from './forum-packs.component';

describe('ForumPacksComponent', () => {
  let component: ForumPacksComponent;
  let fixture: ComponentFixture<ForumPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumPacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
