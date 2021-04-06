import get from 'lodash/get';
import { getFormValues } from 'redux-form';
import nodesSectionDataSelector from '../../ClusterDetails/components/Overview/DetailsRight/DetailsRightSelectors';

// Determine whether a master instance resize alert should be shown.
// Since the threshold is depenent on the current nodes, we return it
// for inclusion in the alert itself.
const masterResizeThresholds = {
  medium: 25,
  large: 100,
};
const masterResizeAlertThresholdSelector = (state) => {
  const currentNodes = nodesSectionDataSelector(state).totalMinNodesCount;
  const values = getFormValues('EditNodeCount')(state);
  const requestedNodes = parseInt(get(values, 'nodes_compute', 0), 10);
  const totalRequestedNodes = currentNodes + requestedNodes;

  if (requestedNodes && currentNodes) {
    if (currentNodes <= masterResizeThresholds.large
          && totalRequestedNodes > masterResizeThresholds.large) {
      return masterResizeThresholds.large;
    }
    if (currentNodes <= masterResizeThresholds.medium
          && totalRequestedNodes > masterResizeThresholds.medium) {
      return masterResizeThresholds.medium;
    }
  }
  return 0;
};

export { masterResizeThresholds };
export default masterResizeAlertThresholdSelector;
