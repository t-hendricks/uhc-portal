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

  return result;
};

// Normalize data from AMS
const fakeClusterFromSubscription = (subscription) => {
  let planID = subscription.plan.id.toLowerCase();
  if (planID === 'moa') {
    planID = 'rosa';
  }

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

  return {
    subscription_id: subscription.id,
    id: subscription.cluster_id,
    name: subscription.external_cluster_id,
    external_id: subscription.external_cluster_id,
    console: {
      url: subscription.console_url,
    },
    creation_timestamp: subscription.created_at,
    activity_timestamp: subscription.updated_at,
    state: metrics.state,
    openshift_version: metrics.openshift_version,
    product: {
      id: planID,
    },
    managed: false,
    metrics,
  };
};

export default {
  normalizeCluster,
};

export {
  normalizeCluster,
  fakeClusterFromSubscription,
};
