import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';

/**
 * Returns a ClusterAutoscaler object which has all the known fields that the UI should
 * allow to edit, and has their default as per the k8s documentation:
 * https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-the-parameters-to-ca
 *
 * Notes:
 *
 * 1. Not all fields available in the documentation are currently supported by the API.
 *  The UI only defines those supported by the API
 *
 * 2. Some fields from the API are named differently from the k8s setting.
 * The name change can be seen applied by the function "AutoscalerArgs" from:
 * https://github.com/openshift/cluster-autoscaler-operator/blob/master/pkg/controller/clusterautoscaler/clusterautoscaler.go

 * 3. The accepted format for each field can be found in:
 * https://github.com/openshift/cluster-autoscaler-operator/blob/master/pkg/apis/autoscaling/v1/clusterautoscaler_types.go
 *
 * @returns ClusterAutoscaler object with correct defaults
 */
const getDefaultClusterAutoScaling = (): Required<ClusterAutoscaler> => ({
  // UI Balancing section (not grouped on the API object definition)
  balance_similar_node_groups: false,
  skip_nodes_with_local_storage: true,
  log_verbosity: 1, // 1 to 6
  // "max_pod_grace_period" in the API is mapped to "max-graceful-termination-sec" in k8s
  max_pod_grace_period: 600,

  // UI Resource limits section
  resource_limits: {
    max_nodes_total: 0,
    cores: {
      min: 1,
      max: 320000,
    },
    memory: {
      min: 1,
      max: 6400000,
    },
  },
  //
  // UI Scale down section
  scale_down: {
    enabled: true,
    delay_after_add: '10m',
    delay_after_delete: '0s',
    delay_after_failure: '3m',
    utilization_threshold: '0.5', // 0 to 1
    unneeded_time: '10m',
  },
});

/**
 * Transforms the data in the form, to that which can be submitted
 *
 * @param formAutoscaler formData to submit
 */
const getClusterAutoScalingSubmitSettings = (
  formAutoscaler: ClusterAutoscaler & { isSelected?: boolean },
): ClusterAutoscaler => {
  let scaleDown;
  if (formAutoscaler.scale_down?.enabled) {
    scaleDown = { ...formAutoscaler.scale_down };
    scaleDown.utilization_threshold = `${scaleDown.utilization_threshold}`; // Is defined as a string in the API
  } else {
    scaleDown = { enabled: false };
  }

  const settings = {
    ...formAutoscaler,
    scale_down: scaleDown,
  };

  // @ts-ignore
  delete settings.isSelected;
  return settings;
};

/**
 * Transforms the data from the API, to that which can be used in the forms
 * @param apiAutoscaler autoscaler from the API
 */
const getCompleteFormClusterAutoscaling = (apiAutoscaler: ClusterAutoscaler) => {
  const formAutoscaler = { ...apiAutoscaler };
  const defaultAutoscaler = getDefaultClusterAutoScaling();
  if (!formAutoscaler.scale_down) {
    formAutoscaler.scale_down = defaultAutoscaler.scale_down;
  }

  if (!formAutoscaler.scale_down.delay_after_add) {
    formAutoscaler.scale_down.delay_after_add = defaultAutoscaler.scale_down.delay_after_add;
  }
  if (!formAutoscaler.scale_down.delay_after_delete) {
    formAutoscaler.scale_down.delay_after_delete = defaultAutoscaler.scale_down.delay_after_delete;
  }
  if (!formAutoscaler.scale_down.delay_after_failure) {
    formAutoscaler.scale_down.delay_after_failure =
      defaultAutoscaler.scale_down.delay_after_failure;
  }
  if (!formAutoscaler.scale_down.unneeded_time) {
    formAutoscaler.scale_down.unneeded_time = defaultAutoscaler.scale_down.unneeded_time;
  }
  if (!formAutoscaler.scale_down.utilization_threshold) {
    formAutoscaler.scale_down.utilization_threshold =
      defaultAutoscaler.scale_down.utilization_threshold;
  }

  return formAutoscaler;
};

export {
  getDefaultClusterAutoScaling,
  getClusterAutoScalingSubmitSettings,
  getCompleteFormClusterAutoscaling,
};
