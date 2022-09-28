import get from 'lodash/get';

import clusterStates from '../../../../common/clusterStates';
import { normalizedProducts } from '../../../../../../common/subscriptionTypes';

const canAllowAdminSelector = (state) => {
  const product = get(
    state,
    'clusters.details.cluster.subscription.plan.type',
    normalizedProducts.OSD,
  );
  const clusterState = get(state, 'clusters.details.cluster.state');

  if (product === normalizedProducts.RHMI || clusterState !== clusterStates.READY) {
    return false;
  }

  if (get(state, 'clusters.details.cluster.ccs.enabled', false)) {
    return true;
  }

  const capabilites = get(state, 'clusters.details.cluster.subscription.capabilities', []);
  const manageClusterAdminCapability = capabilites.find(
    (capability) => capability.name === 'capability.cluster.manage_cluster_admin',
  );

  return !!(manageClusterAdminCapability && manageClusterAdminCapability.value === 'true');
};

export default canAllowAdminSelector;
