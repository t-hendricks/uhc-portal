// Fragments of processed quota objects

const rhInfraClusterQuota = {
  clustersQuota: {
    aws: {
      rhInfra: {
        multiAz: {
          'mem.small': 5,
        },
        singleAz: {
          'mem.small': 0,
        },
      },
    },
  },
};

const awsCCSClustersWithNodesQuota = {
  clustersQuota: {
    aws: {
      rhInfra: {
        singleAz: { available: 0 },
        multiAz: { available: 0 },
        totalAvailable: 0,
      },
      byoc: {
        singleAz: { available: 0 },
        multiAz: {
          'mem.small': 5,
          available: 5,
        },
        totalAvailable: 5,
      },
    },
  },
  nodesQuota: {
    aws: {
      byoc: {
        'mem.small': {
          available: 12,
          cost: 4,
        },
      },
    },
  },
};

const awsCCSClustersWithSingleNodeQuota = {
  clustersQuota: {
    aws: {
      rhInfra: {
        singleAz: { available: 0 },
        multiAz: { available: 0 },
        totalAvailable: 0,
      },
      byoc: {
        singleAz: { available: 0 },
        multiAz: {
          'mem.small': 5,
          available: 5,
        },
        totalAvailable: 5,
      },
    },
  },
  nodesQuota: {
    aws: {
      byoc: {
        'mem.small': {
          available: 4,
          cost: 4,
        },
      },
    },
  },
};

const awsByocRhInfraGcpRhInfraClustersQuota = {
  hasOsdQuota: true,
  hasAwsQuota: true,
  hasGcpQuota: true,
  aws: {
    byoc: {
      singleAz: { available: 5 },
      multiAz: { available: 5 },
      totalAvailable: 10,
    },
    rhInfra: {
      singleAz: { available: 5 },
      multiAz: { available: 5 },
      totalAvailable: 10,
    },
  },
  gcp: {
    rhInfra: {
      singleAz: { available: 5 },
      multiAz: { available: 5 },
      totalAvailable: 10,
    },
  },
};

const awsRhInfraGcpRhInfraClustersQuota = {
  hasOsdQuota: true,
  hasAwsQuota: true,
  hasGcpQuota: true,
  aws: {
    byoc: {
      multiAz: { available: 0 },
      singleAz: { available: 0 },
      hasQuota: false,
      totalAvailable: 0,
    },
    rhInfra: {
      hasQuota: true,
      multiAz: { available: 1 },
      singleAz: { available: 1 },
      totalAvailable: 1,
    },
  },
  gcp: {
    rhInfra: {
      hasQuota: true,
      multiAz: { available: 1 },
      singleAz: { available: 1 },
      totalAvailable: 1,
    },
  },
};

export {
  rhInfraClusterQuota,
  awsCCSClustersWithNodesQuota,
  awsCCSClustersWithSingleNodeQuota,
  awsByocRhInfraGcpRhInfraClustersQuota,
  awsRhInfraGcpRhInfraClustersQuota,
};
