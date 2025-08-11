import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProjectModalComponent } from './upload-project-modal.component';

describe('UploadProjectModalComponent', () => {
  let component: UploadProjectModalComponent;
  let fixture: ComponentFixture<UploadProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProjectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
