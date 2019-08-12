import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const fetchQuota = organiztionID => accountsService.getOrganizationQuota(organiztionID).then(
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
