import { normalizedProducts, subscriptionStatuses } from './subscriptionTypes';

const isAssistedInstallSubscription = (subscription) =>
  subscription?.plan?.id === normalizedProducts.OCP_Assisted_Install;

export const isAssistedInstallCluster = (cluster) =>
  isAssistedInstallSubscription(cluster.subscription);

// An uninstalled cluster is any cluster which is either being defined by the user (in Draft),
// being installed (in progress) or failed  installation (unsuccessful installation)
export const isUninstalledAICluster = (cluster) =>
  isAssistedInstallSubscription(cluster.subscription) &&
  cluster.subscription?.status === subscriptionStatuses.RESERVED &&
  cluster.state !== 'installed';

// The cluster has not been installed yet or is shortly after installation.
// Telemetry has not reported its data yet.
export const isAISubscriptionWithoutMetrics = (subscription) =>
  isAssistedInstallSubscription(subscription) &&
  (!subscription?.metrics || subscription.metrics.length === 0);

export default isAssistedInstallSubscription;
