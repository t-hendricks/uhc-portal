import {
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionSystemUnits,
} from '../../../common/subscriptionTypes';
import validateSubscriptionSettings from './validateSubscriptionSettings';

const { SUPPORT_LEVEL, SERVICE_LEVEL, USAGE, SYSTEM_UNITS, CPU_TOTAL, SOCKET_TOTAL } =
  subscriptionSettings;

const { EVAL, PREMIUM, STANDARD, SELF_SUPPORT } = subscriptionSupportLevels;

const { L1_L3, L3_ONLY } = subscriptionServiceLevels;

const { PRODUCTION, DEV_TEST, DISASTER_RECOVERY } = subscriptionUsages;

const { CORES_VCPU, SOCKETS } = subscriptionSystemUnits;

const expectedCpuTotal = (settings) =>
  settings[SYSTEM_UNITS] === CORES_VCPU
    ? settings[CPU_TOTAL]
    : // default cpu_total is socket_total
      settings[SOCKET_TOTAL];

const expectedSocketTotal = (settings) =>
  settings[SYSTEM_UNITS] === SOCKETS
    ? settings[SOCKET_TOTAL]
    : // default socket_total is 1
      1;

const getRandInt = () => Math.floor(Math.random() * 1000) + 1;

describe('validateSubscriptionSettings()', () => {
  it('it should be valid without configuring settings', () => {
    const settings = {
      [SUPPORT_LEVEL]: EVAL,
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
      [SUPPORT_LEVEL]: PREMIUM,
      [SERVICE_LEVEL]: L1_L3,
      [USAGE]: PRODUCTION,
      [SYSTEM_UNITS]: CORES_VCPU,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request[SUPPORT_LEVEL]).toEqual(settings[SUPPORT_LEVEL]);
    expect(request[SERVICE_LEVEL]).toEqual(settings[SERVICE_LEVEL]);
    expect(request[USAGE]).toEqual(settings[USAGE]);
    expect(request[SYSTEM_UNITS]).toEqual(settings[SYSTEM_UNITS]);
    expect(request[CPU_TOTAL]).toEqual(expectedCpuTotal(settings));
    expect(request[SOCKET_TOTAL]).toEqual(expectedSocketTotal(settings));
  });

  it('it should be valid when configured Standard', () => {
    const settings = {
      [SUPPORT_LEVEL]: STANDARD,
      [SERVICE_LEVEL]: L1_L3,
      [USAGE]: DISASTER_RECOVERY,
      [SYSTEM_UNITS]: CORES_VCPU,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request[SUPPORT_LEVEL]).toEqual(settings[SUPPORT_LEVEL]);
    expect(request[SERVICE_LEVEL]).toEqual(settings[SERVICE_LEVEL]);
    expect(request[USAGE]).toEqual(settings[USAGE]);
    expect(request[SYSTEM_UNITS]).toEqual(settings[SYSTEM_UNITS]);
    expect(request[CPU_TOTAL]).toEqual(expectedCpuTotal(settings));
    expect(request[SOCKET_TOTAL]).toEqual(expectedSocketTotal(settings));
  });

  it('it should be valid when configured Standard, Sockets', () => {
    const settings = {
      [SUPPORT_LEVEL]: STANDARD,
      [SERVICE_LEVEL]: L1_L3,
      [USAGE]: DISASTER_RECOVERY,
      [SYSTEM_UNITS]: SOCKETS,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request[SUPPORT_LEVEL]).toEqual(settings[SUPPORT_LEVEL]);
    expect(request[SERVICE_LEVEL]).toEqual(settings[SERVICE_LEVEL]);
    expect(request[USAGE]).toEqual(settings[USAGE]);
    expect(request[SYSTEM_UNITS]).toEqual(settings[SYSTEM_UNITS]);
    expect(request[CPU_TOTAL]).toEqual(expectedCpuTotal(settings));
    expect(request[SOCKET_TOTAL]).toEqual(expectedSocketTotal(settings));
  });

  it('it should be valid when configured Self-Support, Sockets', () => {
    const settings = {
      [SUPPORT_LEVEL]: SELF_SUPPORT,
      [SERVICE_LEVEL]: L3_ONLY,
      [USAGE]: DEV_TEST,
      [SYSTEM_UNITS]: SOCKETS,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: true,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeTruthy();
    expect(request[SUPPORT_LEVEL]).toEqual(settings[SUPPORT_LEVEL]);
    expect(request[SERVICE_LEVEL]).toEqual(settings[SERVICE_LEVEL]);
    expect(request[USAGE]).toEqual(settings[USAGE]);
    expect(request[SYSTEM_UNITS]).toEqual(settings[SYSTEM_UNITS]);
    expect(request[CPU_TOTAL]).toEqual(expectedCpuTotal(settings));
    expect(request[SOCKET_TOTAL]).toEqual(expectedSocketTotal(settings));
  });

  it('it should not be valid when child form is invalid', () => {
    const settings = {
      [SUPPORT_LEVEL]: SELF_SUPPORT,
      [SERVICE_LEVEL]: L3_ONLY,
      [USAGE]: DEV_TEST,
      [SYSTEM_UNITS]: SOCKETS,
      [CPU_TOTAL]: getRandInt(),
      [SOCKET_TOTAL]: getRandInt(),
      isValid: false,
    };
    const { isValid, request } = validateSubscriptionSettings(settings);
    expect(isValid).toBeFalsy();
    expect(request).toBeNull();
  });
});
