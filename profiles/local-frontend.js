/*global module*/

const APP_ID = 'openshift';
const API_PORT = 8010;
const AGGREGATOR_PORT = 8080;
const routes = {};

routes[`/beta/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/beta/apps/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/apps/${APP_ID}`] = { host: 'http://localhost:8001' };

routes['/api/clusters_mgmt'] = { host: `http://localhost:${API_PORT}` };
routes['/api/aggregator'] = { host: `http://localhost:${AGGREGATOR_PORT}` };

module.exports = { routes };
