import produce from 'immer';

const mockNodes = {
  data: [
    {
      internal_ip: '10.0.139.97:9537',
      hostname: 'ip-10-0-139-97.us-west-2.compute.internal',
      up: true,
      time: '1562168629557',
    },
    {
      internal_ip: '10.0.152.98',
      hostname: 'ip-10-0-133-185.ec2.internal',
      up: true,
      time: '1562168629557',
    },
    {
      internal_ip: '10.0.143.198',
      hostname: 'ip-10-0-143-198.ec2.internal',
      up: false,
      time: '1562168629557',
    },
  ],
};

const mockAlerts = {
  data: [
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'warning',
    },
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'critical',
    },
    {
      name: 'SomeAlert',
      severity: 'critical',
    },
    {
      name: 'SomeOtherAlert',
      severity: 'warning',
    },
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'warning',
    },
    {
      name: 'test',
      severity: 'info',
    },
    {
      name: 'DeadMansSwitch',
      severity: 'none',
    },
    {
      name: 'Watchdog',
      severity: 'none',
    },
  ],
};

const mockOperators = {
  data: [
    {
      time: '2020-07-20T08:59:35Z',
      name: 'storage',
      condition: 'available',
      reason: 'AsExpected',
      version: '4.3.18',
    },
    {
      time: '2020-07-20T08:59:35Z',
      name: 'version',
      condition: 'failing',
      reason: 'ClusterOperatorDegraded',
      version: '',
    },
  ],
};


const mockWatchdog = [{ name: 'Watchdog', severity: 'none' }];

const resourceUsageWithIssues = {
  memory: {
    updated_timestamp: '2019-04-28T14:23:19Z',
    used: {
      value: 16546058240,
      unit: 'B',
    },
    total: {
      value: 16546058239,
      unit: 'B',
    },
  },
  cpu: {
    updated_timestamp: '2019-04-28T14:23:18Z',
    used: {
      value: 15.5,
      unit: '',
    },
    total: {
      value: 16,
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
    total: 7,
    master: 3,
    compute: 4,
  },
};

const resourceUsageWithoutIssues = {
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
    total: 7,
    master: 3,
    compute: 4,
  },
};


const mockOCPDisconnectedClusterDetails = {
  kind: 'Cluster',
  id: '19bap5d1h6q3p9qsdjsgjrpv1esfhfnb',
  href: '/api/clusters_mgmt/v1/clusters/19bap5d1h6q3p9qsdjsgjrpv1esfhfnb',
  name: '1a7744e6-cd0f-4284-918d-357c1f615a4d',
  external_id: '1a7744e6-cd0f-4284-918d-357c1f615a4d',
  display_name: 'sdqe-ui-ocp',
  creation_timestamp: '2019-11-11T06:07:17.284553Z',
  activity_timestamp: '2019-11-11T06:07:17.284553Z',
  subscription: {
    id: '1TSTL53YWg1quyM9eVEEmyxIR4a',
    kind: 'Subscription',
    href: '/api/accounts_mgmt/v1/subscriptions/1TSTL53YWg1quyM9eVEEmyxIR4a',
    plan: {
      id: 'OCP',
      kind: 'Plan',
      href: '/api/accounts_mgmt/v1/plans/OCP',
    },
    cluster_id: '19bap5d1h6q3p9qsdjsgjrpv1esfhfnb',
    external_cluster_id: '1a7744e6-cd0f-4284-918d-357c1f615a4d',
    organization_id: '1H9rUtbuFqawEdQU5GPHD9W107I',
    last_telemetry_date: '0001-01-01T00:00:00Z',
    created_at: '2019-11-11T06:07:17.695469Z',
    updated_at: '2019-11-26T06:15:34.118717Z',
    display_name: 'sdqe-ui-ocp',
    creator: {
      id: '1DyducJhQOLfPochPyobQCfwJcW',
      kind: 'Account',
      href: '/api/accounts_mgmt/v1/accounts/1DyducJhQOLfPochPyobQCfwJcW',
      name: 'Xue Listg0001',
      username: 'xueli-stg0001',
    },
    managed: false,
    status: 'Disconnected',
    last_reconcile_date: '0001-01-01T00:00:00Z',
  },
  nodes: {
    total: 0,
    master: 0,
    compute: 0,
  },
  state: 'ready',
  groups: {
    kind: 'GroupListLink',
    href: '/api/clusters_mgmt/v1/clusters/19bap5d1h6q3p9qsdjsgjrpv1esfhfnb/groups',
  },
  network: {
    router_shards: {
      kind: 'RouterShardListLink',
      href: '/api/clusters_mgmt/v1/clusters/19bap5d1h6q3p9qsdjsgjrpv1esfhfnb/router_shards',
      id: '19bap5d1h6q3p9qsdjsgjrpv1esfhfnb',
    },
  },
  multi_az: false,
  managed: false,
  storage_quota: {
    value: 0,
    unit: 'B',
  },
  load_balancer_quota: 0,
  identity_providers: {
    kind: 'IdentityProviderListLink',
    href: '/api/clusters_mgmt/v1/clusters/19bap5d1h6q3p9qsdjsgjrpv1esfhfnb/identity_providers',
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
      updated_timestamp: '2019-11-11T06:07:17.284553Z',
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 1,
        unit: '',
      },
    },
    compute_nodes_memory: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      total: {
        value: 0,
        unit: 'B',
      },
    },
    compute_nodes_cpu: {
      updated_timestamp: '0001-01-01T00:00:00Z',
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
    nodes: {},
    version_update_available: false,
    operating_system: 'Red Hat Enterprise Linux CoreOS',
    upgrade: {
      available: false,
    },
  },
  addons: {
    kind: 'AddOnListLink',
    href: '/api/clusters_mgmt/v1/clusters/19bap5d1h6q3p9qsdjsgjrpv1esfhfnb/addons',
    items: null,
  },
  shouldRedirect: false,
  canEdit: true,
  canDelete: true,
};

const mockOCPActiveClusterDetails = produce(mockOCPDisconnectedClusterDetails, (draft) => {
  draft.subscription.status = 'Active';
});

const minute = 60 * 1000;
const hour = 60 * minute;
const makeFutureDate = () => new Date(Date.now() + 2 * minute);
const makeFreshCheckIn = () => new Date(Date.now() - (2 * hour + 20 * minute));
const makeStaleCheckIn = () => new Date(Date.now() - (3 * hour + 20 * minute));

export {
  mockAlerts,
  mockWatchdog,
  mockNodes,
  mockOperators,
  resourceUsageWithIssues,
  resourceUsageWithoutIssues,
  mockOCPActiveClusterDetails,
  mockOCPDisconnectedClusterDetails,
  makeFutureDate,
  makeFreshCheckIn,
  makeStaleCheckIn,
};
