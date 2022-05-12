import { OCM } from 'openshift-assisted-ui-lib';

const {
  Services: {
    APIs: {
      ClustersAPI,
    },
  },
} = OCM;

const getAIClusters = ClustersAPI.list;

const getAICluster = ClustersAPI.get;

const assistedService = {
  getAIClusters,
  getAICluster,
};

export default assistedService;
