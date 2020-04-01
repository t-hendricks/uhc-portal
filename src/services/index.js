import clusterService from './clusterService';
import accountManager from './accountManager';
import authorizationsService from './authorizationsService';
import accountsService from './accountsService';
import serviceLogService from './serviceLogService';
import insightsService from './insightsService';

const services = {
  clusterService,
  accountsService,
  accountManager,
  authorizationsService,
  serviceLogService,
  insightsService,
};

export {
  clusterService,
  accountManager,
  authorizationsService,
  accountsService,
  serviceLogService,
  insightsService,
};

export default services;
