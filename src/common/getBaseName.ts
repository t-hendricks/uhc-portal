const { insights } = require('../../package.json');

function getBaseName() {
  return APP_BETA ? `/beta/${insights.appname}` : `/${insights.appname}`;
}

/**
 * Removes the basename from the beginning of a path
 * @param {string} path
 */
function removeBaseName(path) {
  return path.replace(new RegExp(`^${getBaseName()}`, 'i'), '');
}

function getResourcesBase() {
  return APP_BETA ? `/beta/apps/${insights.appname}` : `/apps/${insights.appname}`;
}

export { getResourcesBase, removeBaseName };

export default getBaseName;
