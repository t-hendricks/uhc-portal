import get from 'lodash/get';
import { getFormValues } from 'redux-form';

const minValueSelector = (isMultiAz, isByoc) => {
  const multiAzNodes = isByoc ? 3 : 9;
  const singleAzNodes = isByoc ? 2 : 4;

  return isMultiAz ? {
    value: multiAzNodes,
    validationMsg: `At least ${multiAzNodes} nodes are required for multiple availability zone cluster.`,
  } : {
    value: singleAzNodes,
    validationMsg: `At least ${singleAzNodes} nodes are required`,
  };
};


const shouldShowLoadBalancerAlert = (state) => {
  const { data } = state.modal;
  const modalQuota = get(data, 'load_balancer_quota', 0);
  const values = getFormValues('ScaleCluster')(state);
  const formQuota = get(values, 'load_balancers', 0);
  if (formQuota && modalQuota) {
    return modalQuota > parseInt(formQuota, 10);
  }
  return false;
};


const shouldShowStorageQuotaAlert = (state) => {
  const { data } = state.modal;
  const modalQuota = get(data, 'storage_quota.value', 0);
  const values = getFormValues('ScaleCluster')(state);
  const formQuota = get(values, 'persistent_storage', 0);
  if (formQuota && modalQuota) {
    return modalQuota > parseInt(formQuota, 10);
  }
  return false;
};


// Determine whether a master instance resize alert should be shown.
// Since the threshold is depenent on the current nodes, we return it
// for inclusion in the alert itself.
const masterResizeThresholds = {
  medium: 25,
  large: 100,
};
const masterResizeAlertThreshold = (state) => {
  const { data } = state.modal;
  const currentNodes = get(data, 'nodes.compute', 0);
  const values = getFormValues('ScaleCluster')(state);
  const requestedNodes = parseInt(get(values, 'nodes_compute', 0), 10);
  if (requestedNodes && currentNodes) {
    if (currentNodes <= masterResizeThresholds.large
        && requestedNodes > masterResizeThresholds.large) {
      return masterResizeThresholds.large;
    }
    if (currentNodes <= masterResizeThresholds.medium
        && requestedNodes > masterResizeThresholds.medium) {
      return masterResizeThresholds.medium;
    }
  }
  return 0;
};

export {
  minValueSelector,
  shouldShowStorageQuotaAlert,
  shouldShowLoadBalancerAlert,
  masterResizeAlertThreshold,
};
