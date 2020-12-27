import get from 'lodash/get';

import clusterStates from '../../../../common/clusterStates';

const canAllowAdminSelector = (state) => {
  const product = get(state, 'clusters.details.cluster.product.id', 'osd');
  const clusterState = get(state, 'clusters.details.cluster.state');
  if (product === 'rhmi' || clusterState !== clusterStates.READY) {
    return false;
  }

  const capabilites = get(state, 'clusters.details.cluster.subscription.capabilities', []);
  const manageClusterAdminCapability = capabilites.find(capability => capability.name === 'capability.cluster.manage_cluster_admin');

  return !!(manageClusterAdminCapability && manageClusterAdminCapability.value === 'true');
};

export default canAllowAdminSelector;
