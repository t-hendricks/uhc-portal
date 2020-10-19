import { getVersionInfo, postUpgradeSchedule } from '../../../../services/clusterService';

const GET_VERSION_INFO = 'GET_VERSION_INFO';
const POST_UPGRADE_SCHEDULE = 'POST_UPGRADE_SCHEDULE';

const getVersion = (version, channel) => (dispatch) => {
  const versionID = channel === 'stable' ? `openshift-v${version}` : `openshift-v${version}-${channel}`;
  dispatch({
    type: GET_VERSION_INFO,
    payload: getVersionInfo(versionID),
  });
};

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
