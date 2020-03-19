import clusterService from './clusterService';
import accountManager from './accountManager';
import authorizationsService from './authorizationsService';
import accountsService from './accountsService';
import serviceLogService from './serviceLogService';

const services = {
  clusterService,
  accountsService,
  accountManager,
  authorizationsService,
  serviceLogService,
};

export {
  clusterService, accountManager, authorizationsService, accountsService, serviceLogService,
};
export default services;
