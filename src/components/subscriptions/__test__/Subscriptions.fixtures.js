const fetchAccount = jest.fn();
const fetchSubscriptions = jest.fn();
const fetchQuotaSummary = jest.fn();

const organizationID = 'org-1';

const account = {
  error: false,
  errorDetails: null,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  data: {
    organization: {
      id: organizationID,
    },
  },
};

const subscriptions = {
  empty: false,
  error: false,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  items: [
    {
      entitlement_status: 'Ok',
      id: 'subscription-3',
    },
    {
      entitlement_status: 'NotSet',
      id: 'subscription-4',
    },
    {
      entitlement_status: 'InconsistentServices',
      id: 'subscription-1',
    },
    {
      entitlement_status: 'Overcommitted',
      id: 'subscription-2',
    },
    {
      entitlement_status: '',
      id: 'subscription-5',
    },
  ],
};

const stats = {
  '': 1,
  InconsistentServices: 1,
  NotSet: 1,
  Ok: 1,
  Overcommitted: 1,
};

const quotaSummary = {
  empty: false,
  error: false,
  errorDetails: null,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  items: [
    {
      resource_name: 'c5.4xlarge',
      resource_type: 'cluster.aws',
      availability_zone_type: 'multi',
      byoc: true,
      allowed: 15,
      reserved: 10,
    },
    {
      resource_name: 'm5.xlarge',
      resource_type: 'cluster.aws',
      availability_zone_type: 'multi',
      byoc: true,
      allowed: 15,
      reserved: 15,
    },
    {
      resource_name: 'c5.4xlarge',
      resource_type: 'compute.node.aws',
      availability_zone_type: 'multi',
      byoc: true,
      allowed: 4,
      reserved: 0,
    },
  ],
};

export {
  fetchAccount,
  fetchSubscriptions,
  fetchQuotaSummary,
  organizationID,
  account,
  subscriptions,
  quotaSummary,
  stats,
};
