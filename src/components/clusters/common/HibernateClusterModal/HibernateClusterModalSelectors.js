import get from 'lodash/get';

const userCanHibernateClustersSelector = (state) => {
  const capabilities = get(state, 'userProfile.organization.details.capabilities', []);
  const canHibernateCluster = capabilities.find(
    (capability) => capability.name === 'capability.organization.hibernate_cluster',
  );
  return canHibernateCluster?.value === 'true';
};

const canHibernateClusterListSelector = (state) => {
  const canHibernateClusters = userCanHibernateClustersSelector(state);

  const canHibernateClusterList = {};
  if (canHibernateClusters) {
    const clusters = get(state, 'clusters.clusters.clusters', []);
    clusters.forEach((cluster) => {
      canHibernateClusterList[cluster.id] = true;
    });
  }

  return canHibernateClusterList;
};

export { userCanHibernateClustersSelector, canHibernateClusterListSelector };
