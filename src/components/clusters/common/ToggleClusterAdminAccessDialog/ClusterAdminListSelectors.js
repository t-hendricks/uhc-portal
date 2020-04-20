import get from 'lodash/get';

const canAllowAdminListSelector = (state) => {
  const clusters = get(state, 'clusters.clusters.clusters', []);

  const canAllowAdminList = {};
  clusters.forEach((cluster) => {
    canAllowAdminList[cluster.id] = false;
    const product = get(cluster, 'product.id', 'osd');
    if (product !== 'rhmi') {
      const capabilites = get(cluster, 'subscription.capabilities', []);
      const manageClusterAdminCapability = capabilites.find(capability => capability.name === 'capability.cluster.manage_cluster_admin');
      canAllowAdminList[cluster.id] = !!(manageClusterAdminCapability && manageClusterAdminCapability.value === 'true');
    }
  });

  return canAllowAdminList;
};

export default canAllowAdminListSelector;
