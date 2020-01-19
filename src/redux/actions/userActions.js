import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const fetchQuota = organizationID => accountsService.getOrganizationQuota(organizationID).then(
  (response) => {
    /* construct an easy to query structure to figure out how many of each node type
      we have available.
      This is done here to ensure the calculation is done every time we get the quota,
      and that we won't have to replicate it across different components
      which might need to query this data. */
    response.data.clusterQuota = {
      byoc: {
        singleAz: {
          available: 0,
        },
        multiAz: {
          available: 0,
        },
        available: 0,
      },
      rhInfra: {
        singleAz: {
          available: 0,
        },
        multiAz: {
          available: 0,
        },
        available: 0,
      },
    };
    response.data.nodeQuota = {
      byoc: {
        singleAz: {},
        multiAz: {},
      },
      rhInfra: {
        singleAz: {},
        multiAz: {},
      },
    };

    const items = get(response.data, 'items', []);
    items.forEach((item) => {
      switch (item.resource_type) {
        case 'cluster.aws': {
          // cluster quota: "how many clusters am I allowed to provision?"
          const available = item.allowed - item.reserved;
          const category = item.byoc ? 'byoc' : 'rhInfra';
          const zoneType = item.availability_zone_type === 'single' ? 'singleAz' : 'multiAz';

          response.data.clusterQuota[category][zoneType][item.resource_name] = available;
          response.data.clusterQuota[category][zoneType].available += available;
          response.data.clusterQuota[category].available += available;
          break;
        }
        case 'compute.node.aws': {
          // node quota: "how many extra nodes can I add on top of the base cluster?"
          const available = item.allowed - item.reserved;
          const category = item.byoc ? 'byoc' : 'rhInfra';
          const zoneType = item.availability_zone_type === 'single' ? 'singleAz' : 'multiAz';
          response.data.nodeQuota[category][zoneType][item.resource_name] = available;
          break;
        }
        case 'addon':
          // Create a map of add-on resource names to track available quota
          if (!response.data.addOnsQuota) {
            response.data.addOnsQuota = {};
          }
          if (!response.data.addOnsQuota[item.resource_name]) {
            response.data.addOnsQuota[item.resource_name] = 0;
          }
          // Accumulate all available quota per resource name
          response.data.addOnsQuota[item.resource_name] += item.allowed - item.reserved;
          break;
        case 'pv.storage.aws':
          // Create a map of storage quota.
          if (!response.data.persistentStorageQuota) {
            response.data.persistentStorageQuota = 0;
          }
          response.data.persistentStorageQuota += (item.allowed - item.reserved);
          break;
        case 'network.loadbalancer.aws':
          if (!response.data.loadBalancerQuota) {
            response.data.loadBalancerQuota = 0;
          }
          response.data.loadBalancerQuota += (item.allowed - item.reserved);
          break;
        default:
          break;
      }
    });
    return response;
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
