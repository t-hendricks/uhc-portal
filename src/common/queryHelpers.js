import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';


const viewPropsChanged = (nextViewOptions, currentViewOptions) => (
  nextViewOptions.currentPage !== currentViewOptions.currentPage
    || nextViewOptions.pageSize !== currentViewOptions.pageSize
    || !isEqual(nextViewOptions.sorting, currentViewOptions.sorting)
    || !isEqual(nextViewOptions.filter, currentViewOptions.filter)
    || !isEqual(nextViewOptions.flags, currentViewOptions.flags)
);

// The backend accepts queries in https://github.com/yaacov/tree-search-language syntax,
// which is effectively a subset of SQL.
// This requires the UI to construct the syntax correctly (e.g. escape singlequotes).
// It also means that the query we send to the backend is quite complicated.

const sqlString = (s) => {
  // escape ' characters by doubling
  const escaped = s.replace(/'/g, "''");
  return `'${escaped}'`;
};

const createViewQueryObject = (viewOptions, queryObj) => {
  const queryObject = {
    ...queryObj,
  };

  if (viewOptions) {
    queryObject.page = viewOptions.currentPage;
    queryObject.page_size = viewOptions.pageSize;

    if (viewOptions.sorting.sortField !== null) {
      const direction = viewOptions.sorting.isAscending ? 'asc' : 'desc';
      if (viewOptions.sorting.sortField === 'name') {
        queryObject.order = `display_name ${direction}`;
      } else {
        queryObject.order = `${viewOptions.sorting.sortField} ${direction}`;
      }
    }

    const clauses = []; // will be joined with AND

    // base filter: filter out clusters without IDs
    clauses.push("cluster_id!=''");

    // handle archived flag
    if (viewOptions.flags.showArchived) {
      clauses.push("status='Archived'");
    } else {
      clauses.push("status NOT IN ('Deprovisioned', 'Archived')");
    }

    // If we got a search string from the user, format it as a LIKE query.
    if (viewOptions.filter) {
      const likePattern = `%${viewOptions.filter}%`;
      clauses.push(`display_name ILIKE ${sqlString(likePattern)} OR external_cluster_id ILIKE ${sqlString(likePattern)}`);
    }

    if (!isEmpty(viewOptions.flags.subscriptionFilter)) {
      // We got flags for filtering according to specific subscription properties
      // subscriptionFilter is an object in the form of { key: ["possible", "values"] }
      Object.keys(viewOptions.flags.subscriptionFilter).forEach((field) => {
        const items = viewOptions.flags.subscriptionFilter[field];
        if (!isEmpty(items)) {
          // convert each list of selected filter values to a SQL-like clause
          const quotedItems = viewOptions.flags.subscriptionFilter[field].map(sqlString);
          clauses.push(`${field} IN (${quotedItems.join(',')})`);
        }
      });
    }

    queryObject.filter = clauses.map(c => `(${c})`).join(' AND ').trim();
  }

  return queryObject;
};

const createServiceLogQueryObject = (viewOptions, externalClusterID, queryObj) => {
  const queryObject = {
    ...queryObj,
  };

  if (viewOptions) {
    queryObject.page = viewOptions.currentPage;
    queryObject.page_size = viewOptions.pageSize;

    if (viewOptions.sorting.sortField !== null) {
      const direction = viewOptions.sorting.isAscending ? 'asc' : 'desc';
      queryObject.order = `${viewOptions.sorting.sortField} ${direction}`;
    }

    const clauses = []; // will be joined with AND

    // base filter: search by cluster_uuid
    clauses.push(`cluster_uuid = '${externalClusterID}'`);

    // If we got a search string from the user, format it as an ILIKE query.
    if (viewOptions.filter) {
      const { description } = viewOptions.filter;
      if (description !== '') {
        const likePattern = `%${description}%`;
        clauses.push(`(description ILIKE ${sqlString(likePattern)} OR summary ILIKE ${sqlString(likePattern)})`);
      }
    }

    if (viewOptions.flags) {
      const { severityTypes = [] } = viewOptions.flags.conditionalFilterFlags;
      if (severityTypes.length > 0) {
        const quotedItems = severityTypes.map(sqlString);
        clauses.push(`severity IN (${quotedItems.join(',')})`);
      }
    }

    queryObject.filter = clauses.map(c => `(${c})`)
      .join(' AND ')
      .trim();
  }

  return queryObject;
};

const createClustersWithIssuesQueryObject = (viewOptions, queryObj) => {
  const queryObject = {
    ...queryObj,
  };

  if (viewOptions) {
    queryObject.page = viewOptions.currentPage;
    queryObject.page_size = viewOptions.pageSize;
    queryObject.filter = `health_state='${viewOptions.filter.healthState}'`;
  }

  return queryObject;
};


const buildUrlParams = params => Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`)
  .join('&');

/**
 * Create URL params for the cluster list filter.
 * The resulting filters are not escaped, comma separated, and empty arrays are omitted.
 *
* For example:
 * ```
 * buildFilterURLParams({ a: ['a', 'b'], c: [], d: ['e'] }) = 'a=a,b&d=e'
 * ```
 * @param {Object} params
 */
const buildFilterURLParams = params => Object.keys(params).map(
  key => (!isEmpty(params[key]) && `${key}=${params[key].join(',')}`),
).filter(Boolean).join('&');

const getQueryParam = (param) => {
  let ret;
  window.location.search.substring(1).split('&').forEach((queryString) => {
    const [key, val] = queryString.split('=');
    if (key === param) {
      ret = val;
    }
  });
  return ret;
};

export {
  buildFilterURLParams,
  buildUrlParams,
  createViewQueryObject,
  createServiceLogQueryObject,
  createClustersWithIssuesQueryObject,
  viewPropsChanged,
  sqlString,
  getQueryParam,
};
