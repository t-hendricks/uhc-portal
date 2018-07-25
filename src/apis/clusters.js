/* eslint-disable-next-line */
export const fetchClusterDetails = (params) => {
  console.log("fetchCluserDetails", params)
  const options = {
    headers: { 'Authorization': "Bearer " + sessionStorage.getItem('kctoken') }
  }
  return fetch("/api/clusters_mgmt/v1/clusters/" + params.clusterID, options);
};
