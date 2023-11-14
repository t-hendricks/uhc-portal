import { ANY, match, matchCaseInsensitively } from '../matchUtils';

describe('matchUtils', () => {
  describe('match', () => {
    it.each([
      ['', '', true],
      ['a', 'a', true],
      ['A', 'a', false],
      ['A', 'A', true],
      [undefined, undefined, true],
      [undefined, ANY, true],
      ['a', ANY, true],
      ['A', ANY, true],
      ['a', 'b', false],
    ])('%p %p should be be %b', (a: string | undefined, b: string | undefined, expected: boolean) =>
      expect(match(a, b)).toBe(expected),
    );
  });

  describe('matchCaseInsensitively', () => {
    it.each([
      ['', '', true],
      ['a', 'a', true],
      ['A', 'a', true],
      ['A', 'A', true],
      [undefined, undefined, true],
      [undefined, ANY, true],
      ['a', ANY, true],
      ['A', ANY, true],
      ['a', 'b', false],
    ])('%p %p should be %b', (a: string | undefined, b: string | undefined, expected: boolean) =>
      expect(matchCaseInsensitively(a, b)).toBe(expected),
    );
  });
});
