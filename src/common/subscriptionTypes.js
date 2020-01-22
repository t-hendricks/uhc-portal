/**
 * Entitlement statuses as defined in the API
 */
const entitlementStatuses = {
  OK: 'Ok',
  NOT_SUBSCRIBED: 'NotSubscribed',
  OVERCOMMITTED: 'Overcommitted',
  INCONSISTENT_SERVICES: 'InconsistentServices',
  SIXTY_DAY_EVALUATION: 'SixtyDayEvaluation',
};

/**
 * Human-readable names for the various entitlement statuses
 */
const entitlementStatusDisplayNames = {
  OK: 'Subscribed',
  NOT_SUBSCRIBED: 'Not subscribed',
  OVERCOMMITTED: 'Insufficient',
  INCONSISTENT_SERVICES: 'Invalid',
  SIXTY_DAY_EVALUATION: '60-day evaluation',
};

const subscriptionStatuses = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  DEPROVISIONED: 'Deprovisioned',
  RESERVED: 'Reserved',
  STALE: 'Stale',
  DISCONNECTED: 'Disconnected',
};

export { subscriptionStatuses, entitlementStatuses, entitlementStatusDisplayNames };
