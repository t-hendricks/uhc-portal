import { userActions } from '../../../../redux/actions/userActions';

import * as quotaCostFixtures from './quota_cost.fixtures';

// Fragments of processed quotaList state

const crcWorkspacesAddonQuota = userActions.processQuota({
  data: { items: quotaCostFixtures.crcWorkspacesAddon },
});

const loggingAddonQuota = userActions.processQuota({
  data: { items: quotaCostFixtures.loggingAddon },
});

const dbaAddonQuota = userActions.processQuota({
  data: { items: quotaCostFixtures.dbaAddon },
});

const serviceMeshAddonQuota = userActions.processQuota({
  data: { items: quotaCostFixtures.serviceMeshAddon },
});

const addonsQuota = userActions.processQuota({
  data: {
    items: [].concat(
      quotaCostFixtures.crcWorkspacesAddon,
      quotaCostFixtures.loggingAddon,
      quotaCostFixtures.dbaAddon,
      quotaCostFixtures.serviceMeshAddon,
    ),
  },
});

const rhInfraClusterQuota = {
  clustersQuota: {
    standard: {
      OSD: {
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
    },
  },
};

const awsCCSClustersWithNodesQuota = {
  clustersQuota: {
    standard: {
      OSD: {
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
    },
  },
  nodesQuota: {
    standard: {
      OSD: {
        aws: {
          byoc: {
            'mem.small': {
              available: 12,
              cost: 4,
            },
          },
        },
      },
    },
  },
};

const awsCCSClustersWithSingleNodeQuota = {
  clustersQuota: {
    standard: {
      OSD: {
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
    },
  },
  nodesQuota: {
    standard: {
      OSD: {
        aws: {
          byoc: {
            'mem.small': {
              available: 4,
              cost: 4,
            },
          },
        },
      },
    },
  },
};

// Values for `clustersQuota` prop passed down by CreateOSDPage.

const awsByocRhInfraGcpRhInfraClustersQuota = {
  hasProductQuota: true,
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
  hasMarketplaceProductQuota: false,
};

const awsRhInfraGcpRhInfraClustersQuota = {
  hasProductQuota: true,
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
  hasMarketplaceProductQuota: false,
};

export {
  rhInfraClusterQuota,
  awsCCSClustersWithNodesQuota,
  awsCCSClustersWithSingleNodeQuota,
  awsByocRhInfraGcpRhInfraClustersQuota,
  awsRhInfraGcpRhInfraClustersQuota,
  crcWorkspacesAddonQuota,
  loggingAddonQuota,
  dbaAddonQuota,
  serviceMeshAddonQuota,
  addonsQuota,
};
