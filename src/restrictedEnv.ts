import type { ChromeAPI } from '@redhat-cloud-services/types';

import type { Config } from '~/config';

// 'isRestrictedEnv' is for an internal insights-chrome environment which may change the visibility of certain ocm pages and features.
export const isRestrictedEnv = (chrome?: ChromeAPI) => {
  if (!chrome) {
    return ((window as any).ocmConfig as Config)?.configData.restrictedEnv;
  }
  return ['int', 'scr', 'frh', 'frhStage'].includes(chrome.getEnvironment());
};

export const getRestrictedEnvApi = (chrome?: ChromeAPI) => {
  if (!chrome) {
    return ((window as any).ocmConfig as Config).configData.restrictedEnvApi;
  }
  const env = chrome.getEnvironment();
  if (env === 'frh') {
    return 'https://api.***REMOVED***.com';
  }
  if (env === 'frhStage') {
    return 'https://api.stage.***REMOVED***.com';
  }
  return 'https://api.int.***REMOVED***.com';
};

export const SUPPORT_CASE_URL = 'https://redhatgov.servicenowservices.com/css';
export const SUPPORTED_RESTRICTED_ENV_OCP_VERSIONS = ['4.11'];

export const getRefreshToken = (chrome: ChromeAPI) => chrome.auth.getRefreshToken();
