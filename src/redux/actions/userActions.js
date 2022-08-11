import get from 'lodash/get';
import { store } from '../store';

import { userConstants } from '../constants';
import { accountsService, authorizationsService } from '../../services';
import { normalizeQuotaCost } from '../../common/normalize';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

/** Normalize incoming quota. */
const processQuota = response => ({
  items: get(response.data, 'items', []).map(normalizeQuotaCost),
});

const fetchQuota = organizationID => (
  accountsService.getOrganizationQuota(organizationID).then(processQuota)
);

const fetchQuotaAndOrganization = (organizationID, organization) => {
  const ret = {
    quota: undefined,
    organization: organization !== undefined ? organization.details : organization,
  };
  const promises = [fetchQuota(organizationID).then((quota) => { ret.quota = quota; })];
  if (organization === undefined) {
    promises.push(accountsService.getOrganization(organizationID).then(
      (fetchedOrganization) => { ret.organization = fetchedOrganization.data; },
    ));
  }
  return Promise.all(promises).then(() => ret);
};

const fetchAccountThenQuotaAndOrganization = () => accountsService.getCurrentAccount().then(
  (response) => {
    const organizationID = get(response.data, 'organization.id');
    return (organizationID !== undefined) ? fetchQuotaAndOrganization(organizationID) : Promise.reject(Error('No organization'));
  },
);

const getOrganizationAndQuota = () => {
  const { userProfile } = store.getState();
  const organizationID = userProfile?.organization?.details?.id;
  return dispatch => dispatch({
    payload: organizationID !== undefined
      ? fetchQuotaAndOrganization(organizationID, userProfile?.organization)
      : fetchAccountThenQuotaAndOrganization(),
    type: userConstants.GET_ORGANIZATION,
  });
};

function selfTermsReview() {
  return dispatch => dispatch({
    type: userConstants.SELF_TERMS_REVIEW,
    payload: authorizationsService.selfTermsReview(),
  });
}

const userActions = {
  userInfoResponse,
  getOrganizationAndQuota,
  processQuota,
  selfTermsReview,
};

export {
  userActions,
  userInfoResponse,
  getOrganizationAndQuota,
  selfTermsReview,
};
