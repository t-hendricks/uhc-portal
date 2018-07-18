import { combineReducers } from 'redux';

export const getUserProfile = state => state.userProfile;

// ACTIONS
const USER_INFO_REQUEST = 'USER_INFO_REQUEST';
const USER_INFO_RESPONSE = 'USER_INFO_RESPONSE';

const fetchUserInfo = () => ({
  type: USER_INFO_REQUEST,
});

export const userInfoResponse = (payload) => {
  return {
    payload,
    type: USER_INFO_RESPONSE,
  };
};

// REDUCERS
const userProfile = (state = {}, action) => {
  switch (action.type) {
    case USER_INFO_RESPONSE:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({userProfile})
