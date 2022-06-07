import { OCM } from 'openshift-assisted-ui-lib';

const {
  Services: {
    APIs: {
      ClustersAPI,
    },
  },
} = OCM;

const getAIClustersBySubscription = ClustersAPI.listBySubscriptionIds;

const getAICluster = ClustersAPI.get;

const assistedService = {
  getAIClustersBySubscription,
  getAICluster,
};

export default assistedService;
