import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

const expiredTrialsFilter = {
  filter: `support_level='${SubscriptionCommonFields.support_level.NONE}' AND status NOT IN ('Deprovisioned', 'Archived')`,
};

export { expiredTrialsFilter };
