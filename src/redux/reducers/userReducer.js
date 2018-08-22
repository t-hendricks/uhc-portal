import { userConstants } from '../constants';

const userProfile = (state = {}, action) => {
  switch (action.type) {
    case userConstants.USER_INFO_RESPONSE:
      return action.payload;
    default:
      return state;
  }
};

export default userProfile;
