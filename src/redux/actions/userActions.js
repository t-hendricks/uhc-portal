import { userConstants } from '../constants';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const userActions = {
  userInfoResponse,
};

export { userActions, userInfoResponse };
