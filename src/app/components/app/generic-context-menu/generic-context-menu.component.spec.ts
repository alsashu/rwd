import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContextMenuModule, ContextMenuService } from "ngx-contextmenu";

import { GenericContextMenuComponent } from "./generic-context-menu.component";

describe("GenericContextMenuComponent", () => {
  let component: GenericContextMenuComponent;
  let fixture: ComponentFixture<GenericContextMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericContextMenuComponent],
      imports: [
        ContextMenuModule.forRoot({
          useBootstrap4: true,
        }),
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
