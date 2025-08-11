import { ModelService } from "./model.service";

export class ModelUtils {
  // Circular properties
  private defaultExcludedPropertyList = [
    "refObject",
    //"parent",
    "svgObject",
  ];

  constructor(private modelService: ModelService) {}

  // public getDefaultRootObject(): any {
  //   return this.modelService
  //     ? this.modelService.selectedVersion
  //       ? this.modelService.selectedVersion
  //       : this.modelService.model
  //     : null;
  // }

  // ForEach / Find / (Filter)
  public forEachCB(o: any, cb: any, propertyList: string[] = null, excludedPropertyList: string[] = []): any {
    // o = o ? o : this.getDefaultRootObject();
    if (cb) {
      cb(o);
      for (const propertyName in o) {
        if (
          (!propertyList || propertyList.includes(propertyName)) &&
          !this.defaultExcludedPropertyList.includes(propertyName) &&
          !excludedPropertyList.includes(propertyName)
        ) {
          const property = o[propertyName];
          if (property && typeof property !== "undefined") {
            if (property.forEach) {
              property.forEach((child: any) => {
                this.forEachCB(child, cb, propertyList, excludedPropertyList);
              });
            } else if (typeof property === "object") {
              this.forEachCB(property, cb, propertyList, excludedPropertyList);
            }
          }
        }
      }
    }
    return o;
  }

  public findCB(o: any, cb: any, propertyList: string[] = null, excludedPropertyList: string[] = []): any {
    let res = null;
    // o = o ? o : this.getDefaultRootObject();
    if (cb) {
      res = cb(o) ? o : null;
      if (!res && o) {
        for (const propertyName in o) {
          if (
            (!propertyList || propertyList.includes(propertyName)) &&
            !this.defaultExcludedPropertyList.includes(propertyName) &&
            !excludedPropertyList.includes(propertyName)
          ) {
            const property = o[propertyName];
            if (property && typeof property !== "undefined") {
              if (property.forEach) {
                property.forEach((child: any) => {
                  if (!res) {
                    res = this.findCB(child, cb, propertyList, excludedPropertyList);
                  }
                });
              } else if (typeof property === "object") {
                if (!res) {
                  res = this.findCB(property, cb, propertyList, excludedPropertyList);
                }
              }
            }
          }
        }
      }
    }
    return res;
  }

  public filterCB(o: any, cb: any, propertyList: string[] = null, excludedPropertyList: string[] = []): any {
    let res = [];
    // o = o ? o : this.getDefaultRootObject();
    if (cb) {
      if (cb(o)) {
        res.push(o);
      }
      if (!res && o) {
        for (const propertyName in o) {
          if (
            (!propertyList || propertyList.includes(propertyName)) &&
            !this.defaultExcludedPropertyList.includes(propertyName) &&
            !excludedPropertyList.includes(propertyName)
          ) {
            const property = o[propertyName];
            if (property && typeof property !== "undefined") {
              if (property.forEach) {
                property.forEach((child: any) => {
                  if (this.filterCB(child, cb, propertyList, excludedPropertyList)) {
                    res.push(child);
                  }
                });
              } else if (typeof property === "object") {
                if (this.filterCB(property, cb, propertyList, excludedPropertyList)) {
                  res.push(property);
                }
              }
            }
          }
        }
      }
    }
    return res;
  }
}
