import produce from 'immer';
import get from 'lodash/get';

import { versionComparator } from './versionComparator';
import { normalizedProducts } from './subscriptionTypes';

/**
 * Erases the differences between clusters-service products and account-manager plans
 * which use related but different values (see https://issues.redhat.com/browse/SDB-1625).
 * @param {string} id - one of cluster.product.id, subscription.plan.id,
 *   quota_cost.related_resources[].product (including "any").
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
    ANY: normalizedProducts.ANY, // used by account-manager in quota_cost
  };
  if (typeof id !== 'string') {
    return normalizedProducts.UNKNOWN;
  }
  return map[id.toUpperCase()] || normalizedProducts.UNKNOWN;
};

const normalizeCluster = (cluster) => {
  const result = { ...cluster };

  // Convert data from older backend
  // See https://gitlab.cee.redhat.com/service/uhc-clusters-service/merge_requests/1175
  if (!result.metrics.upgrade) {
    result.metrics.upgrade = {};
    if (result.metrics.version_update_available) {
      result.metrics.upgrade.available = result.metrics.version_update_available;
    }
  }

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
  const metrics = subscription.metrics?.[0] || emptyMetrics;

  // Omitting some fields that real data from clusters-service does have, but we won't use.
  const cluster = {
    subscription_id: subscription.id,
    id: subscription.cluster_id,
    external_id: subscription.external_cluster_id,
    console: {
      url: subscription.console_url,
    },
    creation_timestamp: subscription.created_at,
    activity_timestamp: subscription.updated_at,
    state: metrics.state,
    openshift_version: metrics.openshift_version,
    product: {
      // Omit other properties like "href", we only use the id anyway.
      id: normalizeProductID(subscription.plan.id),
    },
    managed: false,
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

const normalizeSubscription = subscription => (
  {
    ...subscription,
    plan: {
      // Omit other properties like "href", we only use the id anyway.
      id: normalizeProductID(subscription.plan.id),
    },
  }
);

/**
 * Normalize a single element of QuotaCostList (which may contain multiple related_resources).
 * @param {Object} quotaCost - a QuotaCost.
g */
const normalizeQuotaCost = quotaCost => (
  {
    ...quotaCost,
    related_resources: get(quotaCost, 'related_resources', []).map(resource => (
      {
        ...resource,
        product: normalizeProductID(resource.product),
      }
    )),
  }
);

/**
 * Applies a function to each item in .data.items.
 * @param response {Object} result of successful Axios promise containing a collection.
 *   .data is where Axios puts the parsed JSON body, and this function is applicable
 *   to responses like ClusterList that contain an .items array.
 */
const mapListResponse = (response, itemFunc) => (
  produce(response, (draft) => {
    draft.data.items = draft.data.items.map(itemFunc);
  })
);

export {
  normalizeProductID,
  normalizeCluster,
  fakeClusterFromSubscription,
  normalizeSubscription,
  normalizeQuotaCost,
  mapListResponse,
};
