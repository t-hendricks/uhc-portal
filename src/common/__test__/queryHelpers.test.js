import {
  buildUrlParams, buildFilterURLParams, sqlString, createViewQueryObject,
} from '../queryHelpers';

test('Test buildUrlParams', () => {
  const params = { key1: 'a ', key2: 'a?' };
  expect(buildUrlParams(params)).toBe('key1=a%20&key2=a%3F');
});

test('buildFilterURLParams()', () => {
  const params = { key1: ['a', 'b'], key2: [], key3: ['c'] };
  expect(buildFilterURLParams(params)).toBe('key1=a,b&key3=c');
  expect(buildFilterURLParams({})).toBe('');
});

describe('sqlString', () => {
  it('handles empty string', () => {
    expect(sqlString('')).toBe("''");
  });

  it('doubles single quotes', () => {
    expect(sqlString("1 quote ' 3 quote'''s 2 quotes ''"))
      .toBe("'1 quote '' 3 quote''''''s 2 quotes '''''");
  });

  it('does not touch other quotes', () => {
    expect(sqlString('double quote " backtick `'))
      .toBe("'double quote \" backtick `'");
  });

  it('does not touch backslash, %, _', () => {
    // % and _ are special characters in LIKE patterns, but they're
    // not special in SQL syntax.
    // LIKE optionally lets you specify any char as an escape char but again that's
    // later interpretation of a string, it's regular char in SQL string literal.
    expect(sqlString('path/%._/100\\%')).toBe("'path/%._/100\\%'");
    expect(sqlString('\\')).toBe("'\\'");
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
    has_filters: false,
    page: 3,
    page_size: 50,
    filter: "(cluster_id!='') AND (status NOT IN ('Deprovisioned', 'Archived'))",
  };

  it('properly creates the query object when no filter is defined', () => {
    expect(createViewQueryObject(baseViewOptions)).toEqual(baseResult);
  });
  it('sorts correctly (with display_name column name translation)', () => {
    const viewOptions = {
      ...baseViewOptions,
      sorting: {
        sortField: 'name',
      },
    };

    expect(createViewQueryObject(viewOptions)).toEqual({
      ...baseResult,
      order: 'display_name desc',
    });

    viewOptions.sorting.isAscending = true;
    expect(createViewQueryObject(viewOptions)).toEqual({
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

    expect(createViewQueryObject(viewOptions)).toEqual({
      ...baseResult,
      order: 'custom desc',
    });

    viewOptions.sorting.isAscending = true;
    expect(createViewQueryObject(viewOptions)).toEqual({
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
    expect(createViewQueryObject(viewOptions)).toEqual({ ...baseResult, filter: "(cluster_id!='') AND (status IN ('Deprovisioned', 'Archived'))" });
  });

  it('correctly formats filter when a filter is set', () => {
    const viewOptions = {
      ...baseViewOptions,
      filter: "hello world's",
    };

    const escaped = "hello world''s";
    const expected = {
      ...baseResult,
      has_filters: !!viewOptions.filter,
      filter: `(cluster_id!='') AND (status NOT IN ('Deprovisioned', 'Archived')) AND (display_name ILIKE '%${escaped}%' OR external_cluster_id ILIKE '%${escaped}%' OR cluster_id ILIKE '%${escaped}%')`,
    };
    expect(createViewQueryObject(viewOptions)).toEqual(expected);
  });

  it('correctly formats filter when plan_id filter flags are set', () => {
    const viewOptions = {
      ...baseViewOptions,
      flags: {
        subscriptionFilter: {
          plan_id: ['OCP', 'ROSA'],
        },
      },
    };
    const expected = {
      ...baseResult,
      has_filters: false,
      filter: "(cluster_id!='') AND (status NOT IN ('Deprovisioned', 'Archived')) AND (plan_id IN ('OCP','OCP-AssistedInstall','MOA','ROSA'))",
    };

    expect(createViewQueryObject(viewOptions)).toEqual(expected);
  });
});
