import get from 'lodash/get';

import {
  subscriptionCapabilities,
  hasCapability,
} from '../../../../common/subscriptionCapabilities';

const canTransferClusterOwnershipSelector = (state) => {
  const subscription = get(state, 'clusters.details.cluster.subscription', {});
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

export { canTransferClusterOwnershipListSelector, canTransferClusterOwnershipSelector };
