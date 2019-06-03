const { insights } = require('../../package.json');

function getBaseName() {
  return APP_BETA ? `/beta/${insights.appname}` : `/${insights.appname}`;
}

function getResourcesBase() {
  let resourcesBase = `/${insights.appname}`;
  if (APP_BETA) {
    resourcesBase = `/beta/apps/${insights.appname}`;
  } else if (APP_EMBEDDED) {
    resourcesBase = `/apps/${insights.appname}`;
  }
  return resourcesBase;
}

export { getResourcesBase };

export default getBaseName;
