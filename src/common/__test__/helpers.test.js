import helpers, { parseReduxFormKeyValueList, parseReduxFormTaints, goZeroTime2Null } from '../helpers';

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
    const reduxFormInput = [{ key: 'foo', value: 'bar' }, { key: 'hello', value: 'world' }];
    const expected = { foo: 'bar', hello: 'world' };
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('only returns pairs with non empty keys', () => {
    const reduxFormInput = [{ key: 'foo', value: 'bar' }, { key: undefined, value: 'world' }];
    const expected = { foo: 'bar' };
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('returns empty values as empty strings', () => {
    const reduxFormInput = [{ key: 'foo', value: 'bar' }, { key: 'hello', undefined: 'world' }];
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
    const reduxFormInput = [{ key: 'foo', value: 'bar', effect: 'NoExecute' }, { key: 'hello', value: 'world', effect: 'NoSchedule' }];
    const expected = reduxFormInput;
    expect(parseReduxFormTaints(reduxFormInput)).toEqual(expected);
  });

  it('returns only non empty items', () => {
    const reduxFormInput = [
      { key: undefined, value: 'world', effect: 'NoExecute' },
      { key: 'hello', value: 'world', effect: undefined },
      { key: 'foo', value: 'bar', effect: 'NoExecute' },
      { key: 'hello', value: undefined, effect: undefined },
    ];
    const expected = [{ key: 'foo', value: 'bar', effect: 'NoExecute' }];
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
