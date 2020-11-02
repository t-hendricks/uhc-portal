import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService, authorizationsService } from '../../services';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const processClusterQuota = (clustersQuota, item, resources) => {
  const quota = clustersQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const cloudProvider = resource.cloud_provider;
    const infraCategory = resource.byoc === 'rhinfra' ? 'rhInfra' : resource.byoc;
    const availabilityZoneType = resource.availability_zone_type;
    const machineType = resource.resource_name;

    // Since quota can apply to either AWS or GCP, or "any", we compare an exact match or an
    // "any" match. If the quota applies to a specific cloud provider, we add it there. If it
    // applies to "any" cloud provider, we add it to both providers in the quota object.
    // This also applies to BYOC and AZ.
    Object.keys(quota).forEach((provider) => {
      if (cloudProvider === provider || cloudProvider === 'any') {
        Object.keys(quota[provider]).forEach((category) => {
          if (infraCategory === category || infraCategory === 'any') {
            Object.keys(quota[provider][category]).forEach((zoneType) => {
              const categoryQuota = quota[provider][category];
              if (`${availabilityZoneType}Az` === zoneType) {
                categoryQuota[zoneType][machineType] = available;
                categoryQuota[zoneType].available += available;
                categoryQuota.totalAvailable += available;
              }
              // When calculating for any AZ, skip the totalAvailable property
              if (availabilityZoneType === 'any' && zoneType !== 'totalAvailable') {
                categoryQuota[zoneType][machineType] = available;
                categoryQuota[zoneType].available += available;
                // To avoid double-counting, we calculate only half for each of the two AZ's
                categoryQuota.totalAvailable += available / 2;
              }
            });
          }
        });
      }
    });
  });
};

const processNodeQuota = (nodesQuota, item, resources) => {
  const quota = nodesQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const cloudProvider = resource.cloud_provider;
    const infraCategory = resource.byoc === 'rhinfra' ? 'rhInfra' : resource.byoc;
    const machineType = resource.resource_name;

    Object.keys(quota).forEach((provider) => {
      if (cloudProvider === provider || cloudProvider === 'any') {
        Object.keys(quota[provider]).forEach((category) => {
          if (infraCategory === category || infraCategory === 'any') {
            quota[provider][category][machineType] = {
              available,
              cost: resource.cost,
            };
          }
        });
      }
    });
  });
};

const processStorageQuota = (storageQuota, item, resources) => {
  const quota = storageQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const cloudProvider = resource.cloud_provider;

    Object.keys(quota).forEach((provider) => {
      if (cloudProvider === provider || cloudProvider === 'any') {
        quota[provider].available += available;
      }
    });
  });
};

const processLoadBalancerQuota = (loadBalancerQuota, item, resources) => {
  const quota = loadBalancerQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const cloudProvider = resource.cloud_provider;

    Object.keys(quota).forEach((provider) => {
      if (cloudProvider === provider || cloudProvider === 'any') {
        quota[provider].available += available;
      }
    });
  });
};

const processAddOnQuota = (addOnsQuota, item, resources) => {
  const quota = addOnsQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const name = resource.resource_name;

    if (!quota[name]) {
      quota[name] = 0;
    }
    quota[name] += available;
  });
};

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
          byoc: {
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
          byoc: { available: 0 },
          rhInfra: { available: 0 },
        },

        // GCP
        gcp: {
          byoc: { available: 0 },
          rhInfra: { available: 0 },
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

    items.forEach((item) => {
      const resources = get(item, 'related_resources', []);
      if (resources.length < 1) {
        return;
      }

      switch (resources[0].resource_type) {
        case 'cluster':
          // cluster quota: "how many clusters am I allowed to provision?"
          processClusterQuota(allQuotas.clustersQuota, item, resources);
          break;

        case 'compute.node':
          // node quota: "how many extra nodes can I add on top of the base cluster?"
          processNodeQuota(allQuotas.nodesQuota, item, resources);
          break;

        case 'pv.storage':
          // storage quota: "how much persistent storage quota can I set on the cluster?"
          processStorageQuota(allQuotas.storageQuota, item, resources);
          break;

        case 'network.loadbalancer':
          // load balancer quota: "how much load balancer quota can I set on the cluster?"
          processLoadBalancerQuota(allQuotas.loadBalancerQuota, item, resources);
          break;

        case 'add-on':
          // add-on quota: "how many of each add-on can I add on top of the base cluster?"
          processAddOnQuota(allQuotas.addOnsQuota, item, resources);
          break;

        default:
          break;
      }
    });

    // check if any quota available for aws clusters
    allQuotas.clustersQuota.aws.isAvailable = allQuotas.clustersQuota.aws.byoc.totalAvailable > 0
      || allQuotas.clustersQuota.aws.rhInfra.totalAvailable > 0;

    // check if any quota available for gcp clusters
    allQuotas.clustersQuota.gcp.isAvailable = allQuotas.clustersQuota.gcp.byoc.totalAvailable > 0
      || allQuotas.clustersQuota.gcp.rhInfra.totalAvailable > 0;

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

function selfTermsReview() {
  return dispatch => dispatch({
    type: userConstants.SELF_TERMS_REVIEW,
    payload: authorizationsService.selfTermsReview(),
  });
}

const userActions = {
  userInfoResponse,
  getOrganizationAndQuota,
  processClusterQuota,
  processNodeQuota,
  processStorageQuota,
  processLoadBalancerQuota,
  processAddOnQuota,
  selfTermsReview,
};

export {
  userActions,
  userInfoResponse,
  getOrganizationAndQuota,
  selfTermsReview,
};
