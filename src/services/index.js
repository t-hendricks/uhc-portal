import clusterService from './clusterService';
import accountManager from './accountManager';
import authorizationsService from './authorizationsService';
import accountsService from './accountsService';

const services = {
  clusterService,
  accountsService,
  accountManager,
  authorizationsService,
};

export {
  clusterService, accountManager, authorizationsService, accountsService,
};
export default services;
