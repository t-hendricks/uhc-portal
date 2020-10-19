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
import produce from 'immer';
import moment from 'moment';

import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import {
  GET_VERSION_INFO,
  POST_UPGRADE_SCHEDULE,
  GET_UPGRADE_SCHEDULES,
  DELETE_UPGRADE_SCHEDULE,
  CLEAR_DELETE_UPGRADE_SCHEDULE,
  CLEAR_POST_UPGRADE_SCHEDULE,
} from './clusterUpgradeActions';

const initialState = {
  versionInfo: {
    ...baseRequestState,
    version: undefined,
    availableUpgrades: [],
  },
  postedUpgradeSchedule: {
    ...baseRequestState,
  },
  deleteScheduleRequest: {
    ...baseRequestState,
  },
  schedules: {
    ...baseRequestState,
    items: [],
  },
};

function UpgradesRecuder(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case PENDING_ACTION(GET_VERSION_INFO):
        draft.versionInfo.pending = true;
        break;
      case FULFILLED_ACTION(GET_VERSION_INFO): {
        // eslint-disable-next-line camelcase
        const channelGroup = action.payload.data?.channel_group;
        let version = action.payload.data?.id?.replace('openshift-v', '');
        if (channelGroup && version) {
          // remove channel group from version, to match the version number format in Telemetry
          version = version.replace(`-${channelGroup}`, '');
        }
        draft.versionInfo = {
          ...initialState.versionInfo,
          fulfilled: true,
          version,
          channelGroup,
          // eslint-disable-next-line camelcase
          availableUpgrades: action.payload.data?.available_upgrades || [],
        };
        break;
      }
      case REJECTED_ACTION(GET_VERSION_INFO):
        draft.versionInfo = {
          ...initialState,
          ...getErrorState(action),
        };
        break;

      case PENDING_ACTION(POST_UPGRADE_SCHEDULE):
        draft.postedUpgradeSchedule.pending = true;
        break;
      case FULFILLED_ACTION(POST_UPGRADE_SCHEDULE):
        draft.postedUpgradeSchedule = {
          ...initialState.upgradeSchedule,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(POST_UPGRADE_SCHEDULE):
        draft.postedUpgradeSchedule = {
          ...initialState,
          ...getErrorState(action),
        };
        break;
      case CLEAR_POST_UPGRADE_SCHEDULE:
        draft.postedUpgradeSchedule = { ...initialState };
        break;

      case PENDING_ACTION(GET_UPGRADE_SCHEDULES):
        draft.schedules.pending = true;
        break;
      case FULFILLED_ACTION(GET_UPGRADE_SCHEDULES): {
        const items = action.payload?.data?.items || [];
        items.sort((a, b) => moment(a.next_run).unix() - moment(b.next_run).unix());
        draft.schedules = {
          ...initialState.schedules,
          fulfilled: true,
          items,
        };
        break;
      }
      case REJECTED_ACTION(GET_UPGRADE_SCHEDULES):
        draft.schedules = {
          ...initialState.schedules,
          ...getErrorState(action),
        };
        break;

      case PENDING_ACTION(DELETE_UPGRADE_SCHEDULE):
        draft.deleteScheduleRequest.pending = true;
        break;
      case FULFILLED_ACTION(DELETE_UPGRADE_SCHEDULE):
        draft.deleteScheduleRequest = {
          ...initialState.deleteScheduleRequest,
          fulfilled: true,
        };
        break;
      case REJECTED_ACTION(DELETE_UPGRADE_SCHEDULE):
        draft.deleteScheduleRequest = {
          ...initialState.deleteScheduleRequest,
          ...getErrorState(action),
        };
        break;

      case CLEAR_DELETE_UPGRADE_SCHEDULE:
        draft.deleteScheduleRequest = { ...initialState.deleteScheduleRequest };
        break;
    }
  });
}

UpgradesRecuder.initialState = initialState;

export { initialState, UpgradesRecuder };

export default UpgradesRecuder;
