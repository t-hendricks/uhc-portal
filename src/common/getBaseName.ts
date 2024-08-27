const {
  insights: { appname },
} = require('../../package.json');

/** base path for this app */
const ocmBaseName = `/${appname}`;

/** base path for Insights Advisor app */
const advisorBaseName = `${ocmBaseName}/insights/advisor`;

/**
 * Removes the basename from the beginning of a path
 * @param {string} path
 */
const ocmBaseNameRegexp = new RegExp(`^${ocmBaseName}`, 'i');

const removeOcmBaseName = (path: string): string => path.replace(ocmBaseNameRegexp, '');

export { advisorBaseName, removeOcmBaseName };

export default ocmBaseName;
