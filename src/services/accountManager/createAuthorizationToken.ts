import apiRequest from '../apiRequest';
import type { AccessTokenCfg } from '../../types/accounts_mgmt.v1';

const createAuthorizationToken = () =>
  apiRequest.post<AccessTokenCfg>('/api/accounts_mgmt/v1/access_token');

export default createAuthorizationToken;
