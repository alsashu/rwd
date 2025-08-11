import * as CryptoJS from "crypto-js";
import Utf8 from "crypto-js/enc-utf8";
import { IServicesService } from "../services/iservices.service";
import { Observable } from "rxjs";
import { IIndexedDBService } from "../indexedDB/indexedDB.service";
import { ServicesConst } from "../services/services.const";
import { IAndroidFSService } from "./android.fs.service";
import { environment } from "src/environments/environment";

/**
 * Interface of OfflineApiService
 */
export interface IOfflineApiService {
  getData(url: string, httpOptions?: any): Promise<any>;
  saveDataFromApiCall(prefix: string, url: string, httpOptions: any, data: any, isJSON?: boolean);
  // getEndPoint(url: string): string;
  // saveData(url: string, data: any, isJSON?: boolean): any;

  getSavedProjectsIdsAsync(cb?: any);
  getDirtyProjectsIdsAsync(cb?: any);
  deleteData(url: string): any;
  getKeysIncluding(s: string[], cb?: any);

  cleanFileSystem(): any;
}

/**
 * Off line api service
 */
export class OfflineApiService implements IOfflineApiService {
  private static encryptKey = "right-viewer";

  private indexedDBService: IIndexedDBService;
  private androidFSService: IAndroidFSService;

  /**
   * Constructor
   * @param servicesService Services Service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.indexedDBService = this.servicesService.getService(ServicesConst.IndexedDBService) as IIndexedDBService;
    this.androidFSService = this.servicesService.getService(ServicesConst.AndroidFSService) as IAndroidFSService;
  }

  /**
   * Get url end point (remove server address)
   * @param url
   * @returns end point
   */
  public getEndPoint(url: string): string {
    let res = url;
    if (url) {
      let p = url.indexOf("/api");
      if (p == -1) {
        p = url.indexOf("/wiki");
      }
      if (p > -1) {
        res = url.substring(p);
      }
    }
    return res;
  }

  /**
   * Calc data key from api call parameters
   * @param prefix prefix
   * @param url Url
   * @param httpOptions Parameters
   */
  public calcKeyFromApiCall(prefix: string, url: string, httpOptions: any): string {
    let keyUrl = prefix + this.getEndPoint(url);
    if (url.indexOf("/api/model/save/InputAndSource") > -1) {
      keyUrl = "SAVED-DATA-POST-" + url;
    }
    let key = keyUrl + (httpOptions && httpOptions.params ? "/?" + httpOptions.params.toString() : "");
    return key;
  }

  /**
   * Transform key to file name
   * @param key
   * @returns
   */
  public keyToFileName(key: string): string {
    return key.replace(/\\/g, "-").replace(/\//g, "-").replace(/\?/g, "-").replace(/&/g, "-").replace(/=/g, "-");
  }

  /**
   * Function that load from storage
   * @param key
   * @param httpOptions
   */
  public getData(url: string, httpOptions: any = null): Promise<any> {
    if (environment.cordova) {
      return this.getDataFromAndroidFS(url, httpOptions);
    }
    return this.getDataFromIndexedDb(url, httpOptions);
  }

  /**
   * Function that get data in indexDB
   * @param key
   * @param httpOptions
   */
  public getDataFromIndexedDb(url: string, httpOptions: any = null): Promise<any> {
    const promise = new Promise((resolve: any) => {
      let result: any;
      if (this.indexedDBService && this.indexedDBService.isConnected()) {
        // const prefix = url.indexOf("SERVER-") > -1 ? "SERVER-DATA-GET-" : "";
        const prefix = "SERVER-DATA-GET-";
        const key = this.calcKeyFromApiCall(prefix, url, httpOptions);
        console.log("indexedDBService.loadObject", key);
        this.indexedDBService.loadObject(key).then((res: any) => {
          result = res;
          // console.log("res", res);
          // Specific for project list
          if (key.indexOf("projectList") > -1) {
            this.indexedDBService.getSavedProjectsIds((res: string[]) => {
              // console.log("projects ids:", res);
              if (result && result.length && res) {
                result = result.filter((project: any) => res.includes(project.id));
              }
              resolve(result);
            });
          } else {
            resolve(result);
          }
        });
      } else {
        console.log("not connected to db", result);
        resolve(result);
      }
    });
    return promise;
  }

  /**
   * Get the list ids of projects saved in indexed db
   * @param cb Callcack function
   */
  public getSavedProjectsIds(cb: any = null): any {
    const promise = new Promise((resolve: any) => {
      let result: any = [];
      if (environment.cordova) {
        this.androidFSService.getSavedProjectsIds((res: string[]) => {
          console.log("androidFSService projects ids:", res);
          if (res) {
            result = res;
          }
          resolve(result);
        });
      } else {
        this.indexedDBService.getSavedProjectsIds((res: string[]) => {
          if (res) {
            result = res;
          }
          resolve(result);
        });
      }
    });
    return promise;
  }

  /**
   * Get the list ids of projects saved on tablet and dirty
   * @param cb Callcack function
   */
  public getDirtyProjectsIds(cb: any = null): any {
    const promise = new Promise((resolve: any) => {
      let result: any = [];
      if (environment.cordova) {
        this.androidFSService.getDirtyProjectsIds((res: string[]) => {
          console.log("androidFSService dirty projects ids:", res);
          if (res) {
            result = res;
          }
          resolve(result);
        });
      } else {
        this.indexedDBService.getDirtyProjectsIds((res: string[]) => {
          if (res) {
            result = res;
          }
          resolve(result);
        });
      }
    });
    return promise;
  }

  /**
   * Get list of projects saved on tablet
   * @param cb
   */
  public async getSavedProjectsIdsAsync(cb: any = null) {
    let res = [];
    try {
      res = await this.getSavedProjectsIds();
      console.log(res);
    } catch (error) {
      console.error("Erreur lors de l'obtention des données", error);
    }
    if (cb) {
      cb(res);
    }
  }

  /**
   * Get list of projects saved on tablet and dirty
   * @param cb
   */
  public async getDirtyProjectsIdsAsync(cb: any = null) {
    let res = [];
    try {
      res = await this.getDirtyProjectsIds();
      console.log(res);
    } catch (error) {
      console.error("Erreur lors de l'obtention des données", error);
    }
    if (cb) {
      cb(res);
    }
  }

  /**
   * Save data locally when calling server api get
   * @param prefix prefix
   * @param url Url
   * @param httpOptions Parameters
   * @param data Data from server
   */
  public saveDataFromApiCall(prefix: string, url: string, httpOptions: any, data: any, isJSON: boolean = true): any {
    const key = this.calcKeyFromApiCall(prefix, url, httpOptions);
    return this.saveData(key, data, isJSON);
  }

  /**
   * Function that saves data on local
   * @param key
   * @param data
   * @param isJSON
   */
  private saveData(url: string, data: any, isJSON: boolean = true): any {
    let res = this.saveDataToIndexedDb(url, data, isJSON);
    if (environment.cordova) {
      res = this.saveDataToAndroidFS(url, data, isJSON);
    }
    return res;
  }

  /**
   * Function for deleting the data from local
   * @param key
   */
  public deleteData(url: string): any {
    let res = this.deleteDataFromIndexedDb(url);
    if (environment.cordova) {
      res = this.deleteDataFromAndroidFS(url);
    }
    return res;
  }

  /**
   * Clean file system if problem
   */
  public cleanFileSystem() {
    this.indexedDBService.deleteAll();
    if (environment.cordova) {
      this.androidFSService.deleteAll();
    }
  }

  /**
   * Function that saves the data in the indexDB
   * @param key
   * @param data
   * @param isJSON
   */
  private saveDataToIndexedDb(url: string, data: any, isJSON: boolean = true): any {
    let res = data;
    let key = this.getKeyFromUrl(url);
    this.indexedDBService.storeObject(key, res);
    return new Observable((observer: any) => {
      observer.complete();
    });
  }

  /**
   * Function that deletes data from the indexDB
   * @param key
   * @param data
   * @param isJSON
   */
  private deleteDataFromIndexedDb(url: string): any {
    let key = this.getKeyFromUrl(url);
    this.indexedDBService.delete(key);
    return new Observable((observer: any) => {
      observer.complete();
    });
  }

  /**
   * Function that saves the data in the indexDB
   * @param key
   * @param data
   * @param isJSON
   */
  private saveDataToAndroidFS(url: string, data: any, isJSON: boolean = true): any {
    let res = data;
    let key = this.getKeyFromUrl(url);
    const filename = this.keyToFileName(key);
    if (isJSON) {
      res = JSON.stringify(data);
    }
    console.log("Saving to android fs:", url, data ? data.toString().substring(1, 100) : data, key, filename, isJSON);
    const blob = new Blob([res], { type: "text/plain" });
    this.androidFSService.saveFile(null, filename, blob);
    return new Observable((observer: any) => {
      observer.complete();
    });
  }

  /**
   * Function that gets data from android file system
   * @param utl
   * @param httpOptions
   */
  private getDataFromAndroidFS(url: string, httpOptions: any = null): Promise<any> {
    const promise = new Promise((resolve: any) => {
      try {
        let result: any;
        const key = this.calcKeyFromApiCall("SERVER-DATA-GET-", url, httpOptions);
        const filename = this.keyToFileName(key);
        this.androidFSService.loadFile(null, filename, (data: any) => {
          const isJSON = !(httpOptions && httpOptions.responseType === "text");
          result = data;
          if (isJSON) {
            try {
              result = JSON.parse(data);
            } catch (ex: any) {
              result = {};
            }
          } else {
            result = data.toString();
            result = result.split('\\"').join('"');
          }

          // Specific for project list
          if (key.indexOf("projectList") > -1) {
            this.androidFSService.getSavedProjectsIds((res: string[]) => {
              // console.log("projects ids:", res);
              if (result && result.length && res) {
                result = result.filter((project: any) => res.includes(project.id));
              }
              resolve(result);
            });
          } else {
            resolve(result);
          }
        });
      } catch (ex) {
        console.error(ex);
        resolve(ex);
      }
    });
    return promise;
  }

  /**
   * Function that deletes data from the android FS
   * @param key
   * @param data
   * @param isJSON
   */
  private deleteDataFromAndroidFS(url: string): any {
    let key = this.getKeyFromUrl(url);
    this.androidFSService.deleteFile(null, key);
    return new Observable((observer: any) => {
      observer.complete();
    });
  }

  /***
   * Get keys including a string
   */
  public getKeysIncluding(stringList: string[], cb: any = null) {
    if (environment.cordova) {
      const sl = [];
      stringList.forEach((s: string) => sl.push(this.keyToFileName(s)));
      this.androidFSService.getKeysIncluding(sl, cb);
    } else {
      this.indexedDBService.getKeysIncluding(stringList, cb);
    }
  }

  /**
   * Function that load and decrypt the data from local storage
   * @param key
   * @param options
   */
  private getDataFromLocalStorage(url: string, options: any = null): any {
    const key = this.getKeyFromUrl(url);
    let decryptData: string;
    decryptData = this.decryptData(OfflineApiService.encryptKey, localStorage.getItem(key) || "");
    const result = JSON.parse(decryptData);
    return new Promise((resolve) => {
      resolve(result);
    });
  }

  /**
   * Function that encrypt and save the data in the local storage
   * @param key
   * @param data
   * @param isJSON
   */
  private saveDataInLocalStorage(url: string, data: any, isJSON: boolean = true): any {
    // console.log("Saving in locale : ", url, data);
    let key = this.getKeyFromUrl(url);
    let res = data;
    const encryptData = this.encryptData(OfflineApiService.encryptKey, JSON.stringify(res));
    localStorage.setItem(key, encryptData);
    return new Observable((observer) => {
      observer.complete();
    });
  }

  /**
   * Function that encrypt the data using the encrypt key
   * @param encryptKey string used to encrypt or decrypt data
   * @param data string reprsenting the data
   */
  private encryptData(encryptKey: string, data: string): string {
    return CryptoJS.AES.encrypt(data, encryptKey).toString();
  }

  /**
   * Function that decrypt the data using the encrypt key
   * @param encryptKey string used to encrypt or decrypt data
   * @param encryptData string reprsenting the crypted data
   */
  private decryptData(encryptKey: string, encryptData: string): string {
    return CryptoJS.AES.decrypt(encryptData, encryptKey).toString(Utf8);
  }

  /**
   * Returns the key the find the item in the localStorage using the url to Api
   * @param url to access the same data in Api
   */
  private getKeyFromUrl(url: string): string {
    return url;
  }
}
