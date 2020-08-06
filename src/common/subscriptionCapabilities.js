import get from 'lodash/get';

/**
 * capabilities
 * Capabilities must contain 3 sections, separated by "."
 * capability.{type}.{name}
 */
const subscriptionCapabilities = {
  CREATE_MOA_CLUSTERS: 'capability.account.create_moa_clusters',
  MANAGE_CLUSTER_ADMIN: 'capability.cluster.manage_cluster_admin',
  ORGANIZATION_REGISTRATIONS_PER_HOUR: 'capability.organization.clusters_registrations_per_hour',
  SUBSCRIBED_OCP: 'capability.cluster.subscribed_ocp',
  BARE_METAL_INSTALLER_ADMIN: 'capability.account.bare_metal_installer_admin',
  RELEASE_OCP_CLUSTERS: 'capability.cluster.release_ocp_clusters',
};

const hasCapability = (subscription, name) => {
  const capabilities = get(subscription, 'capabilities', []);
  const found = capabilities.find(capability => capability.name === name);
  return get(found, 'value', false) === 'true';
};

export {
  subscriptionCapabilities,
  hasCapability,
};
