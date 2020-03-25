/*global module*/

const APP_ID = 'openshift';
const API_PORT = 8010;
const routes = {};

routes[`/beta/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/beta/apps/${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`/apps/${APP_ID}`] = { host: 'http://localhost:8001' };

routes['/api'] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
