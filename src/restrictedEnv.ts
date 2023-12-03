import type { ChromeAPI } from '@redhat-cloud-services/types';

// 'isRestrictedEnv' is for an internal insights-chrome environment which may change the visibility of certain ocm pages and features.
export const isRestrictedEnv = (chrome?: ChromeAPI) =>
  ['int', 'scr', 'frh', 'frhStage'].includes((chrome || insights.chrome).getEnvironment());

export const getRestrictedEnvApi = (chrome?: ChromeAPI) => {
  const env = (chrome || insights.chrome).getEnvironment();
  if (env === 'frh') {
    return 'https://api-temp.***REMOVED***.com';
  }
  if (env === 'frhStage') {
    return 'https://api.stage.***REMOVED***.com';
  }
  return 'https://api.int.***REMOVED***.com';
};

export const SUPPORT_CASE_URL = 'https://redhatgov.servicenowservices.com/css';
export const SUPPORTED_RESTRICTED_ENV_OCP_VERSIONS = ['4.11'];

export const refreshToken = (chrome: ChromeAPI) => chrome.auth.getRefreshToken();
