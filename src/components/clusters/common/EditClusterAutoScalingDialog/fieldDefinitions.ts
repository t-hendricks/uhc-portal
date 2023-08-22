import get from 'lodash/get';

import { getDefaultClusterAutoScaling } from '~/components/clusters/CreateOSDPage/clusterAutoScalingValues';

export interface FieldDefinition {
  label: string;
  name: string;
  type: 'boolean' | 'number' | 'gpu' | 'min-max' | 'time';
  defaultValue: string | boolean | number;
}

const defaultValues = getDefaultClusterAutoScaling();

const balancerFields: FieldDefinition[] = [
  {
    label: 'balanceSimilarNodeGroups',
    name: 'balance_similar_node_groups',
    type: 'boolean',
    defaultValue: get(defaultValues, 'balance_similar_node_groups', false),
  },
  {
    label: 'maxPodGracePeriod (max-graceful-termination-sec)',
    name: 'max_pod_grace_period',
    type: 'number', // expressed in seconds
    defaultValue: get(defaultValues, 'max_pod_grace_period', 0),
  },
  {
    label: 'logVerbosity',
    name: 'log_verbosity',
    type: 'number',
    defaultValue: get(defaultValues, 'log_verbosity', 1),
  },
  {
    label: 'skipNodesWithLocalStorage',
    name: 'skip_nodes_with_local_storage',
    type: 'boolean',
    defaultValue: get(defaultValues, 'skip_nodes_with_local_storage', false),
  },
];

const resourceLimitsFields: FieldDefinition[] = [
  {
    label: 'cores.min',
    name: 'resource_limits.cores.min',
    type: 'min-max',
    defaultValue: get(defaultValues, 'resource_limits.cores.min', 0),
  },
  {
    label: 'cores.max',
    name: 'resource_limits.cores.max',
    type: 'min-max',
    defaultValue: get(defaultValues, 'resource_limits.cores.max', 0),
  },
  {
    label: 'memory.min',
    name: 'resource_limits.memory.min',
    type: 'min-max',
    defaultValue: get(defaultValues, 'resource_limits.memory.min', 0),
  },
  {
    label: 'memory.max',
    name: 'resource_limits.memory.max',
    type: 'min-max',
    defaultValue: get(defaultValues, 'resource_limits.memory.max', 0),
  },
  {
    label: 'maxNodesTotal',
    name: 'resource_limits.max_nodes_total',
    type: 'number',
    defaultValue: get(defaultValues, 'resource_limits.max_nodes_total', 0),
  },
];

const scaleDownFields: FieldDefinition[] = [
  {
    label: 'enable',
    name: 'scale_down.enabled',
    type: 'boolean',
    defaultValue: get(defaultValues, 'scale_down.enabled', false),
  },
  {
    label: 'scaleDown.utilizationThreshold',
    name: 'scale_down.utilization_threshold',
    type: 'number',
    defaultValue: get(defaultValues, 'scale_down.utilization_threshold', 0),
  },
  {
    label: 'scaleDown.unneededTime',
    name: 'scale_down.unneeded_time',
    type: 'time',
    defaultValue: get(defaultValues, 'scale_down.unneeded_time', ''),
  },
  {
    label: 'scaleDown.delayAfterAdd',
    name: 'scale_down.delay_after_add',
    type: 'time',
    defaultValue: get(defaultValues, 'scale_down.delay_after_add', ''),
  },
  {
    label: 'scaleDown.delayAfterDelete',
    name: 'scale_down.delay_after_delete',
    type: 'time',
    defaultValue: get(defaultValues, 'scale_down.delay_after_delete', ''),
  },
  {
    label: 'scaleDown.delayAfterFailure',
    name: 'scale_down.delay_after_failure',
    type: 'time',
    defaultValue: get(defaultValues, 'scale_down.delay_after_failure', ''),
  },
];
export { balancerFields, scaleDownFields, resourceLimitsFields };
