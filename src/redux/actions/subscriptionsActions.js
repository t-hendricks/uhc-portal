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
import { subscriptionsConstants } from '../constants';
import { accountsService } from '../../services';


function fetchAccount() {
  return dispatch => dispatch({
    type: subscriptionsConstants.GET_ACCOUNT,
    payload: accountsService.getCurrentAccount(),
  });
}

function fetchQuotaSummary(organizationID, params) {
  return dispatch => dispatch({
    type: subscriptionsConstants.GET_QUOTA_SUMMARY,
    payload: accountsService.getRequest(['quota_summary', organizationID], params),
  });
}

const subscriptionsActions = {
  fetchAccount,
  fetchQuotaSummary,
};

export {
  subscriptionsActions,
  fetchAccount,
  fetchQuotaSummary,
};
