const fetchAccount = jest.fn();
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
    {
      resource_name: 'dbaOperatorAddon',
      resource_type: 'addon',
      availability_zone_type: '',
      byoc: false,
      allowed: 5,
      reserved: 0,
    },
  ],
};

const rows = [];

export {
  fetchAccount,
  fetchQuotaSummary,
  organizationID,
  account,
  quotaSummary,
  rows,
};
