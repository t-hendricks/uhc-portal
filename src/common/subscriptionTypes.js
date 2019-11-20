const entitlementStatuses = {
  OK: 'Ok',
  NOT_SET: 'NotSet',
  OVERCOMMITTED: 'Overcommitted',
  INCONSISTENT_SERVICES: 'InconsistentServices',
  UNKNOWN: 'NotReconciled',
};

const subscriptionStatuses = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  DEPROVISIONED: 'Deprovisioned',
  RESERVED: 'Reserved',
  STALE: 'Stale',
  DISCONNECTED: 'Disconnected',
};

export { subscriptionStatuses, entitlementStatuses };
