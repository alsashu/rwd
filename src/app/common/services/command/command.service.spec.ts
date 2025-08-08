import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { IServicesService } from "src/app/services/services/iservices.service";
import { ServicesConst } from "src/app/services/services/services.const";
import { ServicesFactory } from "src/app/services/services/services.factory";
import { ServicesService } from "src/app/services/services/services.service";
import { ICommandService } from "./command.service";
import { CallbackCommand } from "./commands/callback.cmd";
import { ICommand } from "./commands/icommand";

describe("CommandService", () => {
  let servicesService: IServicesService;
  let commandService: ICommandService;
  let testCommand1: ICommand;
  let testCommand2: ICommand;
  let executionResult = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ServicesService],
    }).compileComponents();
    servicesService = TestBed.get(ServicesService);
    new ServicesFactory().buildOffLineServicesForTest(servicesService);
    commandService = servicesService.getService(ServicesConst.CommandService) as ICommandService;

    testCommand1 = new CallbackCommand(
      "testCommand1",
      (command: ICommand) => {
        executionResult = true;
        return true;
      },
      (command: ICommand) => {
        executionResult = false;
      }
    );
    testCommand2 = new CallbackCommand(
      "testCommand2",
      (command: ICommand) => {
        executionResult = true;
        return false;
      },
      (command: ICommand) => {
        executionResult = false;
      }
    );
  });

  it("should be created", () => {
    expect(commandService).toBeTruthy();
  });

  it("should execute a command", () => {
    commandService.execute(testCommand1);
    expect(executionResult).toBeTruthy();
  });

  it("should execute a command and do not undo it", () => {
    commandService.execute(testCommand2);
    expect(executionResult).toBeTruthy();
    expect(commandService.canUndo()).toBeFalsy();
    commandService.undo();
    expect(executionResult).toBeTruthy();
  });

  it("should execute and undo a command", () => {
    expect(commandService.canUndo()).toBeFalsy();
    commandService.execute(testCommand1);
    expect(executionResult).toBeTruthy();
    expect(commandService.canUndo()).toBeTruthy();
    commandService.undo();
    expect(executionResult).toBeFalsy();
    expect(commandService.canUndo()).toBeFalsy();
  });

  it("should execute, undo and redo a command", () => {
    expect(commandService.canRedo()).toBeFalsy();
    commandService.execute(testCommand1);
    expect(executionResult).toBeTruthy();
    expect(commandService.canRedo()).toBeFalsy();
    commandService.undo();
    expect(executionResult).toBeFalsy();
    expect(commandService.canRedo()).toBeTruthy();
    commandService.redo();
    expect(executionResult).toBeTruthy();
    expect(commandService.canRedo()).toBeFalsy();
    expect(commandService.canUndo()).toBeTruthy();
  });
});
