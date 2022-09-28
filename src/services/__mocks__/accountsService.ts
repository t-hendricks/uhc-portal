const getCurrentAccount = jest.fn();
getCurrentAccount.mockResolvedValue({
  data: {
    organization: { id: 'foo' },
  },
});

const getOrganization = jest.fn();
getOrganization.mockResolvedValue({});

const getSubscription = jest.fn();
getSubscription.mockResolvedValue({});

const getSubscriptions = jest.fn();
getSubscriptions.mockResolvedValue({});

const getOrganizationQuota = jest.fn();
getOrganizationQuota.mockResolvedValue({});

const getNotificationContacts = jest.fn();
getNotificationContacts.mockResolvedValue({});

const addNotificationContact = jest.fn();
addNotificationContact.mockResolvedValue({});

const deleteNotificationContact = jest.fn();
deleteNotificationContact.mockResolvedValue({});

const accountsService = {
  getCurrentAccount,
  getOrganization,
  getSubscription,
  getSubscriptions,
  getOrganizationQuota,
  getNotificationContacts,
  addNotificationContact,
  deleteNotificationContact,
};

export default accountsService;
