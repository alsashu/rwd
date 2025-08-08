import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericTreeComponent } from './generic-tree.component';

describe('GenericTreeComponent', () => {
  let component: GenericTreeComponent;
  let fixture: ComponentFixture<GenericTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
