import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const getOrganization = () => ({
  payload: accountsService.getCurrentAccount().then((response) => {
    const organizationID = get(response.data, 'organization.id');
    if (organizationID !== undefined) {
      return accountsService.getOrganization(organizationID);
    }
    return Promise.reject(Error('No organization'));
  }),
  type: userConstants.GET_ORGANIZATION,
});

const fetchOrganizationQuota = organiztionID => ({
  type: userConstants.GET_ORG_QUOTA,
  payload: accountsService.getOrganizationQuota(organiztionID).then((response) => {
    /* construct an easy to query structure to figure out how many of each node type
    we have available.
    This is done here to ensure the calculation is done every time we get the quota,
    and that we won't have to replicate it across different components
    which might need to query this data. */
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
      const available = item.allowed - item.reserved;
      const category = item.byoc ? 'byoc' : 'rhInfra';
      const zoneType = item.availability_zone_type === 'single' ? 'singleAz' : 'multiAz';
      response.data.nodeQuota[category][zoneType][item.resource_name] = available;
    });
    return response;
  }),
});

const userActions = {
  userInfoResponse,
  getOrganization,
  fetchOrganizationQuota,
};

export {
  userActions, userInfoResponse, getOrganization, fetchOrganizationQuota,
};
