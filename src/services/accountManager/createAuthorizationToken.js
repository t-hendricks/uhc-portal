import apiRequest from '../apiRequest';

const createAuthorizationToken = () => apiRequest({
  method: 'post',
  url: '/api/accounts_mgmt/v1/access_token',
});

export default createAuthorizationToken;
