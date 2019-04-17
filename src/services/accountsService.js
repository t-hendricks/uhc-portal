import apiRequest from './apiRequest';

const getCurrentAccount = () => apiRequest({
  method: 'get',
  url: '/api/accounts_mgmt/v1/current_account',
});

const getOrganization = organizationID => apiRequest({
  method: 'get',
  url: `/api/accounts_mgmt/v1/organizations/${organizationID}`,
});

const getSubscriptions = search => apiRequest({
  method: 'get',
  params: {
    search,
    fetchAccounts: true,
  },
  url: '/api/accounts_mgmt/v1/subscriptions',
});

const getSubscription = subscriptionID => apiRequest({
  method: 'get',
  params: {
    fetchAccounts: true,
  },
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}`,
});


const accountsService = {
  getCurrentAccount,
  getOrganization,
  getSubscription,
  getSubscriptions,
};

export default accountsService;
