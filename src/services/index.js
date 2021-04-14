import clusterService from './clusterService';
import costService from './costService';
import accountManager from './accountManager';
import authorizationsService from './authorizationsService';
import accountsService from './accountsService';
import serviceLogService from './serviceLogService';
import insightsService from './insightsService';

const services = {
  clusterService,
  costService,
  accountsService,
  accountManager,
  authorizationsService,
  serviceLogService,
  insightsService,
};

export {
  clusterService,
  costService,
  accountManager,
  authorizationsService,
  accountsService,
  serviceLogService,
  insightsService,
};

export default services;
