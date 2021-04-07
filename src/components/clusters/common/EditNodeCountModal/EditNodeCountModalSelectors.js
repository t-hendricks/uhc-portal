import get from 'lodash/get';
import { getFormValues } from 'redux-form';

// Determine whether a master instance resize alert should be shown.
// Since the threshold is depenent on the current nodes, we return it
// for inclusion in the alert itself.
const masterResizeThresholds = {
  medium: 25,
  large: 100,
};
const masterResizeAlertThresholdSelector = (state) => {
  const { data } = state.modal;
  const currentNodes = get(data, 'cluster.nodes.compute', 0) || get(data, 'cluster.nodes.autoscale_compute.min_replicas');
  const values = getFormValues('EditNodeCount')(state);
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

export { masterResizeThresholds };
export default masterResizeAlertThresholdSelector;
