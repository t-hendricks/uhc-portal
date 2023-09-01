/**
 * names of all subscriptioin settings
 * @enum string
 */
const subscriptionSettings = {
  SUPPORT_LEVEL: 'support_level',
  USAGE: 'usage',
  SERVICE_LEVEL: 'service_level',
  PRODUCT_BUNDLE: 'product_bundle',
  SYSTEM_UNITS: 'system_units',
  CPU_TOTAL: 'cpu_total',
  SOCKET_TOTAL: 'socket_total',
  CLUSTER_BILLING_MODEL: 'cluster_billing_model',
  EVALUATION_EXPIRATION_DATE: 'evaluation_expiration_date',
};

/**
 * support_levels
 * @enum string
 */
const subscriptionSupportLevels = {
  EVAL: 'Eval',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  SELF_SUPPORT: 'Self-Support',
  NONE: 'None',
};

/**
 * service_levels
 * @enum string
 */
const subscriptionServiceLevels = {
  L1_L3: 'L1-L3',
  L3_ONLY: 'L3-only',
};

/**
 * usage
 * @enum string
 */
const subscriptionUsages = {
  PRODUCTION: 'Production',
  DEV_TEST: 'Development/Test',
  DISASTER_RECOVERY: 'Disaster Recovery',
};

/**
 * product_bundle
 * @enum string
 */
const subscriptionProductBundles = {
  OPENSHIFT: 'Openshift',
  JBOSS_MIDDLEWARE: 'JBoss-Middleware',
  IBM_CLOUDPAK: 'IBM-CloudPak',
};

/**
 * system_units
 * @enum string
 */
const subscriptionSystemUnits = {
  CORES_VCPU: 'Cores/vCPU',
  SOCKETS: 'Sockets',
};

/**
 * status
 * @enum string
 */
const subscriptionStatuses = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  DEPROVISIONED: 'Deprovisioned',
  RESERVED: 'Reserved',
  STALE: 'Stale',
  DISCONNECTED: 'Disconnected',
};

/**
 * Possible results of normalizeProductID() that are actual products.
 * See `normalizedProducts` for the other possible results.
 * @enum string
 */
const knownProducts = {
  OSD: 'OSD',
  OSDTrial: 'OSDTrial',
  OCP: 'OCP',
  RHMI: 'RHMI',
  ROSA: 'ROSA',
  ROSA_HyperShift: 'ROSA-HyperShift',
  ARO: 'ARO',
  OCP_Assisted_Install: 'OCP-AssistedInstall',
  RHACS: 'RHACS',
  RHACSTrial: 'RHACSTrial',
  RHOSR: 'RHOSR',
  RHOSRTrial: 'RHOSRTrial',
  RHOSAK: 'RHOSAK',
  RHOSAKTrial: 'RHOSAKTrial',
  RHOSE: 'RHOSE',
  RHOSETrial: 'RHOSETrial',
};

const omittedProducts = [
  knownProducts.RHACS,
  knownProducts.RHACSTrial,
  knownProducts.RHOSR,
  knownProducts.RHOSRTrial,
  knownProducts.RHOSAK,
  knownProducts.RHOSAKTrial,
  knownProducts.RHOSE,
  knownProducts.RHOSETrial,
];

/**
 * cluster.product.id, subscription.plan.type, subscription.plan.id,
 * quota_cost.related_resources[].product
 * use related but different values (see https://issues.redhat.com/browse/SDB-1625).
 * They should all be passed through normalizeProductID(), should result in one of the values here.
 * @enum string
 */
const normalizedProducts = {
  ...knownProducts,
  ANY: 'ANY', // used in quota_cost
  UNKNOWN: 'UNKNOWN', // normally should not happen except during loading
};

/**
 * product IDs that are managed by Clusters Service
 *
 */
const clustersServiceProducts = [
  normalizedProducts.OSD,
  normalizedProducts.OSDTrial,
  normalizedProducts.ROSA,
  normalizedProducts.ROSA_HyperShift,
  normalizedProducts.RHMI,
  normalizedProducts.ARO,
];

/**
 * Products by which UI allows to filter.
 * key is used internally and for URL ?plan_id=.
 * label is how it's shown in the UI.
 * plansToQuery are pre-normalization value to send to account-manager in ?search= query.
 */
const productFilterOptions = [
  { key: normalizedProducts.OCP, label: 'OCP', plansToQuery: ['OCP', 'OCP-AssistedInstall'] },
  { key: normalizedProducts.OSD, label: 'OSD', plansToQuery: ['OSD'] },
  { key: normalizedProducts.ROSA, label: 'ROSA', plansToQuery: ['MOA', 'ROSA'] },
  {
    key: normalizedProducts.ROSA_HyperShift,
    label: 'ROSA - Hosted',
    plansToQuery: ['MOA-HostedControlPlane'],
  },
  { key: normalizedProducts.ARO, label: 'ARO', plansToQuery: ['ARO'] },
];

/**
 * The cluster_billing_model field on subscription indicates what kind
 * of quota this subscription is using.
 */
const billingModels = {
  STANDARD: 'standard', // quota from Red Hat Subscriptions
  MARKETPLACE: 'marketplace', // quota from Red Hat Marketplace
  MARKETPLACE_AWS: 'marketplace-aws',
  STANDARD_TRIAL: 'standard-trial',
};

/**
 * The ocmRoles contains all available roles that a customer
 * can grant to other users within his own organization.
 */
const ocmRoles = {
  CLUSTER_EDITOR: 'ClusterEditor',
  CLUSTER_VIEWER: 'ClusterViewer',
  CLUSTER_AUTOSCALER_EDITOR: 'ClusterAutoscalerEditor',
  IDP_EDITOR: 'IdpEditor',
  MACHINE_POOL_EDITOR: 'MachinePoolEditor',
};

export {
  subscriptionStatuses,
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
  knownProducts,
  omittedProducts,
  normalizedProducts,
  clustersServiceProducts,
  productFilterOptions,
  billingModels,
  ocmRoles,
};
