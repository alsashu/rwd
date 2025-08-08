import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiCommentPanelComponent } from './wiki-comment-panel.component';

describe('WikiCommentPanelComponent', () => {
  let component: WikiCommentPanelComponent;
  let fixture: ComponentFixture<WikiCommentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikiCommentPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikiCommentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
