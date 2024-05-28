import { Capability } from '~/types/accounts_mgmt.v1';

import { hasExternalAuthenticationCapability } from '../externalAuthHelper';

import {
  capabilitiesWithExternalAuthentication,
  capabilitiesWithoutExternalAuthentication,
} from './externalAuthHelper.fixtures';

describe('has external authentication capability', () =>
  it.each([
    ['capabilities is undefined', undefined, false],
    ['capabilities is empty', [], false],
    [
      'should return true if org has external authentication capability',
      capabilitiesWithExternalAuthentication,
      true,
    ],
    [
      'should return false if org does not have external authentication capability',
      capabilitiesWithoutExternalAuthentication,
      false,
    ],
  ])('%s', (_title: string, capabilities: undefined | Capability[], expected: boolean) => {
    expect(hasExternalAuthenticationCapability(capabilities)).toEqual(expected);
  }));
