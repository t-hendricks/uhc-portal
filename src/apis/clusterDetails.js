/* eslint-disable-next-line */
import config from '../config'
const fetchClusterDetailsAPI = (params) => {
  const options = {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('kctoken')}` },
  };
  return fetch(`${config.configData.apiGateway}/api/clusters_mgmt/v1/clusters/${params.clusterID}`, options);
};

export default fetchClusterDetailsAPI;
