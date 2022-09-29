import { OCM } from 'openshift-assisted-ui-lib';

const {
  Services: {
    APIs: { ClustersAPI, FeatureSupportLevelsAPI },
  },
} = OCM;

const getAIClustersBySubscription = ClustersAPI.listBySubscriptionIds;

const getAICluster = ClustersAPI.get;
const getAIFeatureSupportLevels = FeatureSupportLevelsAPI.list;

const assistedService = {
  getAIClustersBySubscription,
  getAICluster,
  getAIFeatureSupportLevels,
};

export default assistedService;
