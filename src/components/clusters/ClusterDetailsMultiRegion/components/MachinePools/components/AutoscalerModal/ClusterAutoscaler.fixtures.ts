export const clusterAutoscalerData = {
  hasAutoscaler: true,
  data: {
    kind: 'ClusterAutoscaler',
    href: '/api/clusters_mgmt/v1/clusters/2c83rg71o7t2r98b6nqrl6mebd6k3tgv/autoscaler',
    balance_similar_node_groups: false,
    skip_nodes_with_local_storage: true,
    log_verbosity: 2,
    max_pod_grace_period: 600,
    pod_priority_threshold: -10,
    ignore_daemonsets_utilization: false,
    max_node_provision_time: '15m',
    resource_limits: {
      max_nodes_total: 180,
      cores: {
        min: 0,
        max: 11520,
      },
      memory: {
        min: 0,
        max: 230400,
      },
      gpus: '',
    },
    scale_down: {
      enabled: true,
      unneeded_time: '10m',
      utilization_threshold: '0.5',
      delay_after_add: '10m',
      delay_after_delete: '0s',
      delay_after_failure: '3m',
    },
    balancing_ignored_labels: '',
  },
};
