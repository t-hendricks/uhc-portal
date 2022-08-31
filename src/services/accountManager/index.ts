import createAuthorizationToken from './createAuthorizationToken';
import apiRequest from '../apiRequest';
import type { Summary } from '../../types/accounts_mgmt.v1';

const getDashboard = (orgId: string) =>
  apiRequest.get<Summary>(
    `/api/accounts_mgmt/v1/organizations/${orgId}/summary_dashboard`,
  );

const accountManager = {
  createAuthorizationToken,
  getDashboard,
};

export { createAuthorizationToken };

export default accountManager;
