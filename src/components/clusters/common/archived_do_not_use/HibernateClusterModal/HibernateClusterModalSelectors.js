import get from 'lodash/get';

import { useGlobalState } from '~/redux/hooks';

const userCanHibernateClustersSelector = (state) => {
  const capabilities = get(state, 'userProfile.organization.details.capabilities', []);
  const canHibernateCluster = capabilities.find(
    (capability) => capability.name === 'capability.organization.hibernate_cluster',
  );
  return canHibernateCluster?.value === 'true';
};

// TOOD this can be removed once clusters.clusters.clusters is removed from Redux
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

export const useCanHibernateClusterListFromClusters = (clusters) => {
  const canHibernateClusters = useGlobalState((state) => userCanHibernateClustersSelector(state));

  const canHibernateClusterList = {};
  if (canHibernateClusters) {
    clusters.forEach((cluster) => {
      canHibernateClusterList[cluster.id] = true;
    });
  }

  return canHibernateClusterList;
};

export { userCanHibernateClustersSelector, canHibernateClusterListSelector };
