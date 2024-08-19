import { SubscriptionCommonFields, SubscriptionPatchRequest } from '~/types/accounts_mgmt.v1';

import { subscriptionSettings } from '../../../common/subscriptionTypes';

const { SUPPORT_LEVEL, SYSTEM_UNITS, CPU_TOTAL, SOCKET_TOTAL } = subscriptionSettings;

const validateSubscriptionSettings = (settings: {
  [index: string]: any;
}): { request: SubscriptionPatchRequest | null; isValid: boolean } => {
  const {
    [SUPPORT_LEVEL]: supportLevel,
    [SYSTEM_UNITS]: systemUnits,
    [CPU_TOTAL]: cpuTotal,
    [SOCKET_TOTAL]: socketTotal,
  } = settings;
  // subscription setting is optional for disconnected cluster registration
  if (
    supportLevel !== SubscriptionCommonFields.support_level.PREMIUM &&
    supportLevel !== SubscriptionCommonFields.support_level.STANDARD &&
    supportLevel !== SubscriptionCommonFields.support_level.SELF_SUPPORT
  ) {
    return {
      request: null,
      isValid: true,
    };
  }
  if (!settings.isValid) {
    return {
      request: null,
      isValid: false,
    };
  }
  // adjust the system_units values to avoid of round-off errors
  const request = { ...settings };
  if (systemUnits === SubscriptionCommonFields.system_units.SOCKETS) {
    request[SOCKET_TOTAL] = parseInt(socketTotal, 10);
    request[CPU_TOTAL] = request[SOCKET_TOTAL];
  }
  if (systemUnits === SubscriptionCommonFields.system_units.CORES_V_CPU) {
    request[SOCKET_TOTAL] = 1;
    request[CPU_TOTAL] = parseInt(cpuTotal, 10);
  }
  return {
    request,
    isValid: settings.isValid,
  };
};

export default validateSubscriptionSettings;
