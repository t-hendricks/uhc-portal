interface Insights {
  ocm?: {
    on: Function;
  };
  chrome: any;
}

declare const insights: Insights;

// See webpack config DefinePlugin
declare const APP_BETA: string;
declare const APP_DEVMODE: string;
declare const APP_DEV_SERVER: string;
declare const APP_API_ENV: string;
declare const BASE_PATH: string;
