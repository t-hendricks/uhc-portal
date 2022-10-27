interface Insights {
  ocm?: {
    on: Function;
  };
  chrome: any;
}

declare const insights: Insights;

// See webpack config DefinePlugin
declare const APP_BETA: boolean;
declare const APP_DEVMODE: boolean;
declare const APP_DEV_SERVER: boolean;
declare const APP_API_ENV: string;
declare const BASE_PATH: string;

declare module '*.png' {
  const value: any;
  export = value;
}

// polyfilled
interface ObjectConstructor {
  /**
   * Returns an object created by key-value entries for properties and methods
   * @param entries An iterable object that contains key-value entries for properties and methods.
   */
  fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T };

  /**
   * Returns an object created by key-value entries for properties and methods
   * @param entries An iterable object that contains key-value entries for properties and methods.
   */
  fromEntries(entries: Iterable<readonly any[]>): any;
}