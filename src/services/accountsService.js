import apiRequest from './apiRequest';

const getCurrentAccount = () => apiRequest({
  method: 'get',
  url: '/api/accounts_mgmt/v1/current_account',
});

const getOrganization = organizationID => apiRequest({
  method: 'get',
  params: {
    fetchCapabilities: true,
  },
  url: `/api/accounts_mgmt/v1/organizations/${organizationID}`,
});

const getSubscriptions = params => apiRequest({
  method: 'get',
  params: {
    page: params.page,
    size: params.page_size,
    orderBy: params.order,
    search: params.filter,
    fetchAccounts: true,
    fetchCapabilities: true,
  },
  url: '/api/accounts_mgmt/v1/subscriptions',
});

const getSubscription = subscriptionID => apiRequest({
  method: 'get',
  params: {
    fetchAccounts: true,
    fetchCpuAndSocket: true,
    fetchCapabilities: true,
    fetchMetrics: true,
  },
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}`,
});

const editSubscription = (subscriptionID, data) => apiRequest({
  method: 'patch',
  data,
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}`,
});

const getNotificationContacts = subscriptionID => apiRequest({
  method: 'get',
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}/notification_contacts`,
});

const addNotificationContact = (subscriptionID, username) => apiRequest({
  method: 'post',
  data: { account_username: username },
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}/notification_contacts`,
});

const deleteNotificationContact = (subscriptionID, accountID) => apiRequest({
  method: 'delete',
  url: `/api/accounts_mgmt/v1/subscriptions/${subscriptionID}/notification_contacts/${accountID}`,
});

const getOrganizationQuota = organizationID => apiRequest({
  method: 'get',
  params: {
    fetchRelatedResources: true,
  },
  url: `/api/accounts_mgmt/v1/organizations/${organizationID}/quota_cost`,
});

function getRequest(pathParams, params = {}) {
  const type = pathParams[0];
  let url;
  if (type === 'quota_summary') {
    url = `/api/accounts_mgmt/v1/organizations/${pathParams[1]}/quota_summary`;
  } else {
    url = null;
  }
  return apiRequest({ method: 'get', params, url });
}

const getFeature = (featureID, organizationID) => apiRequest({
  method: 'post',
  data: {
    organization_id: organizationID,
  },
  url: `/api/accounts_mgmt/v1/feature_toggles/${featureID}/query`,
});

const accountsService = {
  getCurrentAccount,
  getOrganization,
  getSubscription,
  getSubscriptions,
  getNotificationContacts,
  addNotificationContact,
  deleteNotificationContact,
  getOrganizationQuota,
  editSubscription,
  getRequest,
  getFeature,
};

export default accountsService;
