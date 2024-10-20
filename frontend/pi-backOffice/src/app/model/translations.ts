// src/app/model/translations.ts

export interface LanguageData {
    [key: string]: string;  // Allows any string key to index into LanguageData and will return a string
  }
  
  export interface Translations {
    [key: string]: LanguageData;  // Allows any string key to index into Translations, returning LanguageData
  }
  
