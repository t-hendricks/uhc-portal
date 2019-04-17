import apiRequest from './apiRequest';

const getCurrentAccount = () => apiRequest({
  method: 'get',
  url: '/api/accounts_mgmt/v1/current_account',
});

const getOrganization = organizationID => apiRequest({
  method: 'get',
  url: `/api/accounts_mgmt/v1/organizations/${organizationID}`,
});


const accountsService = {
  getCurrentAccount,
  getOrganization,
};

export default accountsService;
