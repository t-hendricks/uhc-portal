import { isRestrictedEnv } from '~/restrictedEnv';

import { allCategories, Categories, downloadsCategories, expandKeys } from '../downloadsStructure';

import {
  allCategories as allCategoriesExpected,
  expectedExpandedKeys,
  isRestrictedEnvFalseExpected,
  isRestrictedEnvTrueExpected,
} from './downloadsStructure.fixtures';

jest.mock('~/restrictedEnv', () => ({
  isRestrictedEnv: jest.fn(),
}));

const isRestrictedEnvMock = isRestrictedEnv as jest.Mock;

describe('downloadsStructure', () => {
  describe('downloadsCategories', () =>
    it.each([
      [true, isRestrictedEnvTrueExpected],
      [false, isRestrictedEnvFalseExpected],
    ])('isRestrictedEnv as %s', (isRestricted: boolean, expected: Categories[]) => {
      // Arrange
      isRestrictedEnvMock.mockReturnValue(isRestricted);

      // Act
      expect(downloadsCategories()).toStrictEqual(expected);
    }));

  it('allCategories', () => expect(allCategories).toStrictEqual(allCategoriesExpected));

  it('expandKeys', () => expect(expandKeys).toStrictEqual(expectedExpandedKeys));
});
