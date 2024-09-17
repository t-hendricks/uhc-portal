import fs from 'fs';
import path from 'path';

import helpers, {
  goZeroTime2Null,
  parseReduxFormKeyValueList,
  parseReduxFormTaints,
  scrollToFirstField,
  strToKeyValueObject,
  truncateTextWithEllipsis,
} from '../helpers';

global.CSS = {
  escape: (v) => v,
};

describe('nestedIsEmpty()', () => {
  it('returns true for an empty object', () => {
    expect(helpers.nestedIsEmpty({})).toBeTruthy();
  });
  it('returns false for an object with empty children', () => {
    expect(helpers.nestedIsEmpty({ a: [], b: [] })).toBeTruthy();
  });
  it('returns false for a non-empty object', () => {
    expect(helpers.nestedIsEmpty({ foo: 'bar' })).toBeFalsy();
  });
  it('returns false for an object with at least one non-empty child', () => {
    expect(helpers.nestedIsEmpty({ a: ['b'], c: [] })).toBeFalsy();
  });
});

describe('parseReduxFormKeyValueList', () => {
  it('returns a key value pair', () => {
    const reduxFormInput = [
      { key: 'foo', value: 'bar' },
      { key: 'hello', value: 'world' },
    ];
    const expected = { foo: 'bar', hello: 'world' };
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('only returns pairs with non empty keys', () => {
    const reduxFormInput = [
      { key: 'foo', value: 'bar' },
      { key: undefined, value: 'world' },
    ];
    const expected = { foo: 'bar' };
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('returns empty values as empty strings', () => {
    const reduxFormInput = [
      { key: 'foo', value: 'bar' },
      { key: 'hello', undefined: 'world' },
    ];
    const expected = { foo: 'bar', hello: '' };
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('returns an empty object when pairs are empty', () => {
    const reduxFormInput = [{}, {}, {}];
    const expected = {};
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('returns an empty object when input is missing', () => {
    const expected = {};
    expect(parseReduxFormKeyValueList()).toEqual(expected);
  });
});

describe('parseReduxFormTaints', () => {
  it('returns the valid input', () => {
    const reduxFormInput = [
      { key: 'foo', value: 'bar', effect: 'NoExecute' },
      { key: 'hello', value: 'world', effect: 'NoSchedule' },
    ];
    const expected = reduxFormInput;
    expect(parseReduxFormTaints(reduxFormInput)).toEqual(expected);
  });

  it('returns only with "key" field', () => {
    const reduxFormInput = [
      { key: undefined, value: 'world', effect: 'NoExecute' },
      { key: 'hello', value: 'world', effect: undefined },
      { key: 'foo', value: 'bar', effect: 'NoExecute' },
      { key: 'hello', value: undefined, effect: 'NoExecute' },
    ];
    const expected = [
      { key: 'foo', value: 'bar', effect: 'NoExecute' },
      { key: 'hello', value: '', effect: 'NoExecute' },
    ];
    expect(parseReduxFormTaints(reduxFormInput)).toEqual(expected);
  });

  it('returns an empty array', () => {
    const reduxFormInput = [{}, {}, {}];
    const expected = [];
    expect(parseReduxFormTaints(reduxFormInput)).toEqual(expected);
  });
});

describe('goZeroTime2Null', () => {
  it('returns null for golang zero time', () => {
    expect(goZeroTime2Null('0001-01-01T00:00:00Z')).toEqual(null);
    expect(goZeroTime2Null('0001-01-01T00:00:00Z')).toEqual(null);
    expect(goZeroTime2Null('0001-01-01T00:00:00.000000+00:00')).toEqual(null);
  });

  it('returns "empty" values as is', () => {
    expect(goZeroTime2Null(null)).toEqual(null);
    expect(goZeroTime2Null(false)).toEqual(false);
    expect(goZeroTime2Null('')).toEqual('');
  });

  it('returns valid time str as is', () => {
    const tm = new Date();
    expect(goZeroTime2Null(tm.toDateString())).toEqual(tm.toDateString());
    expect(goZeroTime2Null(tm.toLocaleDateString())).toEqual(tm.toLocaleDateString());
    expect(goZeroTime2Null(tm.toUTCString())).toEqual(tm.toUTCString());
  });
});

describe('strToKeyValueObject', () => {
  test('handles undefined', () => {
    expect(strToKeyValueObject(undefined)).toBeUndefined();
  });

  test('strToKeyValueObject', () => {
    expect(strToKeyValueObject('')).toEqual({});
    expect(strToKeyValueObject('foo')).toEqual({ foo: undefined });
    expect(Object.hasOwn(strToKeyValueObject('foo2'), 'foo2')).toBeTruthy();
    expect(strToKeyValueObject('foo', 'bar')).toEqual({ foo: 'bar' });
    expect(strToKeyValueObject('foo=')).toEqual({ foo: '' });
    expect(strToKeyValueObject('foo=bar,foo2')).toEqual({ foo: 'bar', foo2: undefined });
    expect(strToKeyValueObject('foo=bar,foo2,foo=,foo=z,foo=')).toEqual({
      foo: '',
      foo2: undefined,
    });
  });

  describe('truncateTextWithEllipsis', () => {
    it.each([
      ['original text is unset', '', 22],
      ['maxLength is unset', 'this-text-will-not-be-cut', 0],
      [
        'original text is shorter than maxLength',
        'this-text-will-not-be-cut',
        'this-text-will-not-be-cut'.length + 1,
      ],
    ])('returns the original text when %s', (testCase, text, maxLength) =>
      expect(truncateTextWithEllipsis(text, maxLength)).toBe(text),
    );

    it.each([
      ['this-text-will-be-cut', 12, 'this... l-be-cut'],
      [
        'very long text, it is longer than forty five characters and it will be truncated down!',
        45,
        'very long text,... and it will be truncated down!',
      ],
    ])('truncates the original text correctly', (text, maxLength, truncatedText) =>
      expect(truncateTextWithEllipsis(text, maxLength)).toBe(truncatedText),
    );
  });
});

describe('scrollToFirstField', () => {
  const htmlContent = fs.readFileSync(path.join(__dirname, './helpers.fixtures.html'), 'utf8');
  it.each([
    ['name', 'name'],
    ['domain_prefix', 'domain_prefix'],
    ['has_domain_prefix', 'has_domain_prefix'],
    ['as_domain_prefix', 'has_domain_prefix'],
    ['omain_prefix', 'has_domain_prefix'],
  ])('ID: %s', (id, expectedId) => {
    // Arrange
    document.body.innerHTML = htmlContent;

    // Act
    scrollToFirstField([id]);

    // Assert
    expect(document.activeElement.id).toBe(expectedId);
  });
});
