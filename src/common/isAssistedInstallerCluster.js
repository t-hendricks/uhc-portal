import { normalizedProducts } from './subscriptionTypes';

const isAssistedInstallSubscription = subscription => (
  subscription?.plan?.id === normalizedProducts.OCP_Assisted_Install
);

export const isAssistedInstallCluster = cluster => (
  isAssistedInstallSubscription(cluster.subscription)
);

// An uninstalled cluster is any cluster which is either being defined by the user (in Draft),
// being installed (in progress) or failed  installation (unsuccessful installation)
export const isUninstalledAICluster = cluster => (
  isAssistedInstallSubscription(cluster.subscription) && cluster.state !== 'installed'
);

export default isAssistedInstallSubscription;
