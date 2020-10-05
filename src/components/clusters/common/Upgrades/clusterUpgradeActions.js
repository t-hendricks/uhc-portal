import { getVersionInfo, postUpgradeSchedule } from '../../../../services/clusterService';

const GET_VERSION_INFO = 'GET_VERSION_INFO';
const POST_UPGRADE_SCHEDULE = 'POST_UPGRADE_SCHEDULE';

const getVersion = version => dispatch => dispatch({
  type: GET_VERSION_INFO,
  payload: getVersionInfo(`openshift-v${version}`),
});

const postSchedule = (clusterID, schedule) => dispatch => dispatch({
  type: POST_UPGRADE_SCHEDULE,
  payload: postUpgradeSchedule(clusterID, schedule),
});

export {
  GET_VERSION_INFO,
  POST_UPGRADE_SCHEDULE,
  getVersion,
  postSchedule,
};
