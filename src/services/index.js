import clusterService from './clusterService';
import accountManager from './accountManager';
import authorizationsService from './authorizationsService';

const services = {
  clusterService,
  accountManager,
  authorizationsService,
};

export { clusterService, accountManager, authorizationsService };
export default services;
