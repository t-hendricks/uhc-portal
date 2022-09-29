import produce from 'immer';
import get from 'lodash/get';

import { OCM } from 'openshift-assisted-ui-lib';

import { versionComparator } from './versionComparator';
import { normalizedProducts, clustersServiceProducts } from './subscriptionTypes';
import { isAISubscriptionWithoutMetrics } from './isAssistedInstallerCluster';

const {
  getClustervCPUCount: getAICluterCPUCount,
  getClusterMemoryAmount: getAIMemoryAmount,
  getMasterCount: getAICMasterCount,
  getWorkerCount: getAICWorkerCount,
} = OCM;

/**
 * Erases the differences between clusters-service products and account-manager plans
 * which use related but different values (see https://issues.redhat.com/browse/SDB-1625).
 * @param {string} id - one of cluster.product.id, subscription.plan.type,
 *   subscription.plan.id, quota_cost.related_resources[].product (including "any").
 * @returns {string} one of subscriptionTypes.normalizedProducts consts.
 */
const normalizeProductID = (id) => {
  const map = {
    OCP: normalizedProducts.OCP,
    OSD: normalizedProducts.OSD,
    OSDTRIAL: normalizedProducts.OSDTrial,
    RHMI: normalizedProducts.RHMI,
    MOA: normalizedProducts.ROSA,
    ROSA: normalizedProducts.ROSA,
    ARO: normalizedProducts.ARO,
    OCP_ASSISTEDINSTALL: normalizedProducts.OCP_Assisted_Install,
    ANY: normalizedProducts.ANY, // used by account-manager in quota_cost
  };
  if (typeof id !== 'string') {
    return normalizedProducts.UNKNOWN;
  }
  return map[id.toUpperCase().replace('-', '_')] || normalizedProducts.UNKNOWN;
};

const emptyMetrics = {
  memory: {
    used: {
      value: 0,
      unit: 'B',
    },
    total: {
      value: 0,
      unit: 'B',
    },
  },
  cpu: {
    used: {
      value: 0,
      unit: '',
    },
    total: {
      value: 0,
      unit: '',
    },
  },
  storage: {
    used: {
      value: 0,
      unit: 'B',
    },
    total: {
      value: 0,
      unit: 'B',
    },
  },
  nodes: {
    total: 0,
    master: 0,
    compute: 0,
  },
  state: 'N/A',
  upgrade: {
    available: false,
  },
};

const normalizeMetrics = (metrics) => {
  const ret = metrics ? { ...emptyMetrics, ...metrics } : { ...emptyMetrics };
  const subFields = ['memory', 'storage', 'cpu', 'nodes'];
  const consumptionFields = ['memory', 'storage', 'cpu']; // fields with total+used
  subFields.forEach((field) => {
    ret[field] = { ...emptyMetrics[field], ...ret[field] };
    if (consumptionFields.includes(field)) {
      const recievedTotal = ret[field]?.total || {};
      const recievedUsed = ret[field]?.used || {};
      ret[field].total = { ...emptyMetrics[field].total, ...recievedTotal };
      ret[field].used = { ...emptyMetrics[field].used, ...recievedUsed };
    }
  });
  return ret;
};

const normalizeCluster = (cluster) => {
  const result = { ...cluster };

  result.product = {
    // Omit other properties like "href", we only use the id anyway.
    id: normalizeProductID(cluster.product.id),
  };

  // make sure available_upgrades are sorted
  if (cluster.version && cluster.version.available_upgrades) {
    result.version.available_upgrades.sort(versionComparator);
  }
  return result;
};

// Normalize data from AMS for an unmanaged cluster.
const fakeClusterFromSubscription = (subscription) => {
  const metric = subscription.metrics?.[0];
  const metrics = normalizeMetrics(metric);

  // Omitting some fields that real data from clusters-service does have, but we won't use.
  const cluster = {
    subscription_id: subscription.id,
    id: subscription.cluster_id,
    external_id: subscription.external_cluster_id,
    console: {
      url: subscription.console_url,
    },
    creation_timestamp: subscription.created_at,
    activity_timestamp: metric ? metric.query_timestamp : subscription.last_telemetry_date,
    state: metrics.state,
    openshift_version: metrics.openshift_version,
    product: {
      // Omit other properties like "href", we only use the id anyway.
      id: normalizeProductID(subscription.plan.id),
      type: normalizeProductID(subscription.plan.type),
    },
    managed: clustersServiceProducts.includes(normalizeProductID(subscription.plan.type)),
    ccs: {
      enabled: false,
    },
    metrics,
  };
  const cloudProvider = subscription.cloud_provider_id;
  if (cloudProvider) {
    cluster.cloud_provider = {
      id: cloudProvider.toLowerCase(),
    };
  }
  const regionId = subscription.region_id;
  if (regionId) {
    cluster.region = {
      id: regionId.toLowerCase(),
    };
  }

  return cluster;
};

const fakeAIClusterFromSubscription = (subscription, aiCluster) => {
  const cluster = fakeClusterFromSubscription(subscription);
  if (isAISubscriptionWithoutMetrics(subscription)) {
    // Enrich for AI Cluster data instead.
    const clusterWorkers = aiCluster ? getAICWorkerCount(aiCluster.hosts) : 0;
    const clusterMasters = aiCluster ? getAICMasterCount(aiCluster.hosts) : 0;

    cluster.metrics.memory.total.value = aiCluster ? getAIMemoryAmount(aiCluster) : 0;
    cluster.metrics.cpu.total.value = aiCluster ? getAICluterCPUCount(aiCluster) : 0;
    cluster.metrics.nodes.total = clusterWorkers + clusterMasters;
    cluster.metrics.nodes.master = clusterMasters;
    cluster.metrics.nodes.compute = clusterWorkers;
    cluster.metrics.openshift_version =
      cluster.metrics.openshift_version || (aiCluster ? aiCluster.openshift_version : 'N/A');
    cluster.metrics.state = aiCluster?.status || 'N/A';

    cluster.state = cluster.metrics.state;
    cluster.openshift_version = cluster.metrics.openshift_version;
  }

  return cluster;
};

const normalizeSubscription = (subscription) => ({
  ...subscription,
  plan: {
    // Omit other properties like "href", we only use the id and type
    id: normalizeProductID(subscription.plan.id),
    type: normalizeProductID(subscription.plan.type),
  },
});

/**
 * Normalize a single element of QuotaCostList (which may contain multiple related_resources).
 * @param {Object} quotaCost - a QuotaCost.
g */
const normalizeQuotaCost = (quotaCost) => ({
  ...quotaCost,
  related_resources: get(quotaCost, 'related_resources', []).map((resource) => ({
    ...resource,
    product: normalizeProductID(resource.product),
  })),
});

/**
 * Applies a function to each item in .data.items.
 * @param response {Object} result of successful Axios promise containing a collection.
 *   .data is where Axios puts the parsed JSON body, and this function is applicable
 *   to responses like ClusterList that contain an .items array.
 */
const mapListResponse = (response, itemFunc) =>
  produce(response, (draft) => {
    draft.data.items = draft.data.items.map(itemFunc);
  });

export {
  normalizeProductID,
  normalizeCluster,
  fakeClusterFromSubscription,
  fakeAIClusterFromSubscription,
  normalizeSubscription,
  normalizeQuotaCost,
  mapListResponse,
  normalizeMetrics,
};
