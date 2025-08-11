export interface ICommand {
  key: string;
  canExecute(): boolean;
  execute(): boolean;
  undo();
  redo();
  getDescription(): string;
  getOptions(): any;
}
