import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const getOrganization = () => ({
  payload: accountsService.getCurrentAccount().then((response) => {
    const organizationID = get(response.data, 'organization.id');
    if (organizationID !== undefined) {
      return accountsService.getOrganization(organizationID);
    }
    return Promise.reject(Error('No organization'));
  }),
  type: userConstants.GET_ORGANIZATION,
});

const fetchOrganizationQuota = organiztionID => dispatch => dispatch({
  type: userConstants.GET_ORG_QUOTA,
  payload: accountsService.getOrganizationQuota(organiztionID),
});

const userActions = {
  userInfoResponse,
  getOrganization,
  fetchOrganizationQuota,
};

export {
  userActions, userInfoResponse, getOrganization, fetchOrganizationQuota,
};
