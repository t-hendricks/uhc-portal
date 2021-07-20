import get from 'lodash/get';

const canHibernateClusterSelector = (state) => {
  const capabilites = get(state, 'userProfile.organization.details.capabilities', []);
  const canHibernateCluster = capabilites.find(capability => capability.name === 'capability.organization.hibernate_cluster');
  return !!(canHibernateCluster && canHibernateCluster.value === 'true');
};

export default canHibernateClusterSelector;
