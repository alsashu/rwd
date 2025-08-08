import { IApiService } from "../api/api.service";
import { IServicesService } from "../services/iservices.service";
import { ServicesConst } from "../services/services.const";
import { TranslateConst } from "./translate.const";

/**
 * Interface of the TranslateService
 */
export interface ITranslateService {
  languageCode: string;
  setLanguage(value: string);
  setModelTranslateFile(fileName: string, content: any);
  getDomain(domain: string): any;
  translateFromDomains(domain: string, propertyName: string): string;
  translateFromMap(text: string, domain?: string): string;
  translateModelClassName(className: string): string;
  translateModelPropertyName(propertyName: string): string;
}

/**
 * Service related to translation
 */
export class TranslateService implements ITranslateService {
  public static localStorageKey = {
    language: "alm-rvw-language",
  };

  public domainTranslateMap = new Map<string, Map<string, string>>();
  public languageCode = null;

  public modelTranslateMap = new Map<string, any>();

  public apiService: IApiService;

  /**
   * Constructor
   * @param servicesService Services service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Service initialization
   */
  public initService() {
    this.apiService = this.servicesService.getService(ServicesConst.ApiService) as IApiService;
    this.setLanguage(localStorage.getItem(TranslateService.localStorageKey.language));
  }

  /**
   * Set the language
   * @param value The language value
   */
  public setLanguage(value: string) {
    this.languageCode = value || "en-US";
    this.loadLanguageMap(this.languageCode);
  }

  /**
   * Get translation map with keys and translations
   * @param languageCode Language code
   */
  private loadLanguageMap(languageCode: string): any {
    // console.log("Translate service: " + languageCode);
    this.apiService.getLanguageMap(languageCode).subscribe((res: any) => {
      for (const domain of res) {
        const domainMap = new Map<string, string>();
        domain.values.map((kv: any) => domainMap.set(kv.key, kv.value));
        this.domainTranslateMap.set(domain.domainName, domainMap);
      }
    });
  }

  /**
   * Get a domain of tranlation data
   * @param domain Domain name
   * @returns
   */
  public getDomain(domain: string): any {
    let res: any;
    switch (domain) {
      case TranslateConst.domains.properties:
        res = TranslateConst.properties;
        break;
      default:
        res = {};
        break;
    }
    return res;
  }

  /**
   * Get a translation value for a domain
   * @param domain Domain
   * @param propertyName Key
   * @returns The tranlsation value
   */
  public translateFromDomains(domain: string, propertyName: string): string {
    return this.getDomain(domain)[propertyName] || propertyName;
  }

  /**
   * Get a translation value
   * @param text Key or text
   * @param domain Domain, "defaut" is not set
   * @returns The translated value for the key/text
   */
  public translateFromMap(text: string, domain: string = "default"): string {
    return (
      (this.domainTranslateMap && this.domainTranslateMap.get(domain)
        ? this.domainTranslateMap.get(domain).get(text)
        : null) || text
    );
  }

  /**
   * Set the model translate file
   * @param fileName File name Schema_LangConfig_fr.json
   * @param content Content (key/values)
   */
  public setModelTranslateFile(fileName: string, content: any) {
    if (fileName && content) {
      const extPos = fileName.indexOf(".");
      const langPos = fileName.lastIndexOf("_");
      if (extPos > -1 && langPos > -1) {
        const lang = fileName.substring(langPos + 1, extPos);
        if (lang && this.languageCode && lang.toUpperCase() === this.languageCode.toUpperCase()) {
          this.modelTranslateMap = new Map<string, any>();
          if (content.forEach) {
            content.forEach((translationData: any) => {
              if (translationData.Key) {
                this.modelTranslateMap.set(translationData.Key, {
                  nameSpace: translationData.NameSpace,
                  type: translationData.Type,
                  value: translationData.Value,
                });
              }
            });
          }
        }
      }
    }
  }

  /**
   * Translate a class name
   * @param className The class name
   * @returns The translated value if found
   */
  public translateModelClassName(className: string): string {
    // return this.translateFromMap(className);
    return this.translateModelOrTranslationConfig(className);
  }

  /**
   * Translate a property name
   * @param propertyName The property name
   * @returns The translated value if found
   */
  public translateModelPropertyName(propertyName: string): string {
    // return this.translateFromMap(propertyName);
    return this.translateModelOrTranslationConfig(propertyName);
  }

  /**
   * Translate a property or class name from model config file or language config file if not found
   * @param text The text to be translated
   * @returns The translated value if found
   */
  public translateModelOrTranslationConfig(text: string): string {
    // return this.translateFromMap(propertyName);
    const modelTranslation = this.modelTranslateMap.get(text);
    let res: string = modelTranslation && modelTranslation.value ? modelTranslation.value : null;
    res = res !== null ? res : this.translateFromMap(text);
    return res;
  }
}
