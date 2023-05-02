/*global module*/

const APP_ID = 'openshift';
const API_PORT = 8010;
const routes = {};

routes[`/beta/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/preview/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/beta/apps/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/apps/${APP_ID}`] = { host: 'http://localhost:8001' };

// In staging/production, insights API is proxied through the UI domain e.g.
// https://qaprodauth.cloud.redhat.com/api/insights-results-aggregator/v1/clusters/f460563c-...
// whereas other OCM backends are served on distinct domain e.g.
// https://api.stage.openshift.com/api/accounts_mgmt/v1/subscriptions/1jbePckZxQsxay3nKXV4D2...
//
// In local development, we proxy everything through the UI domain (whether via webpack or
// insights-proxy) so the 2 uses of '/api' would collide.
// We keep consoledot's default meaning of '/api' for insights, but configure api.openshift.com
// requests to add /openshift_api prefix instead. (see config/development.json)
routes['/openshift_api/api'] = { host: `http://localhost:${API_PORT}` };
// Under mockdata/api/ dir, we got away with mixing both meanings. (see config/mockserver.json)
routes['/mockdata/api'] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
