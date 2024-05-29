const nodePoolsWithoutAutoScale = [
  {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/2bh6ffvmaaai0bmkt7g179hsl02163f3/node_pools/workers',
    id: 'workers',
    replicas: 6,
    auto_repair: true,
    aws_node_pool: {
      instance_type: 'm5.xlarge',
      instance_profile:
        'rosa-service-managed-staging-2bh6ffvmaaai0bmkt7g179hsl02163f3-re-hcp-idp-worker',
      tags: {
        'api.openshift.com/environment': 'staging',
        'api.openshift.com/id': '2bh6ffvmaaai0bmkt7g179hsl02163f3',
        'api.openshift.com/legal-entity-id': '1wuVGGV6SCmD8ya6yRGEJzvmVuC',
        'api.openshift.com/name': 're-hcp-idp',
        'api.openshift.com/nodepool-hypershift': 're-hcp-idp-workers',
        'api.openshift.com/nodepool-ocm': 'workers',
        'red-hat-clustertype': 'rosa',
        'red-hat-managed': 'true',
      },
    },
    availability_zone: 'us-west-2a',
    subnet: 'subnet-09fe4ad03a4dcfb02',
    status: {
      current_replicas: 2,
      message: 'Minimum availability requires 2 replicas, current 0 available',
    },
    version: {
      kind: 'VersionLink',
      id: 'openshift-v4.15.13',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.15.13',
    },
    tuning_configs: [],
    kubelet_configs: [],
    node_drain_grace_period: {
      value: 0,
      unit: 'minutes',
    },
  },
];

const nodePoolsWithoutAutoScaleWithNoReplicas = [
  {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/2bh6ffvmaaai0bmkt7g179hsl02163f3/node_pools/workers',
    id: 'workers',
    auto_repair: true,
    aws_node_pool: {
      instance_type: 'm5.xlarge',
      instance_profile:
        'rosa-service-managed-staging-2bh6ffvmaaai0bmkt7g179hsl02163f3-re-hcp-idp-worker',
      tags: {
        'api.openshift.com/environment': 'staging',
        'api.openshift.com/id': '2bh6ffvmaaai0bmkt7g179hsl02163f3',
        'api.openshift.com/legal-entity-id': '1wuVGGV6SCmD8ya6yRGEJzvmVuC',
        'api.openshift.com/name': 're-hcp-idp',
        'api.openshift.com/nodepool-hypershift': 're-hcp-idp-workers',
        'api.openshift.com/nodepool-ocm': 'workers',
        'red-hat-clustertype': 'rosa',
        'red-hat-managed': 'true',
      },
    },
    availability_zone: 'us-west-2a',
    subnet: 'subnet-09fe4ad03a4dcfb02',
    status: {
      current_replicas: 0,
      message: 'Minimum availability requires 2 replicas, current 0 available',
    },
    version: {
      kind: 'VersionLink',
      id: 'openshift-v4.15.13',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.15.13',
    },
    tuning_configs: [],
    kubelet_configs: [],
    node_drain_grace_period: {
      value: 0,
      unit: 'minutes',
    },
  },
];

const nodePoolsWithAutoScale = [
  {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/2b4l705j1co3l7h14et70dv9jndfecad/node_pools/workers',
    id: 'workers',
    autoscaling: {
      min_replica: 2222,
      max_replica: 4444,
    },
    auto_repair: true,
    aws_node_pool: {
      instance_type: 'm5.xlarge',
      instance_profile:
        'rosa-service-managed-staging-2b4l705j1co3l7h14et70dv9jndfecad-re-hcp-2-worker',
      tags: {
        'api.openshift.com/environment': 'staging',
        'api.openshift.com/id': '2b4l705j1co3l7h14et70dv9jndfecad',
        'api.openshift.com/legal-entity-id': '1wuVGGV6SCmD8ya6yRGEJzvmVuC',
        'api.openshift.com/name': 're-hcp-2',
        'api.openshift.com/nodepool-hypershift': 're-hcp-2-workers',
        'api.openshift.com/nodepool-ocm': 'workers',
        'red-hat-clustertype': 'rosa',
        'red-hat-managed': 'true',
      },
    },
    availability_zone: 'us-west-2a',
    subnet: 'subnet-05ee8837049725a20',
    status: {
      current_replicas: 0,
      message: 'Minimum availability requires 2 replicas, current 0 available',
    },
    version: {
      kind: 'VersionLink',
      id: 'openshift-v4.15.11',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.15.11',
    },
    tuning_configs: [],
    kubelet_configs: [],
    node_drain_grace_period: {
      value: 0,
      unit: 'minutes',
    },
  },
];

const nodePoolsWithAutoScaleWithNoReplicas = [
  {
    kind: 'NodePool',
    href: '/api/clusters_mgmt/v1/clusters/2b4l705j1co3l7h14et70dv9jndfecad/node_pools/workers',
    id: 'workers',
    autoscaling: {},
    auto_repair: true,
    aws_node_pool: {
      instance_type: 'm5.xlarge',
      instance_profile:
        'rosa-service-managed-staging-2b4l705j1co3l7h14et70dv9jndfecad-re-hcp-2-worker',
      tags: {
        'api.openshift.com/environment': 'staging',
        'api.openshift.com/id': '2b4l705j1co3l7h14et70dv9jndfecad',
        'api.openshift.com/legal-entity-id': '1wuVGGV6SCmD8ya6yRGEJzvmVuC',
        'api.openshift.com/name': 're-hcp-2',
        'api.openshift.com/nodepool-hypershift': 're-hcp-2-workers',
        'api.openshift.com/nodepool-ocm': 'workers',
        'red-hat-clustertype': 'rosa',
        'red-hat-managed': 'true',
      },
    },
    availability_zone: 'us-west-2a',
    subnet: 'subnet-05ee8837049725a20',
    status: {
      current_replicas: 0,
      message: 'Minimum availability requires 2 replicas, current 0 available',
    },
    version: {
      kind: 'VersionLink',
      id: 'openshift-v4.15.11',
      href: '/api/clusters_mgmt/v1/versions/openshift-v4.15.11',
    },
    tuning_configs: [],
    kubelet_configs: [],
    node_drain_grace_period: {
      value: 0,
      unit: 'minutes',
    },
  },
];

const fixtures = {
  nodePoolsWithoutAutoScale,
  nodePoolsWithAutoScale,
  nodePoolsWithoutAutoScaleWithNoReplicas,
  nodePoolsWithAutoScaleWithNoReplicas,
};

export default fixtures;
