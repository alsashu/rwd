import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTreeItemComponent } from './equipment-tree-item.component';

describe('EquipmentTreeItemComponent', () => {
  let component: EquipmentTreeItemComponent;
  let fixture: ComponentFixture<EquipmentTreeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentTreeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
