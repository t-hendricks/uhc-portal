const clustersWithIssues = [
  {
    kind: 'Cluster',
    id: '1IztzhAGrbjtKkMbiPewJanhTXk',
    href: '/api/clusters_mgmt/v1/clusters/1IztzhAGrbjtKkMbiPewJanhTXk',
    name: 'test-liza',
    external_id: '9f50940b-fba8-4c59-9c6c-d64284b2026d',
    display_name: 'test-liza',
    cluster_admin_enabled: false,
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
    storage_quota: {
      value: 107374182400,
      unit: 'B',
    },
    load_balancer_quota: 0,
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
      critical_alerts_firing: 5,
    },
    health_state: 'unhealthy',
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
    subscription: {
      id: 'foo',
    },
  },
];

const expiredTrials = [
  {
    display_name: 'my cluster',
    canEdit: true,
    id: 'foo',
  },
  {
    display_name: 'other cluster',
    canEdit: false,
    id: 'foo',
  },
];

export { clustersWithIssues, expiredTrials };
