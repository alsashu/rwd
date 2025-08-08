export interface ICommand {
  execute();
  canExecute(): boolean;
  undo();
  redo();
  getDescription();
  getOptions();
}
