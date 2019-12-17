import get from 'lodash/get';

import { normalizeCluster } from './normalize';

// Before https://gitlab.cee.redhat.com/service/uhc-clusters-service/merge_requests/800
// Some data is fake.
const clusterWithMetricsAtTopLevel = {
  kind: 'Cluster',
  id: 'd39bb4c2331c7dd4b4183075c8afc27c',
  href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c',
  name: 'fake-cluster-with-real-external_id',
  external_id: '0a5af75f-d5cc-4e73-a404-44db2c9fa235',
  display_name: 'Fake clusters with real external_id',
  creation_timestamp: '2019-01-19T19:19:19Z',
  cloud_provider: {
    kind: 'CloudProviderLink',
    id: 'aws',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws',
  },
  openshift_version: '4.0.0-0.alpha-2019-04-10-154442',
  subscription: {
    kind: 'SubscriptionLink',
    id: 'subscription-id',
    href: '/api/accounts_mgmt/v1/subscriptions/subscription-id',
  },
  region: {
    kind: 'CloudRegionLink',
    id: 'us-west-1',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-1',
  },
  console: {
    url: 'https://console.example.com',
  },
  api: {
    url: 'https://api.example.com',
  },
  nodes: {
    total: 5,
    master: 3,
    compute: 2,
  },
  memory: {
    updated_timestamp: '2019-04-28T14:25:23Z',
    used: {
      value: 16541872128,
      unit: 'B',
    },
    total: {
      value: 82293346304,
      unit: 'B',
    },
  },
  cpu: {
    updated_timestamp: '2019-04-28T14:25:22Z',
    used: {
      value: 4.123549814433256,
      unit: '',
    },
    total: {
      value: 16,
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
  state: 'error',
  flavour: {
    kind: 'FlavourLink',
    id: 'osd-4',
    href: '/api/clusters_mgmt/v1/flavours/osd-4',
  },
  groups: {
    kind: 'GroupListLink',
    href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c/groups',
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
      href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c/router_shards',
      id: 'd39bb4c2331c7dd4b4183075c8afc27c',
    },
  },
  multi_az: false,
  managed: true,
  version: {
    kind: 'VersionLink',
    id: 'openshift-v4.0-latest',
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.0-latest',
  },
  identity_providers: {
    kind: 'IdentityProviderListLink',
    href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c/identity_providers',
  },
};

// After https://gitlab.cee.redhat.com/service/uhc-clusters-service/merge_requests/800
// Some data is fake.
const clusterWithMetricsSubobject = {
  kind: 'Cluster',
  id: 'd39bb4c2331c7dd4b4183075c8afc27c',
  href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c',
  name: 'fake-cluster-with-real-external_id',
  external_id: '0a5af75f-d5cc-4e73-a404-44db2c9fa235',
  display_name: 'Fake clusters with real external_id',
  creation_timestamp: '2019-01-19T19:19:19Z',
  cloud_provider: {
    kind: 'CloudProviderLink',
    id: 'aws',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws',
  },
  openshift_version: '4.0.0-0.alpha-2019-04-10-154442',
  subscription: {
    kind: 'SubscriptionLink',
    id: 'subscription-id',
    href: '/api/accounts_mgmt/v1/subscriptions/subscription-id',
  },
  region: {
    kind: 'CloudRegionLink',
    id: 'us-west-1',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-1',
  },
  console: {
    url: 'https://console.example.com',
  },
  api: {
    url: 'https://api.example.com',
  },
  nodes: {
    total: 5,
    master: 3,
    compute: 2,
  },
  state: 'error',
  flavour: {
    kind: 'FlavourLink',
    id: 'osd-4',
    href: '/api/clusters_mgmt/v1/flavours/osd-4',
  },
  groups: {
    kind: 'GroupListLink',
    href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c/groups',
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
      href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c/router_shards',
      id: 'd39bb4c2331c7dd4b4183075c8afc27c',
    },
  },
  multi_az: false,
  managed: true,
  version: {
    kind: 'VersionLink',
    id: 'openshift-v4.0-latest',
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.0-latest',
  },
  identity_providers: {
    kind: 'IdentityProviderListLink',
    href: '/api/clusters_mgmt/v1/clusters/d39bb4c2331c7dd4b4183075c8afc27c/identity_providers',
  },
  metrics: {
    memory: {
      updated_timestamp: '2019-04-28T14:23:19Z',
      used: {
        value: 16546058240,
        unit: 'B',
      },
      total: {
        value: 82293346304,
        unit: 'B',
      },
    },
    cpu: {
      updated_timestamp: '2019-04-28T14:23:18Z',
      used: {
        value: 3.995410922987096,
        unit: '',
      },
      total: {
        value: 16,
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
      total: 7,
      master: 3,
      compute: 4,
    },
  },
};

// TODO: finalize when https://jira.coreos.com/browse/SDA-821 is completed.
const clusterWithMissingMetrics = {
  kind: 'Cluster',
  id: '8d6ad4b972ca06f7dd6b99ebd99087eb',
  href: '/api/clusters_mgmt/v1/clusters/8d6ad4b972ca06f7dd6b99ebd99087eb',
  name: 'fake-cluster-with-real-external_id',
  external_id: '00051f02-ba55-4262-a8d2-56de91434003',
  display_name: 'Fake clusters with real external_id',
  creation_timestamp: '2019-01-19T19:19:19Z',
  cloud_provider: {
    kind: 'CloudProviderLink',
    id: 'aws',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws',
  },
  openshift_version: 'openshift ver',
  subscription: {
    kind: 'SubscriptionLink',
    id: 'subscription-id',
    href: '/api/accounts_mgmt/v1/subscriptions/subscription-id',
  },
  region: {
    kind: 'CloudRegionLink',
    id: 'us-west-1',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/us-west-1',
  },
  console: {
    url: 'https://console.example.com',
  },
  api: {
    url: 'https://api.example.com',
  },
  nodes: {
    total: 5,
    master: 3,
    compute: 2,
  },
  state: 'error',
  flavour: {
    kind: 'FlavourLink',
    id: 'osd-4',
    href: '/api/clusters_mgmt/v1/flavours/osd-4',
  },
  groups: {
    kind: 'GroupListLink',
    href: '/api/clusters_mgmt/v1/clusters/8d6ad4b972ca06f7dd6b99ebd99087eb/groups',
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
      href: '/api/clusters_mgmt/v1/clusters/8d6ad4b972ca06f7dd6b99ebd99087eb/router_shards',
      id: '8d6ad4b972ca06f7dd6b99ebd99087eb',
    },
  },
  multi_az: false,
  managed: true,
  version: {
    kind: 'VersionLink',
    id: 'openshift-v4.0-latest',
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.0-latest',
  },
  identity_providers: {
    kind: 'IdentityProviderListLink',
    href: '/api/clusters_mgmt/v1/clusters/8d6ad4b972ca06f7dd6b99ebd99087eb/identity_providers',
  },
  metrics: {
    memory: {
      used: {
        unit: 'B',
      },
      total: {
        unit: 'B',
      },
    },
    cpu: {
      used: {
        unit: '',
      },
      total: {
        unit: '',
      },
    },
    storage: {
      used: {
        unit: 'B',
      },
      total: {
        unit: 'B',
      },
    },
    nodes: {},
  },
};

test('Normalizes cluster from old API before .metrics subobject', () => {
  const res = normalizeCluster(clusterWithMetricsAtTopLevel);
  expect(res.metrics.cpu.total).toEqual({ value: 16, unit: '' });
  // node counts were not available in old API
  expect(res.metrics.nodes.master).toBeUndefined();
});

test('Normalizes cluster from new API with .metrics subobject', () => {
  const res = normalizeCluster(clusterWithMetricsSubobject);
  expect(res.metrics.cpu.total).toEqual({ value: 16, unit: '' });
  expect(res.metrics.nodes.master).toEqual(3);
});

test('Normalizes cluster whose metrics fields completely missing', () => {
  const res = normalizeCluster(clusterWithMissingMetrics);
  expect(get(res, 'metrics.cpu.total.value')).toBeUndefined();
  expect(get(res, 'metrics.nodes.master')).toBeUndefined();
});
