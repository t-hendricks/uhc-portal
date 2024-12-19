import type { OneMetric } from '~/types/accounts_mgmt.v1';

export const defaultMetric: Readonly<OneMetric> = {
  cloud_provider: '',
  cluster_type: '',
  compute_nodes_cpu: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  compute_nodes_memory: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  compute_nodes_sockets: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  console_url: '',
  cpu: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  critical_alerts_firing: 0,
  memory: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  nodes: {
    compute: undefined,
    infra: undefined,
    master: undefined,
    total: undefined,
  },
  non_virt_nodes: 0,
  openshift_version: '',
  operating_system: '',
  operators_condition_failing: 0,
  region: '',
  sockets: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  state: '',
  state_description: '',
  storage: {
    total: {
      unit: '',
      value: 0,
    },
    updated_timestamp: '',
    used: {
      unit: '',
      value: 0,
    },
  },
  subscription_cpu_total: 0,
  subscription_obligation_exists: 0,
  subscription_socket_total: 0,
  upgrade: {
    available: undefined,
    state: undefined,
    updated_timestamp: undefined,
    version: undefined,
  },
};
