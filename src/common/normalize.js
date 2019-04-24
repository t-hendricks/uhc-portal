const normalizeCluster = (cluster) => {
  const result = Object.assign({}, cluster);
  // Convert data from older backend, to new shape with .metrics sub-object.  See
  // https://gitlab.cee.redhat.com/service/uhc-clusters-service/merge_requests/800
  if (!result.metrics) {
    result.metrics = {
      cpu: cluster.cpu,
      memory: cluster.memory,
      storage: cluster.storage,
      nodes: {
        // total: undefined,
        // master: undefined,
        // compute: undefined,
      },
    };
  }
  return result;
};

export default {
  normalizeCluster,
};
export {
  normalizeCluster,
};
