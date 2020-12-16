import helpers, { parseReduxFormKeyValueList, hasLabelsInput } from '../helpers';

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

describe('hasLabelsInput', () => {
  it('returns true if there is some input', () => {
    const reduxFormInput = [{ key: 'foo', value: 'bar' }, { key: 'hello', value: 'world' }];
    expect(hasLabelsInput(reduxFormInput)).toBe(true);
  });

  it('returns false if there is no input', () => {
    const reduxFormInput = [{}];
    expect(hasLabelsInput(reduxFormInput)).toBe(false);
  });
  it('returns true if there is some input in the middle of the list', () => {
    const reduxFormInput = [{}, { key: 'foo', value: 'bar' }, {}];
    expect(hasLabelsInput(reduxFormInput)).toBe(true);
  });
});
