
const getClusters = jest.fn();
getClusters.mockResolvedValue({});

const postNewCluster = jest.fn();
postNewCluster.mockResolvedValue({});

const getClusterDetails = jest.fn();
getClusterDetails.mockResolvedValue({});

const editCluster = jest.fn();
editCluster.mockResolvedValue({});

const deleteCluster = jest.fn();
deleteCluster.mockResolvedValue({});

const getCloudProviders = jest.fn();
getCloudProviders.mockResolvedValue({});

const getCloudRegions = jest.fn();
getCloudRegions.mockResolvedValue({});

const getLogs = jest.fn();
getLogs.mockResolvedValue({});

const clusterService = {
  getClusters,
  postNewCluster,
  getClusterDetails,
  editCluster,
  getCloudProviders,
  getCloudRegions,
  deleteCluster,
  getLogs,
};

export default clusterService;
