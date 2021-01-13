import helpers, { parseReduxFormKeyValueList, parseReduxFormTaints } from '../helpers';

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

  it('returns only non empty pairs', () => {
    const reduxFormInput = [{ key: 'foo', value: 'bar' }, { key: undefined, value: 'world' }, { key: 'hello', undefined: 'world' }];
    const expected = { foo: 'bar' };
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
  });

  it('returns an empty object', () => {
    const reduxFormInput = [{}, {}, {}];
    const expected = {};
    expect(parseReduxFormKeyValueList(reduxFormInput)).toEqual(expected);
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
