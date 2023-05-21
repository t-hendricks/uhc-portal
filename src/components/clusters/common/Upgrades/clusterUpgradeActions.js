import {
  postUpgradeSchedule,
  postControlPlaneUpgradeSchedule,
  getUpgradeSchedules,
  getControlPlaneUpgradeSchedules,
  getUpgradeScheduleState,
  deleteUpgradeSchedule,
  deleteControlPlaneUpgradeSchedule,
  patchUpgradeSchedule,
  patchControlPlaneUpgradeSchedule,
} from '../../../../services/clusterService';

const POST_UPGRADE_SCHEDULE = 'POST_UPGRADE_SCHEDULE';
const CLEAR_POST_UPGRADE_SCHEDULE = 'CLEAR_UPGRADE_SCHEDULE';
const GET_UPGRADE_SCHEDULES = 'GET_UPGRADE_SCHEDULES';
const DELETE_UPGRADE_SCHEDULE = 'DELETE_UPGRADE_SCHEDULE';
const CLEAR_DELETE_UPGRADE_SCHEDULE = 'CLEAR_DELETE_UPGRADE_SCHEDULE';
const CLEAR_GET_UPGRADE_SCHEDULE = 'CLEAR_GET_UPGRADE_SCHEDULE';
const SET_CLUSTER_UPGRADE_POLICY = 'SET_CLUSTER_UPGRADE_POLICY';

const getSchedules = (clusterID, isHypershift) => (dispatch) =>
  dispatch({
    type: GET_UPGRADE_SCHEDULES,
    payload: isHypershift
      ? getControlPlaneUpgradeSchedules(clusterID)
      : getUpgradeSchedules(clusterID).then((schedulesResponse) => {
          const items = schedulesResponse.data.items || [];
          const promises = [];
          items.forEach((schedule) => {
            promises.push(
              getUpgradeScheduleState(schedule.cluster_id, schedule.id).then((stateResponse) => {
                // eslint-disable-next-line no-param-reassign
                schedule.state = stateResponse.data;
              }),
            );
          });
          return Promise.all(promises).then(() => {
            // eslint-disable-next-line no-param-reassign
            schedulesResponse.data.items = items;
            return schedulesResponse;
          });
        }),
  });

const postSchedule = (clusterID, schedule, isHypershift) => (dispatch) => {
  const requestPost = isHypershift ? postControlPlaneUpgradeSchedule : postUpgradeSchedule;
  dispatch({
    type: POST_UPGRADE_SCHEDULE,
    payload: requestPost(clusterID, schedule).then((response) => {
      dispatch(getSchedules(clusterID, isHypershift)); // refresh schedules after posting
      return response;
    }),
  });
};

const replaceSchedule = (clusterID, oldScheduleID, newSchedule, isHypershift) => (dispatch) => {
  const requestDelete = isHypershift ? deleteControlPlaneUpgradeSchedule : deleteUpgradeSchedule;
  const requestPost = isHypershift ? postControlPlaneUpgradeSchedule : postUpgradeSchedule;
  dispatch({
    type: POST_UPGRADE_SCHEDULE,
    payload: requestDelete(clusterID, oldScheduleID)
      .then(() => requestPost(clusterID, newSchedule))
      .then((response) => {
        dispatch(getSchedules(clusterID, isHypershift)); // refresh schedules after replacing
        return response;
      }),
  });
};

const editSchedule = (clusterID, policyID, schedule, isHypershift) => (dispatch) => {
  const requestPatch = isHypershift ? patchControlPlaneUpgradeSchedule : patchUpgradeSchedule;
  dispatch({
    type: POST_UPGRADE_SCHEDULE,
    payload: requestPatch(clusterID, policyID, schedule).then((response) => {
      dispatch(getSchedules(clusterID, isHypershift)); // refresh schedules after posting
      return response;
    }),
  });
};

const deleteSchedule = (clusterID, scheduleID, isHypershift) => (dispatch) => {
  const requestDelete = isHypershift ? deleteControlPlaneUpgradeSchedule : deleteUpgradeSchedule;
  dispatch({
    type: DELETE_UPGRADE_SCHEDULE,
    payload: requestDelete(clusterID, scheduleID).then((response) => {
      dispatch(getSchedules(clusterID, isHypershift)); // refresh schedules after deletion
      return response;
    }),
  });
};

const clearDeleteScheduleResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_DELETE_UPGRADE_SCHEDULE,
  });

const clearPostedUpgradeScheduleResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_POST_UPGRADE_SCHEDULE,
  });

const clearSchedulesResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_GET_UPGRADE_SCHEDULE,
  });

const setAutomaticUpgradePolicy = (upgradePolicy) => ({
  type: SET_CLUSTER_UPGRADE_POLICY,
  payload: upgradePolicy,
});

export {
  POST_UPGRADE_SCHEDULE,
  CLEAR_POST_UPGRADE_SCHEDULE,
  GET_UPGRADE_SCHEDULES,
  DELETE_UPGRADE_SCHEDULE,
  CLEAR_DELETE_UPGRADE_SCHEDULE,
  CLEAR_GET_UPGRADE_SCHEDULE,
  SET_CLUSTER_UPGRADE_POLICY,
  postSchedule,
  editSchedule,
  getSchedules,
  deleteSchedule,
  replaceSchedule,
  clearDeleteScheduleResponse,
  clearPostedUpgradeScheduleResponse,
  clearSchedulesResponse,
  setAutomaticUpgradePolicy,
};
