import {
  dedicatedRhInfra,
  unlimitedROSA,
  dbaAddon,
} from '../../clusters/common/__test__/quota_cost.fixtures';
import { subscriptionsReducer } from '../../../redux/reducers/subscriptionsReducer';

const fetchAccount = jest.fn();
const fetchQuotaCost = jest.fn();
const invalidateClusters = jest.fn();

const organizationID = 'org-1';

const account = {
  error: false,
  errorDetails: null,
  errorMessage: '',
  fulfilled: true,
  pending: false,
  valid: true,
  data: {
    organization: {
      id: organizationID,
    },
  },
};

const buildState = (quotaCostItems) => {
  const action = {
    type: 'GET_QUOTA_COST_FULFILLED',
    payload: { data: { items: quotaCostItems } },
  };
  return subscriptionsReducer(undefined, action).quotaCost;
};

const emptyQuotaCost = buildState([]);
const quotaCost = buildState([].concat(dedicatedRhInfra, unlimitedROSA, dbaAddon));
// unlimitedROSA only contains 0-cost quota so is not shown.
const expectedRowsForQuotaCost = dedicatedRhInfra.length + 0 + dbaAddon.length;

const rows = [];

export {
  fetchAccount,
  fetchQuotaCost,
  organizationID,
  account,
  emptyQuotaCost,
  quotaCost,
  expectedRowsForQuotaCost,
  rows,
  invalidateClusters,
};
