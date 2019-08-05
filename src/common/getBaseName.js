const { insights } = require('../../package.json');

function getBaseName() {
  return APP_BETA ? `/beta/${insights.appname}` : `/${insights.appname}`;
}

function getResourcesBase() {
  return APP_BETA ? `/beta/apps/${insights.appname}` : `/apps/${insights.appname}`;
}

export { getResourcesBase };

export default getBaseName;
