import { action, ActionType } from 'typesafe-actions';

import accessProtectionService from '~/services/accessTransparency/accessProtectionService';

import { accessRequestConstants } from '../constants';

const getAccessProtection = (subscriptionId: string) =>
  action(
    accessRequestConstants.GET_ACCESS_PROTECTION,
    accessProtectionService.getAccessProtection({ subscriptionId }),
  );

const resetAccessProtection = () => action(accessRequestConstants.RESET_ACCESS_PROTECTION);

const accessProtectionActions = {
  getAccessProtection,
  resetAccessProtection,
} as const;

type AccessProtectionAction = ActionType<
  (typeof accessProtectionActions)[keyof typeof accessProtectionActions]
>;

export {
  AccessProtectionAction,
  accessProtectionActions,
  getAccessProtection,
  resetAccessProtection,
};
