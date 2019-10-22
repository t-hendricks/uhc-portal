import get from 'lodash/get';

/**
 * Get the display name for the cluster (from the subscription), with fallbacks to name, UUID,
 * or the string "Unnamed Cluster".
 * @param {*} cluster a cluster object.
 */
const getClusterName = cluster => get(cluster, 'subscription.display_name', false) || cluster.display_name || cluster.name || cluster.external_id || 'Unnamed Cluster';

export default getClusterName;
