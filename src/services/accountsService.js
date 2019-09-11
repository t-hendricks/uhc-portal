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
    size: -1,
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

const editSubscription = (subscriptionID, data) => apiRequest({
  method: 'patch',
  data,
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}`,
});

const getOrganizationQuota = organizationID => apiRequest({
  method: 'get',
  url: `/api/accounts_mgmt/v1/organizations/${organizationID}/quota_summary?search=resource_type='cluster.aws'`,
});

function getRequest(pathParams, params = {}) {
  const type = pathParams[0];
  let url;
  if (type === 'subscriptions') {
    url = '/api/accounts_mgmt/v1/subscriptions';
  } else if (type === 'quota_summary') {
    url = `/api/accounts_mgmt/v1/organizations/${pathParams[1]}/quota_summary`;
  } else {
    url = null;
  }
  return apiRequest({ method: 'get', params, url });
}

const accountsService = {
  getCurrentAccount,
  getOrganization,
  getSubscription,
  getSubscriptions,
  getOrganizationQuota,
  editSubscription,
  getRequest,
};

export default accountsService;
