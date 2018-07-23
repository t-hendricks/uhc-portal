/* eslint-disable-next-line */
export const fetchClusterDetails = (params) => {
  console.log("fetchCluserDetails", params)
  return fetch("/api/clusters_mgmt/v1/clusters/" + params.clusterID);
};
