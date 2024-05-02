import accountManager from './accountManager';
import accountsService from './accountsService';
import assistedService from './assistedService';
import authorizationsService from './authorizationsService';
import clusterService from './clusterService';
import costService from './costService';
import insightsService from './insightsService';
import serviceLogService from './serviceLogService';

const services = {
  clusterService,
  costService,
  accountsService,
  accountManager,
  authorizationsService,
  serviceLogService,
  insightsService,
  assistedService,
};

export {
  clusterService,
  costService,
  accountManager,
  authorizationsService,
  accountsService,
  serviceLogService,
  insightsService,
  assistedService,
};

export default services;
