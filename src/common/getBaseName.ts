const {
  insights: { appname },
} = require('../../package.json');

const getBaseName = (): string => (APP_BETA ? `/beta/${appname}` : `/${appname}`);

/**
 * Removes the basename from the beginning of a path
 * @param {string} path
 */
const removeBaseName = (path: string): string =>
  path.replace(new RegExp(`^${getBaseName()}`, 'i'), '');

const getResourcesBase = (): string => (APP_BETA ? `/beta/apps/${appname}` : `/apps/${appname}`);

export { getResourcesBase, removeBaseName };

export default getBaseName;
