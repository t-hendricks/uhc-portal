import helpers, { buildUrlParams } from './helpers';

test('Error message is properly extracted from the Error API object', () => {
  const err = {
    response: {
      data: {
        kind: 'Error',
        id: 1,
        href: 'http://example.com',
        code: 'CLUSTERS-MGMT-1',
        reason: 'human readable reason',
      },
    },
  };
  expect(helpers.getErrorMessage(err)).toBe('CLUSTERS-MGMT-1:\nhuman readable reason');
});

test('Error message is properly extracted from unexpected object', () => {
  const err = {
    response: {
      data: {
        unexpected: 'object',
      },
    },
  };
  expect(helpers.getErrorMessage(err)).toBe('{"unexpected":"object"}');
});

test('Fail gracefully when getting JS Error objects', () => {
  const err = new Error('Hello');
  expect(helpers.getErrorMessage(err)).toBe('Error: Hello');
});

test('Test buildUrlParams', () => {
  const params = { key1: 'a ', key2: 'a?' };
  expect(buildUrlParams(params)).toBe('key1=a%20&key2=a%3F');
});

test('buildFilterURLParams()', () => {
  const params = { key1: ['a', 'b'], key2: [], key3: ['c'] };
  expect(helpers.buildFilterURLParams(params)).toBe('key1=a,b&key3=c');
  expect(helpers.buildFilterURLParams({})).toBe('');
});

describe('sqlString', () => {
  it('handles empty string', () => {
    expect(helpers.sqlString('')).toBe("''");
  });

  it('doubles single quotes', () => {
    expect(helpers.sqlString("1 quote ' 3 quote'''s 2 quotes ''"))
      .toBe("'1 quote '' 3 quote''''''s 2 quotes '''''");
  });

  it('does not touch other quotes', () => {
    expect(helpers.sqlString('double quote " backtick `'))
      .toBe("'double quote \" backtick `'");
  });

  it('does not touch backslash, %, _', () => {
    // % and _ are special characters in LIKE patterns, but they're
    // not special in SQL syntax.
    // LIKE optionally lets you specify any char as an escape char but again that's
    // later interpretation of a string, it's regular char in SQL string literal.
    expect(helpers.sqlString('path/%._/100\\%')).toBe("'path/%._/100\\%'");
    expect(helpers.sqlString('\\')).toBe("'\\'");
  });
});

describe('createViewQueryObject()', () => {
  const baseViewOptions = {
    currentPage: 3,
    pageSize: 50,
    sorting: {
      sortField: null,
    },
    flags: {},
  };

  const baseResult = {
    page: 3,
    page_size: 50,
    filter: "(cluster_id!='') AND (status NOT IN ('Deprovisioned', 'Archived'))",
  };

  it('properly creates the query object when no filter is defined', () => {
    expect(helpers.createViewQueryObject(baseViewOptions)).toEqual(baseResult);
  });
  it('sorts correctly (with display_name column name translation)', () => {
    const viewOptions = {
      ...baseViewOptions,
      sorting: {
        sortField: 'name',
      },
    };

    expect(helpers.createViewQueryObject(viewOptions)).toEqual({
      ...baseResult,
      order: 'display_name desc',
    });

    viewOptions.sorting.isAscending = true;
    expect(helpers.createViewQueryObject(viewOptions)).toEqual({
      ...baseResult,
      order: 'display_name asc',
    });
  });

  it('sorts correctly (with custom column name)', () => {
    const viewOptions = {
      ...baseViewOptions,
      sorting: {
        sortField: 'custom',
        isAscending: false,
      },
    };

    expect(helpers.createViewQueryObject(viewOptions)).toEqual({
      ...baseResult,
      order: 'custom desc',
    });

    viewOptions.sorting.isAscending = true;
    expect(helpers.createViewQueryObject(viewOptions)).toEqual({
      ...baseResult,
      order: 'custom asc',
    });
  });

  it('handles archived flag when no query is set', () => {
    const viewOptions = {
      ...baseViewOptions,
      flags: {
        showArchived: true,
      },
    };
    expect(helpers.createViewQueryObject(viewOptions)).toEqual({ ...baseResult, filter: "(cluster_id!='') AND (status='Archived')" });
  });

  it('correctly formats filter when a filter is set', () => {
    const viewOptions = {
      ...baseViewOptions,
      filter: "hello world's",
    };

    const escaped = "hello world''s";
    const expected = {
      ...baseResult,
      filter: `(cluster_id!='') AND (status NOT IN ('Deprovisioned', 'Archived')) AND (display_name ILIKE '%${escaped}%' OR external_cluster_id ILIKE '%${escaped}%')`,
    };
    expect(helpers.createViewQueryObject(viewOptions)).toEqual(expected);
  });

  it('correctly formats filter when entitlement_status filter flags are set', () => {
    const viewOptions = {
      ...baseViewOptions,
      flags: {
        subscriptionFilter: {
          entitlement_status: ['a', 'b', 'c'],
          type: ['osd'],
        },
      },
    };
    const expected = {
      ...baseResult,
      filter: "(cluster_id!='') AND (status NOT IN ('Deprovisioned', 'Archived')) AND (entitlement_status IN ('a','b','c')) AND (type IN ('osd'))",
    };

    expect(helpers.createViewQueryObject(viewOptions)).toEqual(expected);
  });
});

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
