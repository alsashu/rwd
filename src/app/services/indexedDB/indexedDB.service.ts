import { IServicesService } from "../services/iservices.service";
import { EventEmitter } from "@angular/core";

/**
 * Interface of IndexedDBService
 */
export interface IIndexedDBService {
  eventEmitter: EventEmitter<any>;
  isConnected(): boolean;
  storeObject(key: string, data: any);
  loadObject(key: string): any;
  getSavedProjectsIds(cb?: any);
  getDirtyProjectsIds(cb?: any);
  clearIndexedDB();
  delete(key: string);
  deleteAll();
  getKeysIncluding(stringList: string[], cb?: any);
}

/**
 * Service for using window.indexedDB (index data base)
 */
export class IndexedDBService implements IIndexedDBService {
  private dbName = "right-viewer-indexeddb";
  private dbVersion = 1;
  private db: any = null;

  public eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Constructor
   * @param serviceService
   */
  constructor(public serviceService: IServicesService) {}

  /**
   * Servie init
   */
  public initService() {
    this.initIndexedDB();
  }

  /**
   * Test if connected to index db
   * @returns
   */
  public isConnected(): boolean {
    return this.db !== null;
  }

  /**
   * Init initIndexed data base
   */
  private initIndexedDB() {
    const request = window.indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: any) => {
      this.db = event.target["result"];
      this.db.createObjectStore("data", { keyPath: "key" });
    };

    request.onsuccess = (event: any) => {
      this.db = event.target["result"];
      this.eventEmitter.emit({ status: "IndexedDbConnected" });
    };
  }

  /**
   * List index db keys
   */
  private listIndexDb() {
    console.log("listIndexDb:");
    if (this.db) {
      const transaction = this.db.transaction(["data"]);
      const store = transaction.objectStore("data");
      store.openCursor().onsuccess = (event: any) => {
        var cursor = event.target.result;
        if (cursor) {
          console.log("IndexedDB item key:", cursor.key);
          cursor.continue();
        }
      };
    }
  }

  /**
   * Get the list ids of projects saved in indexed db
   * @param cb
   */
  public getSavedProjectsIds(cb: any = null) {
    this.getKeysIncluding(["project/?id="], (keys: string[]) => {
      const res = [];
      keys.forEach((key: string) => {
        const id = key.split("=").pop();
        res.push(id);
      });
      if (cb) {
        cb(res);
      }
    });
  }

  /**
   * Get the list ids of dirty projects saved in indexed db
   * @param cb
   */
  public getDirtyProjectsIds(cb: any = null) {
    this.getKeysIncluding(["isDirty//?id="], (keys: string[]) => {
      const res = [];
      keys.forEach((key: string) => {
        const id = key.split("=").pop();
        res.push(id);
      });
      if (cb) {
        cb(res);
      }
    });
  }

  /**
   * Store object to DB
   * @param key Key
   * @param data Data
   */
  public storeObject(key: string, data: any) {
    if (this.db) {
      const transaction = this.db.transaction(["data"], "readwrite");
      const store = transaction.objectStore("data");
      store.put({ value: data, key });
    }
  }

  /**
   * Load data from db
   * @param key Key
   * @returns Data associated with key, null if none
   */
  public loadObject(key: string): any {
    // console.log("Start loading object in indexed DB:", key);
    const store = this.db.transaction("data", "readonly").objectStore("data");
    const query = store.get(key);
    return new Promise((resolve) => {
      let result: any;
      query.onsuccess = (event: any) => {
        if (query.result) {
          result = query.result.value;
        } else {
          console.log("No entry available");
          result = {};
        }
        // console.log(key, result);
        resolve(result);
      };
    });
  }

  /**
   * Clear DB
   */
  public clearIndexedDB() {
    window.indexedDB.deleteDatabase(this.dbName);
    localStorage.clear();
  }

  /**
   * Delete object from DB
   * @param key Key
   * @param data Data
   */
  public delete(key: string) {
    if (this.db) {
      const transaction = this.db.transaction(["data"], "readwrite");
      const store = transaction.objectStore("data");
      store.delete(key);
    }
  }

  /**
   * Delete all data
   */
  public deleteAll() {
    if (this.db) {
      this.getKeysIncluding(["*"], (res: string[]) => {
        res.forEach((key: string) => {
          this.delete(key);
        });
      });
    }
  }

  /***
   * Get keys including a string
   */
  public getKeysIncluding(stringList: string[], cb: any = null) {
    const res = [];
    if (this.db) {
      const transaction = this.db.transaction(["data"]);
      const store = transaction.objectStore("data");
      store.openCursor().onsuccess = (event: any) => {
        var cursor = event.target.result;
        if (cursor) {
          if (stringList.includes("*")) {
            res.push(cursor.key);
          } else {
            stringList.forEach((s: string) => {
              if (cursor.key.indexOf(s) > -1) {
                res.push(cursor.key);
              }
            });
          }
          cursor.continue();
        } else {
          if (cb) {
            cb(res);
          }
        }
      };
    }
  }
}
