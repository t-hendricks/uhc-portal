/**
 * names of all subscriptioin settings
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
 */
const subscriptionServiceLevels = {
  L1_L3: 'L1-L3',
  L3_ONLY: 'L3-only',
};

/**
 * usage
 */
const subscriptionUsages = {
  PRODUCTION: 'Production',
  DEV_TEST: 'Development/Test',
  DISASTER_RECOVERY: 'Disaster Recovery',
};

/**
 * product_bundle
 */
const subscriptionProductBundles = {
  OPENSHIFT: 'Openshift',
  JBOSS_MIDDLEWARE: 'JBoss-Middleware',
  IBM_CLOUDPAK: 'IBM-CloudPak',
};

/**
 * system_units
 */
const subscriptionSystemUnits = {
  CORES_VCPU: 'Cores/vCPU',
  SOCKETS: 'Sockets',
};

/**
 * status
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
 * plan
 */
const subscriptionPlans = {
  OSD: 'OSD',
  OCP: 'OCP',
  MOA: 'MOA',
  RHMI: 'RHMI',
  ROSA: 'ROSA',
  ANY: 'ANY',
};

export {
  subscriptionStatuses,
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
  subscriptionPlans,
};
