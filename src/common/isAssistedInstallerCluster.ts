import type { Subscription } from '../types/accounts_mgmt.v1';
import { normalizedProducts, subscriptionStatuses } from './subscriptionTypes';
import { ClusterFromSubscription } from '../types/types';

const isAssistedInstallSubscription = (subscription?: Subscription): boolean =>
  subscription?.plan?.id === normalizedProducts.OCP_Assisted_Install;

export const isAssistedInstallCluster = (cluster: ClusterFromSubscription): boolean =>
  isAssistedInstallSubscription(cluster.subscription);

// An uninstalled cluster is any cluster which is either being defined by the user (in Draft),
// being installed (in progress) or failed  installation (unsuccessful installation)
export const isUninstalledAICluster = (cluster: ClusterFromSubscription): boolean =>
  isAssistedInstallSubscription(cluster.subscription) &&
  cluster.subscription?.status === subscriptionStatuses.RESERVED &&
  cluster.state !== 'installed';

// The cluster has not been installed yet or is shortly after installation.
// Telemetry has not reported its data yet.
export const isAISubscriptionWithoutMetrics = (subscription: Subscription): boolean =>
  isAssistedInstallSubscription(subscription) &&
  (!subscription?.metrics || subscription.metrics.length === 0);

export default isAssistedInstallSubscription;
