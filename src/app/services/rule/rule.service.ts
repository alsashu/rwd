import { ISelectionService } from "src/app/common/services/selection/selection.service";
import { IMvcService } from "../mvc/imvc.service";
import { MvcConst } from "../mvc/mvc.const";
import { ICsRuleEngineService } from "../rule-engine/cs-rule-engine.service";
import { IPythonRuleEngineService } from "../rule-engine/pyton-rule-engine.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { IRule, Rule } from "./rule";

/**
 * Interface of the RuleService
 */
export interface IRuleService {
  rules: IRule[];
  log: string;
  logData: any;
  reset();
  executeTheRules();
  deleteTheRules();
  deleteTheSelectedRules();
  insertRuleFromLibrary(libraryObject: any, afterRule: any): any;
  moveRule(rule: any, afterRule: any);
  getRuleByLabel(label: string): Rule;
}

/**
 * Rule service
 */
export class RuleService implements IRuleService {
  public rules: IRule[] = [];
  public log: string;
  public logData: { log: string; ruleEngineLog: any; ruleLog: any; error?: string };

  private csRuleEngineService: ICsRuleEngineService;
  private pytonRuleEngineService: IPythonRuleEngineService;
  private mvcService: IMvcService;
  private selectionService: ISelectionService;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(public servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.csRuleEngineService = this.servicesService.getService(
      ServicesConst.CsRuleEngineService
    ) as ICsRuleEngineService;
    this.pytonRuleEngineService = this.servicesService.getService(
      ServicesConst.PythonRuleEngineService
    ) as IPythonRuleEngineService;
    this.mvcService = this.servicesService.getService(ServicesConst.MvcService) as IMvcService;
    this.selectionService = this.servicesService.getService(ServicesConst.SelectionService) as ISelectionService;

    this.mvcService.mvcEvent.subscribe((message: any) => {
      if ([MvcConst.MSG_PROJECT_CLOSED].includes(message.type)) {
        this.reset();
      } else if (
        [MvcConst.MSG_CS_RULE_ENGINE_LOG_CHANGED, MvcConst.MSG_PY_RULE_ENGINE_LOG_CHANGED].includes(message.type)
      ) {
        this.log = message.log;
        this.logData = message.logData;
      }
    });
  }

  /**
   * Reset
   */
  public reset() {
    this.deleteTheRules();
    this.log = "";
    this.logData = { log: "", ruleEngineLog: [], ruleLog: [], error: "" };
  }

  /**
   * Execute the rules
   */
  public executeTheRules() {
    if (this.rules.length) {
      if (this.rules[0].ruleEngine === Rule.RULE_ENGINE_CS) {
        this.csRuleEngineService.executeRules(this.rules);
      } else if (this.rules[0].ruleEngine === Rule.RULE_ENGINE_PYTHON) {
        this.pytonRuleEngineService.executeRules(this.rules);
      }
    }
  }

  /**
   * Delete the rules
   */
  public deleteTheRules() {
    this.rules = [];
    this.notifyRulesChange();
  }

  /**
   * Delete the selected rules
   */
  public deleteTheSelectedRules() {
    const so = this.selectionService.getSelectedObjects().filter((o: any) => o.type === "rule");
    so.forEach((rule: any) => {
      const index = this.rules.indexOf(rule);
      if (index > -1) {
        this.rules.splice(index, 1);
      }
    });
    this.notifyRulesChange();
  }

  /**
   * Notify that rule list has changes
   */
  private notifyRulesChange() {
    this.mvcService.emit({ type: MvcConst.MSG_RULE_LIST_CHANGED });
  }

  /**
   * Recusively create rules from library
   * @param lo Library object
   * @returns The list of created rules
   */
  public buildRulesFromLibraryObjectRec(lo: any): Rule[] {
    let rules: Rule[] = [];
    if (lo) {
      if (lo.type === "library-folder") {
        lo.libraryObjects.forEach((clo: any) => {
          rules = rules.concat(this.buildRulesFromLibraryObjectRec(clo));
        });
      } else if (lo.type === "rule-prototype") {
        const rule = this.buildRuleFromLibraryObject(lo);
        if (rule) {
          rules.push(rule);
        }
      }
    }
    return rules;
  }

  /**
   * Build a rule from the libray
   * @param lo The library object
   * @returns The new rule
   */
  public buildRuleFromLibraryObject(lo: any): Rule {
    let rule = null;
    if (lo && lo.type === "rule-prototype") {
      rule = new Rule(lo.label, lo.fileName);
      rule.libraryObject = lo;

      // helpId, helpHtml, description...
      for (const p of ["fileName", "filePath", "ruleEngine"]) {
        if (lo[p] !== undefined) {
          rule[p] = lo[p];
        }
      }
    }
    return rule;
  }

  /**
   * Insert a rule from library
   * @param libraryObject The library object
   * @param afterRule The rule to insert after, can be null
   * @returns The new rule
   */
  public insertRuleFromLibrary(libraryObject: any, afterRule: any): any {
    // TODO prohibit the addition of heterogeneous rules cs/py
    const rule = this.buildRuleFromLibraryObject(libraryObject);
    if (rule) {
      const index = afterRule ? this.rules.indexOf(afterRule) : -1;
      if (index > -1) {
        this.rules.splice(index, 0, rule);
      } else {
        this.rules.push(rule);
      }
      this.notifyRulesChange();
    }
    return rule;
  }

  /**
   * Get a rule from its label
   * @param label The label
   * @returns The found rule
   */
  public getRuleByLabel(label: string): Rule {
    return this.rules.find((r: any) => r.label === label) as Rule;
  }

  /**
   * Move rule in the list
   * @param rule The rule
   * @param afterRule The rule to be after
   */
  public moveRule(rule: any, afterRule: any) {
    const iRule = this.rules.indexOf(rule);
    const iTargetRule = this.rules.indexOf(afterRule);
    if (iRule > -1 && iTargetRule > -1) {
      if (Math.abs(iRule - iTargetRule) === 1) {
        this.rules[iRule] = afterRule;
        this.rules[iTargetRule] = rule;
      } else {
        this.rules.splice(iTargetRule, 0, this.rules.splice(iRule, 1)[0]);
      }
      this.notifyRulesChange();
    }
  }
}
