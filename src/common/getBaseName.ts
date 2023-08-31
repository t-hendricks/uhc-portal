const {
  insights: { appname },
} = require('../../package.json');

const getBaseEnv = (): string => {
  if (window?.location.pathname.startsWith('/beta')) {
    return '/beta';
  }
  if (window?.location.pathname.startsWith('/preview') || APP_BETA) {
    return '/preview';
  }
  return '';
};

/** Returns the app name */
const ocmAppPath = `/${appname}`;

/** Returns base path for this app */
const ocmBaseName = (): string => `${getBaseEnv()}/${appname}`;

/** Returns base path for Insights Advisor app */
const advisorBaseName = (): string => `${getBaseEnv()}/openshift/insights/advisor`;

/**
 * Removes the basename from the beginning of a path
 * @param {string} path
 */
const ocmBaseNameRegexp = new RegExp(`^(/preview|/beta|)/${appname}`, 'i');

const removeOcmBaseName = (path: string): string => path.replace(ocmBaseNameRegexp, '');

const getResourcesBase = (): string => (APP_BETA ? `/beta/apps/${appname}` : `/apps/${appname}`);

export { advisorBaseName, getResourcesBase, ocmAppPath, removeOcmBaseName };

export default ocmBaseName;
