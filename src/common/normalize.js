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

export default {
  normalizeCluster,
};
export {
  normalizeCluster,
};
