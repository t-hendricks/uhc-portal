// 'isRestrictedEnv' is for an internal insights-chrome environment which may change the visibility of certain ocm pages and features.
export const isRestrictedEnv = () => insights.chrome.getEnvironment() === 'int';

export const restrictedEnvApi = 'https://api.int.***REMOVED***.com';

export const SUPPORT_CASE_URL = 'https://redhatgov.servicenowservices.com/css';
