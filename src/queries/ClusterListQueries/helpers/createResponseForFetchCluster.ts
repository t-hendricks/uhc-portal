import isEmpty from 'lodash/isEmpty';

import type { Cluster as AICluster } from '@openshift-assisted/types/assisted-installer-service';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import type { Subscription } from '~/types/accounts_mgmt.v1';
import type { Cluster } from '~/types/clusters_mgmt.v1';
import { ClusterWithPermissions } from '~/types/types';

import isAssistedInstallSubscription from '../../../common/isAssistedInstallerCluster';
import {
  fakeClusterFromAISubscription,
  fakeClusterFromSubscription,
  normalizeCluster,
  normalizeMetrics,
} from '../../../common/normalize';

export type MapEntry = { aiCluster?: AICluster; cluster?: Cluster; subscription: Subscription };

export const createResponseForFetchClusters = (subscriptionMap: Map<string, MapEntry>) => {
  const result: ClusterWithPermissions[] = [];
  subscriptionMap.forEach((entry) => {
    let cluster: ClusterWithPermissions;
    if (
      entry.subscription.managed &&
      entry.subscription.status !== subscriptionStatuses.DEPROVISIONED &&
      !!entry?.cluster &&
      !isEmpty(entry?.cluster)
    ) {
      // managed cluster, with data from Clusters Service
      cluster = {
        ...normalizeCluster(entry.cluster),
        subscription: entry.subscription,
        // TODO HAC-2355: entry.subscription.metrics is an array but normalizeMetrics wants a single metric
        // @ts-ignore
        metrics: normalizeMetrics(entry.subscription.metrics),
      };
    } else {
      cluster = isAssistedInstallSubscription(entry.subscription)
        ? fakeClusterFromAISubscription(entry.subscription, entry.aiCluster)
        : fakeClusterFromSubscription(entry.subscription);
    }

    // mark this as a clusters service cluster with partial data (happens when CS is down)
    cluster.partialCS = cluster.managed && (!entry?.cluster || isEmpty(entry?.cluster));

    cluster.subscription = entry.subscription;
    result.push(cluster);
  });
  return result;
};
