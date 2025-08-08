export class ModelVisitor {
  // Circular properties
  private defaultExcludedPropertyList = ["refObject", "svgObject"];

  public visitObject(o: any, propertyList: string[], cb: any): any {
    return this.visitObjectRec(o, null, null, {}, propertyList, cb);
  }

  private visitObjectRec(
    o: any,
    parent: any,
    parentTypeName: string,
    context: any,
    propertyList: string[],
    cb: any
  ): any {
    let res = null;
    if (o) {
      if (cb) {
        res = cb(o, parent, parentTypeName, context);
      }
      if (o != null && (!res || (res && res.skip === false))) {
        // tslint:disable-next-line: forin
        for (const propertyName in o) {
          if (
            (!propertyList || propertyList.includes(propertyName)) &&
            !this.defaultExcludedPropertyList.includes(propertyName)
          ) {
            const property = o[propertyName];
            if (property && typeof property !== "undefined") {
              if (property.forEach) {
                property.forEach((child: any) => {
                  if (!res || (res && res.skip === false)) {
                    res = this.visitObjectRec(child, o, propertyName, context, propertyList, cb);
                  }
                });
              } else if (typeof property === "object") {
                if (!res || (res && res.skip === false)) {
                  res = this.visitObjectRec(property, o, propertyName, context, propertyList, cb);
                }
              }
            }
          }
        }
      }
    }
    return res && res.result !== undefined ? res.result : res;
  }

  // ForEach / Find / (Filter)
  public forEachCB(o: any, cb: any, propertyList: string[] = null, excludedPropertyList: string[] = []) {
    this.forEachCBRec(o, cb, propertyList, excludedPropertyList);
  }

  private forEachCBRec(
    o: any,
    cb: any,
    propertyList: string[] = null,
    excludedPropertyList: string[] = [],
    parent: any = null,
    parentTypeName: string = null
  ) {
    if (cb) {
      cb(o, parent, parentTypeName);
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
                this.forEachCBRec(child, cb, propertyList, excludedPropertyList, o, propertyName);
              });
            } else if (typeof property === "object") {
              this.forEachCBRec(property, cb, propertyList, excludedPropertyList, o, propertyName);
            }
          }
        }
      }
    }
    return o;
  }

  public findCB(o: any, cb: any, propertyList: string[] = null, excludedPropertyList: string[] = []): any {
    return this.findCBRec(o, cb, propertyList, excludedPropertyList);
  }

  public findCBRec(
    o: any,
    cb: any,
    propertyList: string[] = null,
    excludedPropertyList: string[] = [],
    parent: any = null,
    parentTypeName: string = null
  ): any {
    let res = null;
    if (cb) {
      res = cb(o, parent, parentTypeName) ? o : null;
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
                    res = this.findCBRec(child, cb, propertyList, excludedPropertyList, o, propertyName);
                  }
                });
              } else if (typeof property === "object") {
                if (!res) {
                  res = this.findCBRec(property, cb, propertyList, excludedPropertyList, o, propertyName);
                }
              }
            }
          }
        }
      }
    }
    return res;
  }

  public filterCB(o: any, cb: any, propertyList: string[] = null, excludedPropertyList: string[] = []): any[] {
    return this.filterCBRec(o, cb, null, propertyList, excludedPropertyList);
    // return this.filterCBRec(o, cb, null, propertyList, ["GenericADM:typicalITFDiagram"]);
  }

  public filterCBRec(
    o: any,
    cb: any,
    context: any,
    propertyList: string[] = null,
    excludedPropertyList: string[] = [],
    parent: any = null,
    parentTypeName: string = null
  ): any[] {
    let res = [];
    if (!context) {
      context = {
        objectsStack: [],
      };
    }
    context.objectsStack.push(o);

    if (cb) {
      if (cb(o, parent, parentTypeName)) {
        res.push(o);
      }
      if (o) {
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
                  res = res.concat(
                    this.filterCBRec(child, cb, context, propertyList, excludedPropertyList, o, propertyName)
                  );
                });
              } else if (typeof property === "object") {
                res = res.concat(
                  this.filterCBRec(property, cb, context, propertyList, excludedPropertyList, o, propertyName)
                );
              }
            }
          }
        }
      }
    }

    context.objectsStack.pop();

    return res;
  }
}
