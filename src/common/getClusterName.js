import get from 'lodash/get';

/**
 * Get the display name for the cluster (from the subscription), with fallbacks to name, UUID,
 * or the string "Unnamed Cluster".
 * @param {*} cluster a cluster object.
 */
const getClusterName = (cluster) => {
  if (!cluster) {
    return '';
  }
  const clusterName = get(cluster, 'subscription.display_name', false) || cluster.name || cluster.external_id;
  if (clusterName === undefined) {
    if (get(cluster, 'subscription.status', false) === 'Deprovisioned') {
      const subscriptionId = get(cluster, 'subscription.id', false);
      if (subscriptionId) {
        return subscriptionId;
      }
    }
    return 'Unnamed Cluster';
  }
  return clusterName;
};

export default getClusterName;
