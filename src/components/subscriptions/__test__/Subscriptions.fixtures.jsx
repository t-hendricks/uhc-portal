const fetchAccount = jest.fn();
const fetchQuotaCost = jest.fn();
const invalidateClusters = jest.fn();

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

// TODO: move to / replace by quota_cost.fixtures?
const quotaCost = {
  empty: false,
  error: false,
  errorDetails: null,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  items: [
    {
      allowed: 15,
      consumed: 10,
      related_resources: [
        {
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          resource_type: 'compute.node',
          byoc: 'rhinfra',
          availability_zone_type: 'any',
          product: 'OSD',
        },
      ],
    },
    {
      allowed: 15,
      consumed: 15,
      related_resources: [
        {
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          resource_type: 'compute.node',
          byoc: 'rhinfra',
          availability_zone_type: 'any',
          product: 'OSD',
        },
      ],
    },
    {
      allowed: 4,
      consumed: 0,
      related_resources: [
        {
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          resource_type: 'compute.node',
          byoc: 'rhinfra',
          availability_zone_type: 'any',
          product: 'OSD',
        },
      ],
    },
    {
      allowed: 5,
      consumed: 0,
      quota_id: 'add-on|addon-dba-operator',
      related_resources: [
        {
          cloud_provider: 'any',
          resource_name: 'addon-dba-operator',
          resource_type: 'add-on',
          byoc: 'any',
          availability_zone_type: 'any',
          product: 'ANY',
          billing_model: 'standard',
        },
      ],
    },
  ],
  addOnsQuota: {
    dbaOperatorAddon: 5,
  },
};

const rows = [];

export {
  fetchAccount,
  fetchQuotaCost,
  organizationID,
  account,
  quotaCost,
  rows,
  invalidateClusters,
};
