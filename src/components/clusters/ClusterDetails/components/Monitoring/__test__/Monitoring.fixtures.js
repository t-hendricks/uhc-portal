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
      up: true,
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
      name: 'Watchdog',
      severity: 'none',
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

const mockOSDCluserDetails = {
  kind: 'Cluster',
  id: '19q7etcl0t06eem79v912augfltmfp5e',
  href: '/api/clusters_mgmt/v1/clusters/19q7etcl0t06eem79v912augfltmfp5e',
  name: 'akeating-small',
  external_id: 'cea97c64-59cf-42ca-a2ad-5ce70e1af5d7',
  infra_id: 'akeating-small-gsd9k',
  display_name: 'akeating-small',
  creation_timestamp: '2019-12-03T20:28:39.340317Z',
  activity_timestamp: '2019-12-05T07:03:33Z',
  expiration_timestamp: '2019-12-06T20:28:37.846699Z',
  cloud_provider: {
    kind: 'CloudProviderLink',
    id: 'aws',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws',
  },
  openshift_version: '4.2.9',
  subscription: {
    id: '1UUIo3aNLfopPR6gkpKP9MOU4wg',
    kind: 'Subscription',
    href: '/api/accounts_mgmt/v1/subscriptions/1UUIo3aNLfopPR6gkpKP9MOU4wg',
    plan: {
      id: 'OSD',
      kind: 'Plan',
      href: '/api/accounts_mgmt/v1/plans/OSD',
    },
    cluster_id: '19q7etcl0t06eem79v912augfltmfp5e',
    external_cluster_id: 'cea97c64-59cf-42ca-a2ad-5ce70e1af5d7',
    organization_id: '1MW1Six1Nncu2wBFLMjFvAlRgmU',
    last_telemetry_date: '2019-12-05T06:37:06.187589Z',
    created_at: '2019-12-03T20:28:38.838621Z',
    updated_at: '2019-12-05T06:37:06.199433Z',
    support_level: 'Premium',
    display_name: 'akeating-small',
    creator: {
      id: '1SBehRWENLQKkmUXVBDENKeqdKA',
      kind: 'Account',
      href: '/api/accounts_mgmt/v1/accounts/1SBehRWENLQKkmUXVBDENKeqdKA',
      name: 'Aiden Keating',
      username: 'akeating_rhmi',
    },
    managed: true,
    status: 'Active',
    last_reconcile_date: '0001-01-01T00:00:00Z',
    entitlement_status: 'Ok',
  },
  region: {
    kind: 'CloudRegionLink',
    id: 'eu-west-1',
    href: '/api/clusters_mgmt/v1/cloud_providers/aws/regions/eu-west-1',
  },
  console: {
    url: 'https://console-openshift-console.apps.akeating-small.c2t9.s1.devshift.org',
  },
  api: {
    url: 'https://api.akeating-small.c2t9.s1.devshift.org:6443',
  },
  nodes: {
    total: 5,
    master: 1,
    compute: 4,
    compute_machine_type: {
      kind: 'MachineTypeLink',
      id: 'm5.xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
    },
  },
  state: 'ready',
  flavour: {
    kind: 'FlavourLink',
    id: 'osd-4',
    href: '/api/clusters_mgmt/v1/flavours/osd-4',
  },
  groups: {
    kind: 'GroupListLink',
    href: '/api/clusters_mgmt/v1/clusters/19q7etcl0t06eem79v912augfltmfp5e/groups',
  },
  dns: {
    base_domain: 'c2t9.s1.devshift.org',
  },
  network: {
    machine_cidr: '10.0.0.0/16',
    service_cidr: '172.30.0.0/16',
    pod_cidr: '10.128.0.0/14',
    router_shards: {
      kind: 'RouterShardListLink',
      href: '/api/clusters_mgmt/v1/clusters/19q7etcl0t06eem79v912augfltmfp5e/router_shards',
      id: '19q7etcl0t06eem79v912augfltmfp5e',
    },
  },
  multi_az: false,
  managed: true,
  version: {
    kind: 'VersionLink',
    id: 'openshift-v4.2.9',
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.2.9',
  },
  storage_quota: {
    value: 107374182400,
    unit: 'B',
  },
  load_balancer_quota: 0,
  identity_providers: {
    kind: 'IdentityProviderListLink',
    href: '/api/clusters_mgmt/v1/clusters/19q7etcl0t06eem79v912augfltmfp5e/identity_providers',
  },
  metrics: {
    memory: {
      updated_timestamp: '2019-12-05T07:03:33Z',
      used: {
        value: 15479918592,
        unit: 'B',
      },
      total: {
        value: 81645096960,
        unit: 'B',
      },
    },
    cpu: {
      updated_timestamp: '2019-12-05T07:03:33Z',
      used: {
        value: 1.3903333333335475,
        unit: '',
      },
      total: {
        value: 20,
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
    compute_nodes_memory: {
      updated_timestamp: '0001-01-01T00:00:00Z',
      total: {
        value: 65316077568,
        unit: 'B',
      },
    },
    compute_nodes_cpu: {
      updated_timestamp: '0001-01-01T00:00:00Z',
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
      total: 5,
      master: 1,
      compute: 4,
    },
    version_update_available: false,
    upgrade: {
      updated_timestamp: '2019-12-05T07:03:33Z',
      available: false,
    },
  },
  addons: {
    kind: 'AddOnListLink',
    href: '/api/clusters_mgmt/v1/clusters/19q7etcl0t06eem79v912augfltmfp5e/addons',
    items: null,
  },
  shouldRedirect: false,
  canEdit: true,
  canDelete: true,
};

const mockOCPClusterDetails = {
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
    entitlement_status: 'Ok',
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

const mockLastCheckIn = {
  hours: 2,
  minutes: 20,
  message: '2 hours ago',
};

export {
  mockAlerts,
  mockWatchdog,
  mockNodes,
  resourceUsageWithIssues,
  resourceUsageWithoutIssues,
  mockOSDCluserDetails,
  mockOCPClusterDetails,
  mockLastCheckIn,
};
