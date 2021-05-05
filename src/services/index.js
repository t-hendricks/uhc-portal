import clusterService from './clusterService';
import costService from './costService';
import accountManager from './accountManager';
import authorizationsService from './authorizationsService';
import accountsService from './accountsService';
import serviceLogService from './serviceLogService';
import insightsService from './insightsService';
import assistedService from './assistedService';

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
