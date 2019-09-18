const match = { params: { id: '1IztzhAGrbjtKkMbiPewJanhTXk' } };
const history = {
  push: jest.fn(),
};
const fetchDetails = jest.fn();
const getCloudProviders = jest.fn();
const invalidateClusters = jest.fn();
const getOrganizationAndQuota = jest.fn();
const refreshFunc = jest.fn();
const openModal = jest.fn();
const closeModal = jest.fn();
const getLogs = jest.fn();
const getUsers = jest.fn();
const getClusterIdentityProviders = jest.fn();
const clearGlobalError = jest.fn();
const setGlobalError = jest.fn();
const getAlerts = jest.fn();
const getNodes = jest.fn();

const subscriptionInfo = {
  id: '1FDpnxsGxqFFFp2VNIWp5VajPc8',
  kind: 'Subscription',
  href: '/api/accounts_mgmt/v1/subscriptions/1FDpnxsGxqFFFp2VNIWp5VajPc8',
  plan: {
    id: 'OCP',
    kind: 'Plan',
    href: '/api/accounts_mgmt/v1/plans/OCP',
  },
  registry_credential: {
    id: '1EaZd2cDHH6ibIb1FFqav2Mles6',
    kind: 'RegistryCredential',
    href: '/api/accounts_mgmt/v1/registry_credentials/1EaZd2cDHH6ibIb1FFqav2Mles6',
  },
  cluster_id: '1IztzhAGrbjtKkMbiPewJanhTXk',
  external_cluster_id: 'test-liza',
  last_telemetry_date: '0001-01-01T00:00:00Z',
  created_at: '2019-01-02T18:28:14.851121Z',
  updated_at: '2019-01-02T18:28:14.851121Z',
};

const clusterDetails = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: true,
  cluster: {
    kind: 'Cluster',
    id: '1IztzhAGrbjtKkMbiPewJanhTXk',
    href: '/api/clusters_mgmt/v1/clusters/1IztzhAGrbjtKkMbiPewJanhTXk',
    name: 'test-liza',
    external_id: '9f50940b-fba8-4c59-9c6c-d64284b2026d',
    display_name: 'test-liza',
    creation_timestamp: '2019-03-26T15:18:39.06783Z',
    cloud_provider: {
      kind: 'CloudProviderLink',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
    },
    region: {
      kind: 'CloudRegionLink',
      id: 'us-east-1',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-east-1',
    },
    console: {
      url: 'https://console-openshift-console.apps.test-liza.sdev.devshift.net',
    },
    api: {
      url: 'https://api.test-liza.sdev.devshift.net:6443',
    },
    nodes: {
      total: 5,
      master: 3,
      compute: 2,
    },
    metrics: {
      memory: {
        updated_timestamp: '0001-01-01T00:00:00Z',
        used: {
          value: 0,
          unit: 'B',
        },
        total: {
          value: 0,
          unit: 'B',
        },
      },
      cpu: {
        updated_timestamp: '0001-01-01T00:00:00Z',
        used: {
          value: 0,
          unit: '',
        },
        total: {
          value: 0,
          unit: '',
        },
      },
      sockets: {
        updated_timestamp: '0001-01-01T00:00:00Z',
        used: {
          value: 0,
          unit: '',
        },
        total: {
          value: 0,
          unit: '',
        },
      },
      storage: {
        updated_timestamp: '0001-01-01T00:00:00Z',
        used: {
          value: 0,
          unit: 'B',
        },
        total: {
          value: 0,
          unit: 'B',
        },
      },
      nodes: {
        total: 3,
        master: 2,
        compute: 1,
      },
    },
    state: 'ready',
    flavour: {
      kind: 'FlavourLink',
      id: 'osd-4',
      href: '/api/clusters_mgmt/v1/flavours/osd-4',
    },
    dns: {
      base_domain: 'sdev.devshift.net',
    },
    network: {
      machine_cidr: '10.0.0.0/16',
      service_cidr: '172.30.0.0/16',
      pod_cidr: '10.128.0.0/14',
      router_shards: {
        kind: 'RouterShardListLink',
        href: '/api/clusters_mgmt/v1/clusters/1IztzhAGrbjtKkMbiPewJanhTXk/router_shards',
        id: '1IztzhAGrbjtKkMbiPewJanhTXk',
      },
    },
    multi_az: false,
    managed: true,
    version: {
      kind: 'VersionLink',
      id: 'openshift-v4.0-latest',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.0-latest',
    },
    canEdit: true,
    canDelete: true,
    subscription: subscriptionInfo,
  },
};

const cloudProviders = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: true,
  providers: {
    aws: {
      kind: 'CloudProvider',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      name: 'aws',
      display_name: 'Amazon Web Services',
      regions: {
        'ap-northeast-1': {
          kind: 'CloudRegion',
          id: 'ap-northeast-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-northeast-1',
          display_name: 'Asia Pacific (Tokyo)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'ap-northeast-2': {
          kind: 'CloudRegion',
          id: 'ap-northeast-2',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-northeast-2',
          display_name: 'Asia Pacific (Seoul)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'ap-south-1': {
          kind: 'CloudRegion',
          id: 'ap-south-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-south-1',
          display_name: 'Asia Pacific (Mumbai)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'ap-southeast-1': {
          kind: 'CloudRegion',
          id: 'ap-southeast-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-southeast-1',
          display_name: 'Asia Pacific (Singapore)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'ap-southeast-2': {
          kind: 'CloudRegion',
          id: 'ap-southeast-2',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ap-southeast-2',
          display_name: 'Asia Pacific (Sydney)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'ca-central-1': {
          kind: 'CloudRegion',
          id: 'ca-central-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/ca-central-1',
          display_name: 'Canada (Central)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'eu-central-1': {
          kind: 'CloudRegion',
          id: 'eu-central-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-central-1',
          display_name: 'EU (Frankfurt)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'eu-west-1': {
          kind: 'CloudRegion',
          id: 'eu-west-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-1',
          display_name: 'EU (Ireland)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'eu-west-2': {
          kind: 'CloudRegion',
          id: 'eu-west-2',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-2',
          display_name: 'EU (London)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'eu-west-3': {
          kind: 'CloudRegion',
          id: 'eu-west-3',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-3',
          display_name: 'EU (Paris)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'sa-east-1': {
          kind: 'CloudRegion',
          id: 'sa-east-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/sa-east-1',
          display_name: 'South America (São Paulo)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'us-east-1': {
          kind: 'CloudRegion',
          id: 'us-east-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-east-1',
          display_name: 'US East (N. Virginia)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'us-east-2': {
          kind: 'CloudRegion',
          id: 'us-east-2',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-east-2',
          display_name: 'US East (Ohio)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'us-west-1': {
          kind: 'CloudRegion',
          id: 'us-west-1',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-1',
          display_name: 'US West (N. California)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
        'us-west-2': {
          kind: 'CloudRegion',
          id: 'us-west-2',
          href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-2',
          display_name: 'US West (Oregon)',
          cloud_provider: {
            kind: 'CloudProviderLink',
            id: 'aws',
            href: '/api/clusters_mgmt/v1/cloud_providers/aws',
          },
        },
      },
    },
  },
};

const clusterIdentityProviders = {
  clusterIDPList: [],
};

const organization = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: true,
  details: {
    id: '1Iin1ev64UIFFjRPT5S8TfLr0Tj',
    kind: 'Organization',
    href: '/api/accounts_mgmt/v1/organizations/1Iin1ev64UIFFjRPT5S8TfLr0Tj',
    created_at: '2019-01-02T18:28:14.851121Z',
    updated_at: '2019-01-02T18:28:14.851121Z',
    external_id: '9999999',
    name: 'Test Corp',
  },
};


export {
  match,
  history,
  fetchDetails,
  getCloudProviders,
  getClusterIdentityProviders,
  getOrganizationAndQuota,
  invalidateClusters,
  refreshFunc,
  openModal,
  closeModal,
  getLogs,
  getUsers,
  clusterDetails,
  cloudProviders,
  clusterIdentityProviders,
  organization,
  clearGlobalError,
  setGlobalError,
  getAlerts,
  getNodes,
};
