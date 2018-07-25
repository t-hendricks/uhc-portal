/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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

export default combineReducers({
  userProfile
})
