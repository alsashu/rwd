import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeTableComponent } from './tree-table.component';

describe('TreeTableComponent', () => {
  let component: TreeTableComponent;
  let fixture: ComponentFixture<TreeTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
