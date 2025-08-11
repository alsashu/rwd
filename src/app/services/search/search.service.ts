import { ModelConstService } from "../model/model-const.service";
import { ModelService } from "../model/model.service";
import { ModelVisitor } from "../model/model.visitor";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";

/**
 * Interface of search data
 */
export interface ISearchData {
  searchString: string;
  options: {
    caseSensitive?: boolean;
    namesOrPropertiesOnly?: boolean;
    filterObjectType?: string;
    filterPropertyName?: string;
  };
}

/**
 * Interface of the search service
 */
export interface ISearchService {
  searchResults: any[];
  search(searchData: ISearchData): any[];
}

/**
 * Search service
 */
export class SearchService implements ISearchService {
  public searchResults: any[] = [];
  private modelService: ModelService;

  /**
   * Constructor
   * @param servicesService The services service
   */
  constructor(private servicesService: IServicesService) {
    this.modelService = this.servicesService.getService(ServicesConst.ModelService) as ModelService;
  }

  /**
   * Service init
   */
  public initService() {
    // console.log("SearchService.init");
  }

  /**
   * Execute a search on the model or selected project
   * @param searchData The search data
   * @returns The search results
   */
  public search(searchData: ISearchData): any[] {
    this.searchResults = this.searchInObject(searchData);
    return this.searchResults || [];
  }

  /**
   * Search recursively in an object
   * @param searchData The search data
   * @param rootObject The root object
   * @returns The search results
   */
  private searchInObject(searchData: ISearchData, rootObject: any = null): any[] {
    const res = [];
    let mainTag = null;
    if (!rootObject) {
      rootObject = this.modelService.getSelectedProject();
    }
    if (!rootObject) {
      rootObject = this.modelService.getModel();
    }
    const options = searchData.options;

    new ModelVisitor().forEachCB(rootObject, (o: any, parent: any, parentTypeName: string) => {
      if (o) {
        if (parent && parent.type === ModelConstService.PROJECT_TYPE) {
          mainTag = o;
        } else {
          const searchRules = [];

          let filterOK = true;
          if (options && options.filterObjectType && options.filterObjectType !== "*") {
            if (!o.type || !o.type.toUpperCase || o.type.toUpperCase() !== options.filterObjectType.toUpperCase()) {
              filterOK = false;
            }
          }
          if (filterOK) {
            if (options && options.filterPropertyName && options.filterPropertyName.length > 0) {
              if (this.testAttribute(o, options.filterPropertyName, searchData.searchString, searchData.options)) {
                searchRules.push({ ruleType: "property-search-rule", propertyName: options.filterPropertyName });
              }
            } else {
              if (this.testAttribute(o, "type", searchData.searchString, searchData.options)) {
                searchRules.push({ ruleType: "type-search-rule" });
              }
              if (this.testAttribute(o, "label", searchData.searchString, searchData.options)) {
                searchRules.push({ ruleType: "property-search-rule", propertyName: "label" });
              }
              if (this.testAttribute(o, "name", searchData.searchString, searchData.options)) {
                searchRules.push({ ruleType: "property-search-rule", propertyName: "name" });
              }
              if (this.testAttribute(o, "id", searchData.searchString, searchData.options)) {
                searchRules.push({ ruleType: "id-search-rule" });
              }
            }

            if (searchRules.length) {
              res.push({
                type: "searchResult",
                label: o.label,
                id: "sr-" + o.id,
                foundObject: o,
                mainTag,
                searchRules,
              });
            }
          }
        }
      }
    });
    return res;
  }

  /**
   * Test if an object attribute matches a search
   * @param o The object
   * @param attributeName The attribute name
   * @param searchString The search string value
   * @param options The options
   * @returns Boolean value
   */
  private testAttribute(o: any, attributeName: string, searchString: string, options: any): boolean {
    return o && o[attributeName] && o[attributeName].indexOf
      ? this.testValue(o[attributeName], searchString, options)
      : false;
  }

  /**
   * Test if a value matches a search
   * @param value The value
   * @param searchString The search string value
   * @param options The options
   * @returns Boolean value
   */
  private testValue(value: string, searchString: string, options: any): boolean {
    if (value && searchString) {
      let theValue = value;
      let theSearchString = searchString;
      if (options && options.caseSensitive === false) {
        theValue = theValue.toUpperCase();
        theSearchString = theSearchString.toUpperCase();
      }
      // return theValue.indexOf(theSearchString) > -1;
      return this.matchRule(theValue, theSearchString);
    }
    return false;
  }

  /**
   *  Checks match a string to a rule
   * Rule allows * as zero to unlimited numbers and ? as zero to one character
   * @param str The string value
   * @param rule The rule
   * @returns Boolean value
   */
  private matchRule(str: string, rule: string): boolean {
    const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + this.replaceHelper(rule, { "*": ".*", "?": ".?" }, escapeRegex) + "$").test(str);
  }

  /**
   * Replace helper for matchRule function
   * @param input
   * @param replace_dict
   * @param last_map
   * @returns
   */
  private replaceHelper(input: string, replace_dict: any, last_map: any): string {
    if (Object.keys(replace_dict).length === 0) {
      return last_map(input);
    }
    const split_by = Object.keys(replace_dict)[0];
    const replace_with = replace_dict[split_by];
    delete replace_dict[split_by];
    return input
      .split(split_by)
      .map((next_input) => this.replaceHelper(next_input, replace_dict, last_map))
      .join(replace_with);
  }
}
