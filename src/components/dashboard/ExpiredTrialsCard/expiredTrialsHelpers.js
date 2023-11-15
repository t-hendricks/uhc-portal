import { subscriptionSupportLevels } from '../../../common/subscriptionTypes';

const expiredTrialsFilter = {
  filter: `support_level='${subscriptionSupportLevels.NONE}' AND status NOT IN ('Deprovisioned', 'Archived')`,
};

export { expiredTrialsFilter };

export default expiredTrialsFilter;
