/**
 * Interface of Rule class
 */
export interface IRule {
  label: string;
  ruleEngine: string;
  fileName: string;
  libraryObject: any;
}

/**
 * Rule class
 */
export class Rule implements IRule {
  public static RULE_ENGINE_CS = "cs";
  public static RULE_ENGINE_PYTHON = "py";

  public type: string;
  public label: string;
  public fileName: string;
  public filePath: string;
  public ruleEngine: string = Rule.RULE_ENGINE_CS;
  public libraryObject = null;

  /**
   * Construtor
   * @param label The label
   * @param fileName The file name
   * @param ruleEngine The rule engine type
   */
  constructor(label: string, fileName: string, ruleEngine: string = Rule.RULE_ENGINE_CS) {
    this.type = "rule";
    this.label = label;
    this.fileName = fileName;
    this.filePath = "";
    this.ruleEngine = ruleEngine;
  }
}
