import get from 'lodash/get';

import {
  hasCapability,
  subscriptionCapabilities,
} from '../../../../common/subscriptionCapabilities';

const canTransferClusterOwnershipSelector = (state) => {
  const subscription = get(state, 'clusters.details.cluster.subscription', {});
  return hasCapability(subscription, subscriptionCapabilities.RELEASE_OCP_CLUSTERS);
};

/**
 * Different approach of getting data requires similar function
 * @param cluster Accepts cluster as parameter instead of redux state
 * @returns list of capabbilities
 */
const canTransferClusterOwnershipMultiRegion = (cluster) => {
  const subscription = cluster?.subscription || {};
  return hasCapability(subscription, subscriptionCapabilities.RELEASE_OCP_CLUSTERS);
};

const canTransferClusterOwnershipListSelector = (state) => {
  const clusters = get(state, 'clusters.clusters.clusters', []);

  const results = {};
  clusters.forEach((cluster) => {
    const subscription = cluster.subscription || {};
    results[cluster.id] = hasCapability(
      subscription,
      subscriptionCapabilities.RELEASE_OCP_CLUSTERS,
    );
  });

  return results;
};

export {
  canTransferClusterOwnershipListSelector,
  canTransferClusterOwnershipSelector,
  canTransferClusterOwnershipMultiRegion,
};
