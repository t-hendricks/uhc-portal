import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

export const subscription = {
  id: '0',
  released: false,
  status: SubscriptionCommonFields.status.ACTIVE,
};
export const requestState = {
  fulfilled: false,
  error: false,
  pending: false,
};
