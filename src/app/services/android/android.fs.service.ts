import { environment } from "src/environments/environment";
import { IServicesService } from "../services/iservices.service";

// https://www.npmjs.com/package/cordova-plugin-file
// https://github.com/apache/cordova-plugin-file
// cordova plugin add cordova-plugin-file

/**
 * Interface of FSService
 */
export interface IAndroidFSService {
  createDirectory(rootDirEntry: any, name: string);
  saveFile(dirEntry: any, fileName: any, fileData?: any, isAppend?: boolean);
  loadFile(dirEntry: any, fileName: any, cb?: any);
  getSavedProjectsIds(cb?: any);
  getDirtyProjectsIds(cb?: any);
  getKeysIncluding(stringList: string[], cb?: any);
  deleteFile(dirEntry: any, fileName: any);
  deleteAll();
}

/**
 * File system service giving access to Android file system when running as Android app
 */
export class AndroidFSService implements IAndroidFSService {
  private dataRootDirEntry = null;

  constructor(public servicesService: IServicesService) {}

  /**
   * Init service
   */
  public initService() {
    this.initFS();
  }

  /**
   * Get cordova object
   */
  get cordova(): any {
    return this.getWindow() ? this.getWindow().cordova : null;
  }

  /**
   * Get service
   * @returns
   */
  private getWindow(): any {
    return window;
  }

  /**
   * Init file system
   */
  private initFS() {
    if (environment.cordova) {
      const window: any = this.getWindow();
      const cordova = this.cordova;
      if (window && window.resolveLocalFileSystemURL && cordova && cordova.file) {
        window.resolveLocalFileSystemURL(
          cordova.file.dataDirectory,
          (dirEntry: any) => {
            this.dataRootDirEntry = dirEntry;
            this.listDirectory();
          },
          this.onError
        );
      } else {
        console.error(">>> Error: cordova.file or window.resolveLocalFileSystemURL does not exist");
        console.error(window, window ? window.resolveLocalFileSystemURL : null, cordova, cordova ? cordova.file : null);
      }
    }
  }

  /**
   * On error
   * @param err
   */
  private onError(err: any) {
    console.error("ERROR", err && err.toString ? err.toString() : "");
  }

  /**
   * Create a directory
   * @param rootDirEntry Root dir entry
   * @param name Dir name
   */
  public createDirectory(rootDirEntry: any, name: string) {
    try {
      rootDirEntry = rootDirEntry | this.dataRootDirEntry;
      if (rootDirEntry) {
        rootDirEntry.getDirectory(
          name,
          { create: true },
          (dirEntry: any) => {
            console.log("createDirectory ok : ", name, dirEntry);
          },
          this.onError
        );
      } else {
        console.error("createDirectory: rootDirEntry is null");
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Save a file
   * @param dirEntry Dir entry
   * @param fileName File name
   * @param fileData File data
   * @param isAppend Append data
   */
  public saveFile(dirEntry: any, fileName: any, fileData: any = null, isAppend: boolean = false) {
    try {
      dirEntry = dirEntry ? dirEntry : this.dataRootDirEntry;
      if (dirEntry) {
        dirEntry.getFile(
          fileName,
          { create: true, exclusive: false },
          (fileEntry: any) => {
            this.writeFile(fileEntry, fileData, isAppend);
          },
          this.onError
        );
      } else {
        console.error("saveFile: dirEntry is null");
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Write file content
   * @param fileEntry File entry
   * @param dataObj Data
   * @param isAppend Append data
   */
  private writeFile(fileEntry: any, dataObj: any, isAppend: boolean = false) {
    try {
      if (fileEntry) {
        fileEntry.createWriter((fileWriter: any) => {
          fileWriter.onwriteend = () => {
            // this.readFile(fileEntry);
          };
          fileWriter.onerror = this.onError;
          // if (!dataObj) {
          //   dataObj = new Blob(["some file data"], { type: "text/plain" });
          // }
          if (isAppend) {
            try {
              fileWriter.seek(fileWriter.length);
            } catch (e) {
              console.log("file doesn't exist!");
            }
          }
          fileWriter.write(dataObj);
        });
      } else {
        console.error("writeFile: fileEntry is null");
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Load a file
   * @param dirEntry
   * @param fileName
   */
  public loadFile(dirEntry: any, fileName: any, cb: any = null) {
    const res = {};
    try {
      dirEntry = dirEntry ? dirEntry : this.dataRootDirEntry;
      if (dirEntry) {
        dirEntry.getFile(
          fileName,
          { create: true, exclusive: false },
          (fileEntry: any) => {
            this.readFile(fileEntry, cb);
          },
          this.onError
        );
      } else {
        console.error("loadFile: dirEntry is null");
        if (cb) {
          cb(res);
        }
      }
    } catch (ex) {
      console.error(ex);
      if (cb) {
        cb(res);
      }
    }
  }

  /**
   * Read a file (asynchronously)
   * @param fileEntry File entry
   */
  private readFile(fileEntry: any, cb: any = null) {
    const res = "";
    try {
      if (fileEntry) {
        fileEntry.file((file: any) => {
          const reader = new FileReader();
          // !! keep "function ()" and not "() =>" giving access to this.result
          reader.onloadend = function () {
            const data = this.result;
            if (cb) {
              cb(data);
            }
          };
          reader.readAsText(file);
        }, this.onError);
      } else {
        console.error("readFile: fileEntry is null");
        if (cb) {
          cb(res);
        }
      }
    } catch (ex) {
      console.error(ex);
      if (cb) {
        cb(res);
      }
    }
  }

  /**
   * Load a file
   * @param dirEntry
   * @param fileName
   */
  public fileExists(dirEntry: any, fileName: any, cb: any = null) {
    const res = { fileExists: false };
    try {
      dirEntry = dirEntry ? dirEntry : this.dataRootDirEntry;
      if (dirEntry) {
        dirEntry.getFile(
          fileName,
          { create: true, exclusive: false },
          (fileEntry: any) => {
            if (cb) {
              cb({ fileExists: true });
            }
          },
          this.onError
        );
      } else {
        console.error("loadFile: dirEntry is null");
        if (cb) {
          cb(res);
        }
      }
    } catch (ex) {
      console.error(ex);
      if (cb) {
        cb(res);
      }
    }
  }

  /**
   * List directory content
   * @param dirEntry
   * @param cb
   */
  public listDirectory(dirEntry: any = null, cb: any = null) {
    try {
      dirEntry = dirEntry ? dirEntry : this.dataRootDirEntry;
      if (dirEntry) {
        const reader = dirEntry.createReader();
        reader.readEntries(
          (entries: any[]) => {
            console.log("listDirectory entries:", entries);
            // entries.forEach((entry) => {
            //   console.log("listDirectory entry:", entry.name, entry);
            // });
          },
          (error: any) => {
            console.log("listDirectory error:", error);
          }
        );
      } else {
        console.error("loadFile: dirEntry is null");
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Get the list ids of projects saved in indexed db
   * @param cb Callcack function
   */
  public getSavedProjectsIds(cb: any = null) {
    const searchString = "project--id-";
    this.getKeysIncluding([searchString], (keys: string[]) => {
      const res = [];
      console.log("getSavedProjectsIds projects ids:", res);
      keys.forEach((key: string) => {
        const p = key.indexOf(searchString);
        if (p > -1) {
          const id = key.substring(p + searchString.length);
          res.push(id);
        }
      });
      if (cb) {
        cb(res);
      }
    });
  }

  /**
   * Get the list ids of projects saved in indexed db
   * @param cb Callcack function
   */
  public getDirtyProjectsIds(cb: any = null) {
    const searchString = "isDirty---id-";
    this.getKeysIncluding([searchString], (keys: string[]) => {
      const res = [];
      console.log("getDirtyProjectsIds projects ids:", res);
      keys.forEach((key: string) => {
        const p = key.indexOf(searchString);
        if (p > -1) {
          const id = key.substring(p + searchString.length);
          res.push(id);
          console.log("getDirtyProjectsIds key, id:", key, id);
        }
      });
      if (cb) {
        cb(res);
      }
    });
  }

  /***
   * Get keys including a string
   */
  public getKeysIncluding(stringList: string[], cb: any = null) {
    const res = [];
    try {
      const dirEntry = this.dataRootDirEntry;
      if (dirEntry) {
        const reader = dirEntry.createReader();
        reader.readEntries(
          (entries: any[]) => {
            console.log("getKeysIncluding entries:", entries, stringList);
            entries.forEach((entry: any) => {
              console.log("getKeysIncluding entry:", entry, entry.name);
              if (stringList.includes("*")) {
                res.push(entry.name);
              } else {
                stringList.forEach((s: string) => {
                  if (entry.name.indexOf(s) > -1) {
                    console.log("getKeysIncluding entry matches !", entry.name);
                    res.push(entry.name);
                  }
                });
              }
            });
            console.log("getKeysIncluding res:", res);
            if (cb) {
              cb(res);
            }
          },
          (error: any) => {
            console.log("listDirectory error:", error);
            if (cb) {
              cb(res);
            }
          }
        );
      } else {
        console.error("loadFile: dirEntry is null");
        if (cb) {
          cb(res);
        }
      }
    } catch (ex) {
      console.error(ex);
      if (cb) {
        cb(res);
      }
    }
  }

  /**
   * Delete object from DB
   * https://github.com/apache/cordova-plugin-file/blob/master/tests/tests.js
   * @param key Key
   * @param data Data
   */
  public deleteFile(dirEntry: any, fileName: any) {
    try {
      dirEntry = dirEntry ? dirEntry : this.dataRootDirEntry;
      if (dirEntry) {
        dirEntry.getFile(
          fileName,
          { create: false, exclusive: false },
          (fileEntry: any) => {
            fileEntry.remove(() => {
              console.log("deleteFile: dirEntry removed");
            });
          },
          this.onError
        );
      } else {
        console.error("deleteFile: dirEntry is null");
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Delete all data
   */
  public deleteAll() {
    this.getKeysIncluding(["*"], (res: string[]) => {
      res.forEach((fileName: string) => {
        this.deleteFile(null, fileName);
      });
    });
  }
}
