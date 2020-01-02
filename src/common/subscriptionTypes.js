const entitlementStatuses = {
  OK: 'Ok',
  NOT_SUBSCRIBED: 'NotSubscribed',
  OVERCOMMITTED: 'Overcommitted',
  INCONSISTENT_SERVICES: 'InconsistentServices',
  SIXTY_DAY_EVALUATION: 'SixtyDayEvaluation',
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
