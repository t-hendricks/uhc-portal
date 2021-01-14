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
 * cluster.product.id, subscription.plan.id, quota_cost.related_resources[].product
 * use related but different values (see https://issues.redhat.com/browse/SDB-1625).
 * They should all be passed through normalizeProductID(), should result in one of the values here.
 * @enum string
 */
const normalizedProducts = {
  OSD: 'OSD',
  OCP: 'OCP',
  RHMI: 'RHMI',
  ROSA: 'ROSA',
  ANY: 'ANY', // used in quota_cost
  UNKNOWN: 'UNKNOWN', // normally should not happen except during loading
};

/**
 * Products by which UI allows to filter.
 * key is used internally and for URL ?plan_id=.
 * label is how it's shown in the UI.
 * plansToQuery are pre-normalization value to send to account-manager in ?search= query.
 */
const productFilterOptions = [
  { key: normalizedProducts.OCP, label: 'OCP', plansToQuery: ['OCP'] },
  { key: normalizedProducts.OSD, label: 'OSD', plansToQuery: ['OSD'] },
  { key: normalizedProducts.ROSA, label: 'ROSA', plansToQuery: ['MOA', 'ROSA'] },
];

export {
  subscriptionStatuses,
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
  normalizedProducts,
  productFilterOptions,
};
