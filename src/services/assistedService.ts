import * as OCM from '@openshift-assisted/ui-lib/ocm';

const {
  Services: {
    APIs: { ClustersAPI },
    NewFeatureSupportLevelsService,
  },
} = OCM;

const getAIClustersBySubscription = ClustersAPI.listBySubscriptionIds;

const getAICluster = ClustersAPI.get;
const getAIFeatureSupportLevels = NewFeatureSupportLevelsService.getFeaturesSupportLevel;

const assistedService = {
  getAIClustersBySubscription,
  getAICluster,
  getAIFeatureSupportLevels,
};

export default assistedService;
