import { subscriptionSettings } from '~/common/subscriptionTypes';

import { SubcriptionOptionType } from './model/SubcriptionOptionType';

const MIN_VAL = 1;
const LABEL_ICON_CLASS = 'subscription-settings-label-tooltip-icon';

const STANDARD_BILLING_MODEL_LABEL = 'Annual: Fixed capacity subscription from Red Hat';
const MARKETPLACE_BILLING_MODEL_LABEL =
  'On-Demand (Hourly): Flexible usage billed through Red Hat Marketplace';

const OPTIONS: SubcriptionOptionType[] = [
  subscriptionSettings.SUPPORT_LEVEL,
  subscriptionSettings.USAGE,
  subscriptionSettings.SERVICE_LEVEL,
  subscriptionSettings.SYSTEM_UNITS,
  subscriptionSettings.CLUSTER_BILLING_MODEL,
];

export {
  LABEL_ICON_CLASS,
  MARKETPLACE_BILLING_MODEL_LABEL,
  MIN_VAL,
  OPTIONS,
  STANDARD_BILLING_MODEL_LABEL,
};
