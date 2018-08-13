import fetchClusterDetailsAPI from '../apis/clusterDetails';

export const CLUSTER_DETAILS_RESPONSE = 'CLUSTER_DETAILS_RESPONSE';

const clusterDetailsResponse = payload => ({
  payload,
  type: CLUSTER_DETAILS_RESPONSE,
});

export const fetchClusterDetails = clusterID => (dispatch) => {
  fetchClusterDetailsAPI({ clusterID }).then((response) => {
    response.json().then((value) => {
      const ret = {};
      ret[clusterID] = value;
      dispatch(clusterDetailsResponse(ret));
    });
  });
};
