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
