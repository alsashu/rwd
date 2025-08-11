import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericToolBarComponent } from './generic-tool-bar.component';

describe('GenericToolBarComponent', () => {
  let component: GenericToolBarComponent;
  let fixture: ComponentFixture<GenericToolBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
