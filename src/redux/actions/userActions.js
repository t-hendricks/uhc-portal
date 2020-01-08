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
    response.data.nodeQuota = {
      byoc: {
        singleAz: {},
        multiAz: {},
        available: 0,
      },
      rhInfra: {
        singleAz: {},
        multiAz: {},
        available: 0,
      },
    };

    const items = get(response.data, 'items', []);
    items.forEach((item) => {
      switch (item.resource_type) {
        case 'cluster.aws': {
          const available = item.allowed - item.reserved;
          const category = item.byoc ? 'byoc' : 'rhInfra';
          const zoneType = item.availability_zone_type === 'single' ? 'singleAz' : 'multiAz';
          response.data.nodeQuota[category][zoneType][item.resource_name] = available;
          response.data.nodeQuota[category].available += available;
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
