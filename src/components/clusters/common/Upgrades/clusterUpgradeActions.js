import {
  postUpgradeSchedule,
  getUpgradeSchedules,
  getUpgradeScheduleState,
  deleteUpgradeSchedule,
  patchUpgradeSchedule,
} from '../../../../services/clusterService';

const POST_UPGRADE_SCHEDULE = 'POST_UPGRADE_SCHEDULE';
const CLEAR_POST_UPGRADE_SCHEDULE = 'CLEAR_UPGRADE_SCHEDULE';
const GET_UPGRADE_SCHEDULES = 'GET_UPGRADE_SCHEDULES';
const DELETE_UPGRADE_SCHEDULE = 'DELETE_UPGRADE_SCHEDULE';
const CLEAR_DELETE_UPGRADE_SCHEDULE = 'CLEAR_DELETE_UPGRADE_SCHEDULE';
const CLEAR_GET_UPGRADE_SCHEDULE = 'CLEAR_GET_UPGRADE_SCHEDULE';

const getSchedules = clusterID => dispatch => dispatch({
  type: GET_UPGRADE_SCHEDULES,
  payload: getUpgradeSchedules(clusterID).then((schedulesResponse) => {
    const items = schedulesResponse.data.items || [];
    const promises = [];
    items.forEach((schedule) => {
      promises.push(getUpgradeScheduleState(schedule.cluster_id, schedule.id).then(
        // eslint-disable-next-line no-param-reassign
        (stateResponse) => { schedule.state = stateResponse.data; },
      ));
    });
    return Promise.all(promises).then(() => {
      // eslint-disable-next-line no-param-reassign
      schedulesResponse.data.items = items;
      return schedulesResponse;
    });
  }),
});

const postSchedule = (clusterID, schedule) => dispatch => dispatch({
  type: POST_UPGRADE_SCHEDULE,
  payload: postUpgradeSchedule(clusterID, schedule).then((response) => {
    dispatch(getSchedules(clusterID)); // refresh schedules after posting
    return response;
  }),
});

const replaceSchedule = (clusterID, oldScheduleID, newSchedule) => dispatch => dispatch({
  type: POST_UPGRADE_SCHEDULE,
  payload: deleteUpgradeSchedule(clusterID, oldScheduleID).then(
    () => postUpgradeSchedule(clusterID, newSchedule),
  ).then((response) => {
    dispatch(getSchedules(clusterID)); // refresh schedules after replacing
    return response;
  }),
});

const editSchedule = (clusterID, policyID, schedule) => dispatch => dispatch({
  type: POST_UPGRADE_SCHEDULE,
  payload: patchUpgradeSchedule(clusterID, policyID, schedule).then((response) => {
    dispatch(getSchedules(clusterID)); // refresh schedules after posting
    return response;
  }),
});

const deleteSchedule = (clusterID, scheduleID) => dispatch => dispatch({
  type: DELETE_UPGRADE_SCHEDULE,
  payload: deleteUpgradeSchedule(clusterID, scheduleID).then((response) => {
    dispatch(getSchedules(clusterID)); // refresh schedules after deletion
    return response;
  }),
});

const clearDeleteScheduleResponse = () => dispatch => dispatch({
  type: CLEAR_DELETE_UPGRADE_SCHEDULE,
});

const clearPostedUpgradeScheduleResponse = () => dispatch => dispatch({
  type: CLEAR_POST_UPGRADE_SCHEDULE,
});

const clearSchedulesResponse = () => dispatch => dispatch({
  type: CLEAR_GET_UPGRADE_SCHEDULE,
});

export {
  POST_UPGRADE_SCHEDULE,
  CLEAR_POST_UPGRADE_SCHEDULE,
  GET_UPGRADE_SCHEDULES,
  DELETE_UPGRADE_SCHEDULE,
  CLEAR_DELETE_UPGRADE_SCHEDULE,
  CLEAR_GET_UPGRADE_SCHEDULE,
  postSchedule,
  editSchedule,
  getSchedules,
  deleteSchedule,
  replaceSchedule,
  clearDeleteScheduleResponse,
  clearPostedUpgradeScheduleResponse,
  clearSchedulesResponse,
};
