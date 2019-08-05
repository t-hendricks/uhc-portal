
const getCurrentAccount = jest.fn();
getCurrentAccount.mockResolvedValue({});

const getOrganization = jest.fn();
getOrganization.mockResolvedValue({});

const getSubscription = jest.fn();
getSubscription.mockResolvedValue({});

const getSubscriptions = jest.fn();
getSubscriptions.mockResolvedValue({});

const getOrganizationQuota = jest.fn();
getOrganizationQuota.mockResolvedValue({});

const accountsService = {
  getCurrentAccount,
  getOrganization,
  getSubscription,
  getSubscriptions,
  getOrganizationQuota,
};

export default accountsService;
