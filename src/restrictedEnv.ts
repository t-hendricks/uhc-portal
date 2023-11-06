import type { ChromeAPI } from '@redhat-cloud-services/types';

// 'isRestrictedEnv' is for an internal insights-chrome environment which may change the visibility of certain ocm pages and features.
export const isRestrictedEnv = (chrome?: ChromeAPI) =>
  ['int', 'scr'].includes((chrome || insights.chrome).getEnvironment());

export const restrictedEnvApi = 'https://api.int.***REMOVED***.com';

export const SUPPORT_CASE_URL = 'https://redhatgov.servicenowservices.com/css';
export const SUPPORTED_RESTRICTED_ENV_OCP_VERSIONS = ['4.11'];

export const refreshToken = (chrome: ChromeAPI) => chrome.auth.getRefreshToken();
