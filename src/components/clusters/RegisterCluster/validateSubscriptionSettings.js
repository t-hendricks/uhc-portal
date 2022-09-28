import {
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionSystemUnits,
} from '../../../common/subscriptionTypes';

const { PREMIUM, STANDARD, SELF_SUPPORT } = subscriptionSupportLevels;

const { SUPPORT_LEVEL, SYSTEM_UNITS, CPU_TOTAL, SOCKET_TOTAL } = subscriptionSettings;

const { CORES_VCPU, SOCKETS } = subscriptionSystemUnits;

const validateSubscriptionSettings = (settings) => {
  const {
    [SUPPORT_LEVEL]: supportLevel,
    [SYSTEM_UNITS]: systemUnits,
    [CPU_TOTAL]: cpuTotal,
    [SOCKET_TOTAL]: socketTotal,
  } = settings;
  // subscription setting is optional for disconnected cluster registration
  if (supportLevel !== PREMIUM && supportLevel !== STANDARD && supportLevel !== SELF_SUPPORT) {
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
  if (systemUnits === SOCKETS) {
    request[SOCKET_TOTAL] = parseInt(socketTotal, 10);
    request[CPU_TOTAL] = request[SOCKET_TOTAL];
  }
  if (systemUnits === CORES_VCPU) {
    request[SOCKET_TOTAL] = 1;
    request[CPU_TOTAL] = parseInt(cpuTotal, 10);
  }
  return {
    request,
    isValid: settings.isValid,
  };
};

export default validateSubscriptionSettings;
