import { normalizedProducts } from './subscriptionTypes';

const isAssistedInstallSubscription = subscription => (
  subscription?.plan?.id === normalizedProducts.OCP_Assisted_Install
);

export const isAssistedInstallCluster = cluster => (
  isAssistedInstallSubscription(cluster.subscription)
);

export default isAssistedInstallSubscription;
