import { userConstants } from '../constants';
import { accountsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const getOrganization = () => ({
  payload: accountsService.getCurrentAccount().then((response) => {
    const organizationID = response.data.organization.id;
    return accountsService.getOrganization(organizationID);
  }),
  type: userConstants.GET_ORGANIZATION,
});

const userActions = {
  userInfoResponse,
  getOrganization,
};

export { userActions, userInfoResponse, getOrganization };
