import get from 'lodash/get';

const canAllowAdminSelector = (state) => {
  const capabilites = get(state, 'clusters.details.cluster.subscription.capabilities', []);
  const manageClusterAdminCapability = capabilites.find(capability => capability.name === 'capability.cluster.manage_cluster_admin');

  return !!(manageClusterAdminCapability && manageClusterAdminCapability.value === 'true');
};

export default canAllowAdminSelector;
