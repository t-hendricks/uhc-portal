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

export const mockedClusterLogs = {
  kind: 'ClusterLogList',
  page: 1,
  size: 5,
  total: 5,
  items: [
    {
      cluster_id: '2a4tguaod170v2-mock',
      cluster_uuid: '7d72f3d1-17cc-495-mock',
      created_at: '2024-04-09T23:13:21.559092Z',
      created_by: 'service-account-ocm-cs-staging',
      description:
        'Cluster has a new upgrade version available, 4.15.6. Find more information about this version in the release notes: https://docs.openshift.com/container-platform/4.15/release_notes/ocp-4-15-release-notes.html#ocp-4-15-6.',
      id: '2ess14DHIPDNNrytmuLYPkmM3fx',
      kind: 'ClusterLog',
      log_type: 'Cluster Updates',
      service_name: 'ClusterService',
      severity: 'Info',
      summary: 'New upgrade version available',
      timestamp: '2024-04-09T23:13:19Z',
    },
    {
      cluster_id: '2a4tguaod170v2-mock',
      cluster_uuid: '7d72f3d1-17cc-495-mock',
      created_at: '2024-04-15T12:13:08.567392Z',
      created_by: 'service-account-ocm-cs-staging',
      description:
        'Cluster has a new upgrade version available, 4.15.8. Find more information about this version in the release notes: https://docs.openshift.com/container-platform/4.15/release_notes/ocp-4-15-release-notes.html#ocp-4-15-8.',
      id: '2f8WSyOjmkHUHSCpW1n6TU8N9Ub',
      kind: 'ClusterLog',
      log_type: 'Cluster Updates',
      service_name: 'ClusterService',
      severity: 'Info',
      summary: 'New upgrade version available',
      timestamp: '2024-04-15T12:13:07Z',
    },
    {
      cluster_id: '2a4tguaod170v2-mock',
      cluster_uuid: '7d72f3d1-17cc-495-mock',
      created_at: '2024-04-20T08:29:33.784039Z',
      created_by: 'service-account-ocm-cs-staging',
      description:
        'WaitingForAvailableMachines: Minimum availability requires 2 replicas, current 0 available',
      id: '2fMCtLggsJGzzcSmXrrVlOA0Uxt',
      kind: 'ClusterLog',
      log_type: 'Cluster Scaling',
      service_name: 'ClusterService',
      severity: 'Info',
      summary: "Node pool 'workers' in cluster '2a4tguaod170v2su3msth4v93mqqa68m' has been synced",
      timestamp: '2024-04-20T08:29:32Z',
    },
    {
      cluster_id: '2a4tguaod170v2-mock',
      cluster_uuid: '7d72f3d1-17cc-495-mock',
      created_at: '2024-04-23T19:16:38.008502Z',
      created_by: 'service-account-ocm-cs-staging',
      description:
        'Cluster has a new upgrade version available, 4.15.9. Find more information about this version in the release notes: https://docs.openshift.com/container-platform/4.15/release_notes/ocp-4-15-release-notes.html#ocp-4-15-9.',
      id: '2fVwxRWtheIv9vahpXx4jt3uevF',
      kind: 'ClusterLog',
      log_type: 'Cluster Updates',
      service_name: 'ClusterService',
      severity: 'Info',
      summary: 'New upgrade version available',
      timestamp: '2024-04-23T19:16:36Z',
    },
    {
      cluster_id: '2a4tguaod170v2-mock',
      cluster_uuid: '7d72f3d1-17cc-495-mock',
      created_at: '2024-05-02T19:24:28.634096Z',
      created_by: 'service-account-ocm-cs-staging',
      description:
        'Cluster has a new upgrade version available, 4.15.10. Find more information about this version in the release notes: https://docs.openshift.com/container-platform/4.15/release_notes/ocp-4-15-release-notes.html#ocp-4-15-10.',
      id: '2fvO1Mv0LvSCLRZEfruES8Q2B8V',
      kind: 'ClusterLog',
      log_type: 'Cluster Updates',
      service_name: 'ClusterService',
      severity: 'Info',
      summary: 'New upgrade version available',
      timestamp: '2024-05-02T19:24:27Z',
    },
  ],
};
