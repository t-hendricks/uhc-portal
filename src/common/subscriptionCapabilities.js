import get from 'lodash/get';

import { subscriptionStatuses } from './subscriptionTypes';
/**
 * capabilities
 * Capabilities must contain 3 sections, separated by "."
 * capability.{type}.{name}
 */
const subscriptionCapabilities = {
  CREATE_MOA_CLUSTERS: 'capability.account.create_moa_clusters',
  CREATE_ROSA_CLUSTERS: 'capability.account.create_rosa_clusters',
  MANAGE_CLUSTER_ADMIN: 'capability.cluster.manage_cluster_admin',
  ORGANIZATION_REGISTRATIONS_PER_HOUR: 'capability.organization.clusters_registrations_per_hour',
  SUBSCRIBED_OCP: 'capability.cluster.subscribed_ocp',
  SUBSCRIBED_OCP_MARKETPLACE: 'capability.cluster.subscribed_ocp_marketplace',
  BARE_METAL_INSTALLER_ADMIN: 'capability.account.bare_metal_installer_admin',
  RELEASE_OCP_CLUSTERS: 'capability.cluster.release_ocp_clusters',
  CREATE_GCP_NON_CCS_CLUSTER: 'capability.organization.create_gcp_non_ccs_cluster',
};

const hasCapability = (subscription, name) => {
  if (name === subscriptionCapabilities.RELEASE_OCP_CLUSTERS) {
    return true;
  }

  if (name === subscriptionCapabilities.SUBSCRIBED_OCP_MARKETPLACE) {
    // subscribed_ocp_marketplace does not apply to disconnected clusters
    if (get(subscription, 'status') === subscriptionStatuses.DISCONNECTED) {
      return false;
    }
    // sub must have already been created
    if (!get(subscription, 'id', false)) {
      return false;
    }
  }

  const capabilities = get(subscription, 'capabilities', []);
  const found = capabilities.find(capability => capability.name === name);
  return get(found, 'value', false) === 'true';
};

const haveCapabilities = (clusters, name) => {
  const results = {};
  clusters.forEach((cluster) => {
    const clusterId = get(cluster, 'id', false);
    if (clusterId !== false) {
      results[clusterId] = hasCapability(get(cluster, 'subscription'), name);
    }
  });

  return results;
};

export {
  subscriptionCapabilities,
  hasCapability,
  haveCapabilities,
};
