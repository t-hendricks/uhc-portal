import createAuthorizationToken from './createAuthorizationToken';
import apiRequest from '../apiRequest';

const getDashboard = orgId => apiRequest({
  method: 'get',
  url: `/api/accounts_mgmt/v1/organizations/${orgId}/summary_dashboard`,
});

const accountManager = {
  createAuthorizationToken,
  getDashboard,
};

export {
  createAuthorizationToken,
};

export default accountManager;
