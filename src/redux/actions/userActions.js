import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const fetchQuota = organizationID => accountsService.getOrganizationQuota(organizationID).then(
  (response) => {
    /* construct an easy to query structure to figure out how many of each resource types
      we have available.
      This is done here to ensure the calculation is done every time we get the quota,
      and that we won't have to replicate it across different components
      which might need to query this data. */
    const allQuotas = {
      // Cluster quota
      clustersQuota: {
        // AWS
        aws: {
          byoc: {
            singleAz: { available: 0 },
            multiAz: { available: 0 },
            totalAvailable: 0,
          },
          rhInfra: {
            singleAz: { available: 0 },
            multiAz: { available: 0 },
            totalAvailable: 0,
          },
          isAvailable: false,
        },

        // GCP
        gcp: {
          rhInfra: {
            singleAz: { available: 0 },
            multiAz: { available: 0 },
            totalAvailable: 0,
          },
          isAvailable: false,
        },
      },

      // Node quota
      nodesQuota: {
        // AWS
        aws: {
          byoc: {
            singleAz: {},
            multiAz: {},
          },
          rhInfra: {
            singleAz: {},
            multiAz: {},
          },
        },

        // GCP
        gcp: {
          rhInfra: {
            singleAz: {},
            multiAz: {},
          },
        },
      },

      // Storage
      storageQuota: {
        aws: { available: 0 },
        gcp: { available: 0 },
      },

      // Load balancers
      loadBalancerQuota: {
        aws: { available: 0 },
        gcp: { available: 0 },
      },

      // Add ons
      addOnsQuota: {},
    };

    const items = get(response.data, 'items', []);

    const processNodeQuota = (item, provider) => {
      const available = item.allowed - item.reserved;
      const category = item.byoc ? 'byoc' : 'rhInfra';
      allQuotas.nodesQuota[provider][category][item.resource_name] = available;
    };

    const processClusterQuota = (item, provider) => {
      const available = item.allowed - item.reserved;
      const category = item.byoc ? 'byoc' : 'rhInfra';
      const zoneType = item.availability_zone_type === 'single' ? 'singleAz' : 'multiAz';

      allQuotas.clustersQuota[provider][category][zoneType][item.resource_name] = available;
      allQuotas.clustersQuota[provider][category][zoneType].available += available;
      allQuotas.clustersQuota[provider][category].totalAvailable += available;
    };

    items.forEach((item) => {
      const provider = item.resource_type && item.resource_type.split('.').pop();
      switch (item.resource_type) {
        // AWS
        case 'cluster.gcp':
        case 'cluster.aws':
          // cluster quota: "how many clusters am I allowed to provision?"
          processClusterQuota(item, provider);
          break;

        case 'compute.node.gcp':
        case 'compute.node.aws':
          // node quota: "how many extra nodes can I add on top of the base cluster?"
          processNodeQuota(item, provider);
          break;

        case 'pv.storage.aws':
        case 'pv.storage.gcp':
          // Create a map of storage quota.
          allQuotas.storageQuota[provider].available += (item.allowed - item.reserved);
          break;

        case 'network.loadbalancer.aws':
        case 'network-gcp.loadbalancer.gcp':
          allQuotas.loadBalancerQuota[provider].available += (item.allowed - item.reserved);
          break;

        // ADDONS
        case 'addon':
          if (!allQuotas.addOnsQuota[item.resource_name]) {
            allQuotas.addOnsQuota[item.resource_name] = 0;
          }
          // Accumulate all available quota per resource name
          allQuotas.addOnsQuota[item.resource_name] += item.allowed - item.reserved;
          break;

        default:
          break;
      }
    });

    // check if any quota available for aws clusters
    allQuotas.clustersQuota.aws.isAvailable = !!(allQuotas.clustersQuota.aws.byoc.totalAvailable
     || allQuotas.clustersQuota.aws.rhInfra.totalAvailable);

    // check if any quota available for gcp clusters
    allQuotas.clustersQuota.gcp.isAvailable = !!allQuotas.clustersQuota.gcp.rhInfra.totalAvailable;

    return allQuotas;
  },
);


const getOrganizationAndQuota = () => ({
  payload: accountsService.getCurrentAccount().then((response) => {
    const organizationID = get(response.data, 'organization.id');
    if (organizationID !== undefined) {
      const ret = {
        quota: undefined,
        organization: undefined,
      };
      const promises = [
        fetchQuota(organizationID).then((quota) => { ret.quota = quota; }),
        accountsService.getOrganization(organizationID).then(
          (organization) => { ret.organization = organization; },
        ),
      ];
      return Promise.all(promises).then(() => ret);
    }
    return Promise.reject(Error('No organization'));
  }),
  type: userConstants.GET_ORGANIZATION,
});

const userActions = {
  userInfoResponse,
  getOrganizationAndQuota,
};

export {
  userActions, userInfoResponse, getOrganizationAndQuota,
};
