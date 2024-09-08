import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';

import { secureRandomValueInRange } from '../../../../common/helpers';
import { subscriptionSettings } from '../../../../common/subscriptionTypes';
import validateSubscriptionSettings from '../validateSubscriptionSettings';

const { SUPPORT_LEVEL, SERVICE_LEVEL, USAGE, SYSTEM_UNITS, CPU_TOTAL, SOCKET_TOTAL } =
  subscriptionSettings;

const expectedCpuTotal = (settings: { [index: string]: any }) =>
  settings[SYSTEM_UNITS] === SubscriptionCommonFields.system_units.CORES_V_CPU
    ? settings[CPU_TOTAL]
    : // default cpu_total is socket_total
      settings[SOCKET_TOTAL];

const expectedSocketTotal = (settings: { [index: string]: any }) =>
  settings[SYSTEM_UNITS] === SubscriptionCommonFields.system_units.SOCKETS
    ? settings[SOCKET_TOTAL]
    : // default socket_total is 1
      1;

const getRandInt = () => secureRandomValueInRange(1, 1000);

describe('validateSubscriptionSettings()', () => {
  it('it should be valid without configuring settings', () => {
    const settings = {
      [SUPPORT_LEVEL]: SubscriptionCommonFields.support_level.EVAL,
      [SERVICE_LEVEL]: '',
      [USAGE]: '',
      [SYSTEM_UNITS]: '',
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: false, // this is not valid for child form
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request).toBeNull();
  });

  it('it should be valid when configured Premium', () => {
    const settings = {
      [SUPPORT_LEVEL]: SubscriptionCommonFields.support_level.PREMIUM,
      [SERVICE_LEVEL]: SubscriptionCommonFields.service_level.L1_L3,
      [USAGE]: SubscriptionCommonFields.usage.PRODUCTION,
      [SYSTEM_UNITS]: SubscriptionCommonFields.system_units.CORES_V_CPU,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request?.support_level).toEqual(settings[SUPPORT_LEVEL]);
    expect(request?.service_level).toEqual(settings[SERVICE_LEVEL]);
    expect(request?.usage).toEqual(settings[USAGE]);
    expect(request?.system_units).toEqual(settings[SYSTEM_UNITS]);
    expect(request?.cpu_total).toEqual(expectedCpuTotal(settings));
    expect(request?.socket_total).toEqual(expectedSocketTotal(settings));
  });

  it('it should be valid when configured Standard', () => {
    const settings = {
      [SUPPORT_LEVEL]: SubscriptionCommonFields.support_level.STANDARD,
      [SERVICE_LEVEL]: SubscriptionCommonFields.service_level.L1_L3,
      [USAGE]: SubscriptionCommonFields.usage.DISASTER_RECOVERY,
      [SYSTEM_UNITS]: SubscriptionCommonFields.system_units.CORES_V_CPU,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request?.support_level).toEqual(settings[SUPPORT_LEVEL]);
    expect(request?.service_level).toEqual(settings[SERVICE_LEVEL]);
    expect(request?.usage).toEqual(settings[USAGE]);
    expect(request?.system_units).toEqual(settings[SYSTEM_UNITS]);
    expect(request?.cpu_total).toEqual(expectedCpuTotal(settings));
    expect(request?.socket_total).toEqual(expectedSocketTotal(settings));
  });

  it('it should be valid when configured Standard, Sockets', () => {
    const settings = {
      [SUPPORT_LEVEL]: SubscriptionCommonFields.support_level.STANDARD,
      [SERVICE_LEVEL]: SubscriptionCommonFields.service_level.L1_L3,
      [USAGE]: SubscriptionCommonFields.usage.DISASTER_RECOVERY,
      [SYSTEM_UNITS]: SubscriptionCommonFields.system_units.SOCKETS,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request?.support_level).toEqual(settings[SUPPORT_LEVEL]);
    expect(request?.service_level).toEqual(settings[SERVICE_LEVEL]);
    expect(request?.usage).toEqual(settings[USAGE]);
    expect(request?.system_units).toEqual(settings[SYSTEM_UNITS]);
    expect(request?.cpu_total).toEqual(expectedCpuTotal(settings));
    expect(request?.socket_total).toEqual(expectedSocketTotal(settings));
  });

  it('it should be valid when configured Self-Support, Sockets', () => {
    const settings = {
      [SUPPORT_LEVEL]: SubscriptionCommonFields.support_level.SELF_SUPPORT,
      [SERVICE_LEVEL]: SubscriptionCommonFields.service_level.L3_ONLY,
      [USAGE]: SubscriptionCommonFields.usage.DEVELOPMENT_TEST,
      [SYSTEM_UNITS]: SubscriptionCommonFields.system_units.SOCKETS,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request?.support_level).toEqual(settings[SUPPORT_LEVEL]);
    expect(request?.service_level).toEqual(settings[SERVICE_LEVEL]);
    expect(request?.usage).toEqual(settings[USAGE]);
    expect(request?.system_units).toEqual(settings[SYSTEM_UNITS]);
    expect(request?.cpu_total).toEqual(expectedCpuTotal(settings));
    expect(request?.socket_total).toEqual(expectedSocketTotal(settings));
  });

  it('it should not be valid when child form is invalid', () => {
    const settings = {
      [SUPPORT_LEVEL]: SubscriptionCommonFields.support_level.SELF_SUPPORT,
      [SERVICE_LEVEL]: SubscriptionCommonFields.service_level.L3_ONLY,
      [USAGE]: SubscriptionCommonFields.usage.DEVELOPMENT_TEST,
      [SYSTEM_UNITS]: SubscriptionCommonFields.system_units.SOCKETS,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: false,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeFalsy();
    expect(request).toBeNull();
  });
});
