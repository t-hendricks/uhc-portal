const mockGetNotificationContactsPayload = {
  data: {
    items: [
      {
        id: '1TbDi3BaBKGhDULdcKpXj05nzL4',
        kind: 'Account',
        href: '/api/accounts_mgmt/v1/accounts/1TbDi3BaBKGhDULdcKpXj05nzL4',
        first_name: 'Gregory',
        last_name: 'Shilin',
        username: 'gshilin.openshift',
        email: '***REMOVED***',
        created_at: '2019-11-14T08:27:04.222975Z',
        updated_at: '2020-10-01T06:36:53.851208Z',
        organization: {
          id: '1NjzscdrsZvktfo6EX29u7xO9kA',
          created_at: '0001-01-01T00:00:00Z',
          updated_at: '0001-01-01T00:00:00Z',
        },
      },
      {
        id: '1VW00yfnFuhoybNRBqF86RyS2h6',
        kind: 'Account',
        href: '/api/accounts_mgmt/v1/accounts/1VW00yfnFuhoybNRBqF86RyS2h6',
        first_name: 'Liran',
        last_name: 'Roitman',
        username: 'lroitman.openshift',
        email: '***REMOVED***',
        created_at: '2019-12-26T09:42:04.690448Z',
        updated_at: '2020-06-29T18:31:30.722406Z',
        organization: {
          id: '1NjzscdrsZvktfo6EX29u7xO9kA',
          created_at: '0001-01-01T00:00:00Z',
          updated_at: '0001-01-01T00:00:00Z',
        },
      },
      {
        id: '1NjzrgHzgOHK0pGi6zxPfhC7PQV',
        kind: 'Account',
        href: '/api/accounts_mgmt/v1/accounts/1NjzrgHzgOHK0pGi6zxPfhC7PQV',
        first_name: 'Timothy',
        last_name: 'Williams',
        username: 'tiwillia.openshift',
        email: '***REMOVED***',
        created_at: '2019-07-08T18:11:34.587889Z',
        updated_at: '2020-06-29T18:31:06.500359Z',
        organization: {
          id: '1NjzscdrsZvktfo6EX29u7xO9kA',
          created_at: '0001-01-01T00:00:00Z',
          updated_at: '0001-01-01T00:00:00Z',
        },
      },
    ],
  },
};

const mockGetNotificationContactsList = [
  {
    userID: '1TbDi3BaBKGhDULdcKpXj05nzL4',
    firstName: 'Gregory',
    lastName: 'Shilin',
    username: 'gshilin.openshift',
    email: '***REMOVED***',
  },
  {
    userID: '1VW00yfnFuhoybNRBqF86RyS2h6',
    firstName: 'Liran',
    lastName: 'Roitman',
    username: 'lroitman.openshift',
    email: '***REMOVED***',
  },
  {
    userID: '1NjzrgHzgOHK0pGi6zxPfhC7PQV',
    firstName: 'Timothy',
    lastName: 'Williams',
    username: 'tiwillia.openshift',
    email: '***REMOVED***',
  },
];

const clusterCreator = {
  id: '1VW00yfnFuhoybNRBqF86RyS2h6',
  kind: 'Account',
  href: '/api/accounts_mgmt/v1/accounts/1VW00yfnFuhoybNRBqF86RyS2h6',
  name: 'Liran Roitman',
  username: 'lroitman.openshift',
};

const baseProps = {
  subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
  canEdit: true,
  notificationContacts: {
    contacts: [],
    pending: false,
    subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
  },
  clusterUUID: '1',
  product: 'OSD',
  supportCases: {
    cases: [],
    pending: false,
    subscriptionID: '1iGW3xYbKZAEdZLi207rcA1l0ob',
  },
  deleteContactResponse: {},
  addContactResponse: {},
  getNotificationContacts: jest.fn(),
  hasContacts: false,
  deleteNotificationContact: jest.fn(),
  clearDeleteNotificationContacts: jest.fn(),
  clearNotificationContacts: jest.fn(),
  addNotificationToaster: jest.fn(),
  isAddNotificationContactModalOpen: false,
  openModal: jest.fn(),
  closeModal: jest.fn(),
  clearAddNotificationContacts: jest.fn(),
  addNotificationContact: jest.fn(),
  getSupportCases: jest.fn(),
  clusterCreator,
  version: 'openshift-v4.12.4',
};

export {
  mockGetNotificationContactsPayload,
  mockGetNotificationContactsList,
  clusterCreator,
  baseProps,
};
