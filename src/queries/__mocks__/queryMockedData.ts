export const mockSubscriptionAxiosResponse = {
  plan: {
    id: 'ROSA',
    type: 'ROSA',
  },
  cluster_id: '123TEST',
};

export const mockSubscriptionData = {
  plan: {
    id: 'ROSA',
    type: 'ROSA',
  },
  status: 'ACTIVE',
  cluster_id: 'mockedClusterID',
  managed: true,
};

export const mockedSubscriptionWithClusterType = {
  subscription: mockSubscriptionData,
  isROSACluster: true,
  isAROCluster: false,
  isOSDCluster: false,
};

export const mockedClusterResponse = {
  data: {
    kind: 'Cluster',
    id: 'mockedClusterID',
    display_name: 'Mocked Cluster',
    state: 'ready',
    product: {
      id: 'rosa',
    },
  },
};

export const mockedCluster = {
  kind: 'Cluster',
  id: 'mockedClusterID',
  display_name: 'Mocked Cluster',
  state: 'ready',
  product: {
    id: 'rosa',
  },
};

export const mockedInflightChecks = {
  kind: 'InflightCheckList',
  page: 1,
  size: 1,
  total: 1,
  items: [
    {
      kind: 'InflightCheck',
      id: 'mockedInflightCheckID',
      name: 'egress',
      state: 'passed',
      restarts: 0,
    },
  ],
};

export const mockedLimitedSupportReasons = {
  kind: 'LimitedSupportReasonList',
  page: 0,
  size: 0,
  total: 0,
};

export const mockedCloudProviders = {
  kind: 'CloudProviderList',
  page: 1,
  size: 1,
  total: 1,
  items: [
    {
      kind: 'CloudProvider',
      id: 'aws',
      name: 'aws',
      display_name: 'AWS',
      regions: [
        {
          kind: 'CloudRegion',
          id: 'af-south-1',
          display_name: 'Africa (Cape Town)',
          enabled: true,
        },
        {
          kind: 'CloudRegion',
          id: 'eu-central-2',
          display_name: 'Europe, ZUrich',
          enabled: true,
        },
      ],
    },
  ],
};

export const mockedCloudProvidersResult = {
  aws: {
    kind: 'CloudProvider',
    id: 'aws',
    name: 'aws',
    display_name: 'AWS',
    regions: {
      'af-south-1': {
        id: 'af-south-1',
        display_name: 'Africa (Cape Town)',
        enabled: true,
        supports_multi_az: undefined,
        kms_location_id: undefined,
        ccs_only: undefined,
        supports_hypershift: undefined,
      },

      'eu-central-2': {
        id: 'eu-central-2',
        display_name: 'Europe, ZUrich',
        enabled: true,
        supports_multi_az: undefined,
        kms_location_id: undefined,
        ccs_only: undefined,
        supports_hypershift: undefined,
      },
    },
  },
};

export const clusterIDP = {
  kind: 'IdentityProviderList',
  page: 1,
  size: 1,
  total: 1,
  items: [
    {
      kind: 'IdentityProvider',
      type: 'HTPasswdIdentityProvider',
      id: 'mockedIdentityProviderID',
      name: 'mockedIDPName',
      mapping_method: 'claim',
      htpasswd: {
        users: {
          kind: 'HTPasswdUserListLink',
        },
      },
    },
  ],
};
