import get from 'lodash/get';

const canHibernateClusterListSelector = (state) => {
  const clusters = get(state, 'clusters.clusters.clusters', []);

  const canHibernateClusterList = {};
  clusters.forEach((cluster) => {
    const capabilites = get(state, 'userProfile.organization.details.data.capabilities', []);
    const canHibernateCluster = capabilites.find(capability => capability.name === 'capability.organization.hibernate_cluster');
    canHibernateClusterList[cluster.id] = !!(canHibernateCluster && canHibernateCluster.value === 'true');
  });

  return canHibernateClusterList;
};

export default canHibernateClusterListSelector;
