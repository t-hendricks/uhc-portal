import get from 'lodash/get';

import { userConstants } from '../constants';
import { accountsService, authorizationsService } from '../../services';
import { normalizeQuotaCost } from '../../common/normalize';
import { knownProducts, normalizedProducts, billingModels } from '../../common/subscriptionTypes';

const userInfoResponse = payload => ({
  payload,
  type: userConstants.USER_INFO_RESPONSE,
});

const availableByCost = (item, resource) => {
  if (resource.cost === 0) {
    return Infinity;
  }
  // If you're able to create half a node, you're still in "not enough quota" situation.
  return Math.floor((item.allowed - item.consumed) / resource.cost);
};

const processClusterQuota = (clustersQuota, item, resources) => {
  const quota = clustersQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const {
      availability_zone_type: availabilityZoneType,
      cloud_provider: cloudProvider,
      resource_name: machineType,
      product: quotaProduct,
      billing_model: quotaBilling = 'standard',
    } = resource;
    const infraCategory = resource.byoc === 'rhinfra' ? 'rhInfra' : resource.byoc;

    // TODO: Honor cost field, specifically cost=0.
    // TODO: Split data structure by product (https://issues.redhat.com/browse/SDA-3231).
    //       Until then, ignore ROSA to avoid collision with OSD CCS.
    if (quotaProduct === normalizedProducts.ROSA) {
      return;
    }

    /* eslint-disable no-param-reassign */
    // Since quota can apply to either AWS or GCP, or "any", we compare an exact match or an
    // "any" match. If the quota applies to a specific cloud provider, we add it there. If it
    // applies to "any" cloud provider, we add it to both providers in the quota object.
    // This also applies to BYOC and AZ.
    Object.entries(quota).forEach(([billing, billingQuota]) => {
      if (quotaBilling === billing || quotaBilling === 'any') {
        Object.entries(billingQuota).forEach(([product, productQuota]) => {
          if (quotaProduct === product || quotaProduct === normalizedProducts.ANY) {
            Object.entries(productQuota).forEach(([provider, providerQuota]) => {
              if (cloudProvider === provider || cloudProvider === 'any') {
                Object.entries(providerQuota).forEach(([category, categoryQuota]) => {
                  if (infraCategory === category || infraCategory === 'any') {
                    Object.entries(categoryQuota).forEach(([zoneType, zoneQuota]) => {
                      if (`${availabilityZoneType}Az` === zoneType) {
                        zoneQuota[machineType] = available;
                        zoneQuota.available += available;
                        categoryQuota.totalAvailable += available;
                      }
                      // When calculating for any AZ, skip the totalAvailable property
                      if (availabilityZoneType === 'any' && zoneType !== 'totalAvailable') {
                        zoneQuota[machineType] = available;
                        zoneQuota.available += available;
                        // To avoid double-counting, we calculate only half for each of the two AZ's
                        categoryQuota.totalAvailable += available / 2;
                      }

                      if (categoryQuota.totalAvailable > 0) {
                        providerQuota.isAvailable = true;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    /* eslint-enable no-param-reassign */
  });
};

const processNodeQuota = (nodesQuota, item, resources) => {
  const quota = nodesQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const {
      cloud_provider: cloudProvider,
      resource_name: machineType,
      product: quotaProduct,
      billing_model: quotaBilling = 'standard',
    } = resource;
    const infraCategory = resource.byoc === 'rhinfra' ? 'rhInfra' : resource.byoc;

    // TODO: split data structure by product (https://issues.redhat.com/browse/SDA-3231).
    //       Until then, ignore ROSA to avoid collision with OSD CCS.
    if (quotaProduct === normalizedProducts.ROSA) {
      return;
    }

    /* eslint-disable no-param-reassign */
    Object.entries(quota).forEach(([billing, billingQuota]) => {
      if (quotaBilling === billing || quotaBilling === 'any') {
        Object.entries(billingQuota).forEach(([product, productQuota]) => {
          if (quotaProduct === product || quotaProduct === normalizedProducts.ANY) {
            Object.entries(productQuota).forEach(([provider, providerQuota]) => {
              if (cloudProvider === provider || cloudProvider === 'any') {
                Object.entries(providerQuota).forEach(([category, categoryQuota]) => {
                  if (infraCategory === category || infraCategory === 'any') {
                    categoryQuota[machineType] = {
                      available,
                      cost: resource.cost,
                    };
                  }
                });
              }
            });
          }
        });
      }
    });
    /* eslint-enable no-param-reassign */
  });
};

// TODO: Split the other data structures by product (https://issues.redhat.com/browse/SDA-3231).
//    Or replace the whole thing with generic query mechanism treating all types symmetrically.

const processStorageQuota = (storageQuota, item, resources) => {
  const quota = storageQuota;
  resources.forEach((resource) => {
    const available = availableByCost(item, resource);
    const {
      availability_zone_type: availabilityZoneType,
      cloud_provider: cloudProvider,
      resource_name: resourceName,
      product: quotaProduct,
      billing_model: quotaBilling = 'standard',
    } = resource;
    const infraCategory = resource.byoc === 'rhinfra' ? 'rhInfra' : resource.byoc;
    /* eslint-disable no-param-reassign */
    Object.entries(quota).forEach(([billing, billingQuota]) => {
      if (quotaBilling === billing || quotaBilling === 'any') {
        Object.entries(billingQuota).forEach(([product, productQuota]) => {
          if (quotaProduct === product || quotaProduct === normalizedProducts.ANY) {
            Object.entries(productQuota).forEach(([provider, providerQuota]) => {
              if (cloudProvider === provider || cloudProvider === 'any') {
                Object.entries(providerQuota).forEach(([category, categoryQuota]) => {
                  if (infraCategory === category || infraCategory === 'any') {
                    Object.entries(categoryQuota).forEach(([zoneType, zoneQuota]) => {
                      if (`${availabilityZoneType}AZ` === zoneType || availabilityZoneType === 'any') {
                        zoneQuota[resourceName] = available;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    /* eslint-enable no-param-reassign */
  });
};

const processLoadBalancerQuota = (loadBalancerQuota, item, resources) => {
  const quota = loadBalancerQuota;
  const available = item.allowed - item.consumed;

  resources.forEach((resource) => {
    const cloudProvider = resource.cloud_provider;

    /* eslint-disable no-param-reassign */
    Object.entries(quota).forEach(([provider, providerQuota]) => {
      if (cloudProvider === provider || cloudProvider === 'any') {
        providerQuota.available += available;
      }
    });
    /* eslint-enable no-param-reassign */
  });
};

const processAddOnQuota = (addOnsQuota, item, resources) => {
  const quota = addOnsQuota;

  resources.forEach((resource) => {
    const available = availableByCost(item, resource);
    // quota_cost data may include addons you never had quota for (which we won't even show),
    // and addons with allowed > 0 but all already used up (these we'll show disabled).
    if (item.allowed === 0 && resource.cost > 0) {
      return;
    }

    const {
      availability_zone_type: availabilityZoneType,
      cloud_provider: cloudProvider,
      resource_name: resourceName,
      product: quotaProduct,
      billing_model: quotaBilling = 'standard',
    } = resource;
    const infraCategory = resource.byoc === 'rhinfra' ? 'rhInfra' : resource.byoc;

    /* eslint-disable no-param-reassign */
    Object.entries(quota).forEach(([billing, billingQuota]) => {
      if (quotaBilling === billing || quotaBilling === 'any') {
        Object.entries(billingQuota).forEach(([product, productQuota]) => {
          if (quotaProduct === product || quotaProduct === normalizedProducts.ANY) {
            Object.entries(productQuota).forEach(([provider, providerQuota]) => {
              if (cloudProvider === provider || cloudProvider === 'any') {
                Object.entries(providerQuota).forEach(([category, categoryQuota]) => {
                  if (infraCategory === category || infraCategory === 'any') {
                    Object.entries(categoryQuota).forEach(([zoneType, zoneQuota]) => {
                      if (`${availabilityZoneType}Az` === zoneType) {
                        zoneQuota[resourceName] = available;
                        zoneQuota.available += available;
                        categoryQuota.totalAvailable += available;
                      }
                      // When calculating for any AZ, skip the totalAvailable property
                      if (availabilityZoneType === 'any' && zoneType !== 'totalAvailable') {
                        zoneQuota[resourceName] = available;
                        zoneQuota.available += available;
                        // To avoid double-counting, we calculate only half for each of the two AZ's
                        categoryQuota.totalAvailable += available / 2;
                      }

                      if (categoryQuota.totalAvailable > 0) {
                        providerQuota.isAvailable = true;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    /* eslint-enable no-param-reassign */
  });
};

/**
 * Constructs a blank quota data structure (extracted for tests).
 */
const emptyQuota = () => {
  const clustersQuotaByAz = () => ({
    singleAz: { available: 0 },
    multiAz: { available: 0 },
    totalAvailable: 0,
  });
  const clustersQuotaByInfraAz = () => ({
    byoc: clustersQuotaByAz(),
    rhInfra: clustersQuotaByAz(),
    isAvailable: false,
  });
  const clustersQuotaByProviderInfraAz = () => ({
    aws: clustersQuotaByInfraAz(),
    gcp: clustersQuotaByInfraAz(),
  });
  const clustersQuotaByProductProviderInfraAz = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = clustersQuotaByProviderInfraAz();
    });
    return result;
  };
  const clustersQuotaByBillingProductProviderInfraAz = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = clustersQuotaByProductProviderInfraAz();
    });
    return result;
  };

  const nodesQuotaByInfra = () => ({
    byoc: { available: 0 },
    rhInfra: { available: 0 },
  });
  const nodesQuotaByProviderInfra = () => ({
    aws: nodesQuotaByInfra(),
    gcp: nodesQuotaByInfra(),
  });
  const nodesQuotaByProductProviderInfra = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = nodesQuotaByProviderInfra();
    });
    return result;
  };
  const nodesQuotaByBillingProductProviderInfra = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = nodesQuotaByProductProviderInfra();
    });
    return result;
  };

  const storageQuotaByAZ = () => ({
    singleAZ: { available: 0 },
    multiAZ: { available: 0 },
  });

  const storageQuotaByInfraAZ = () => ({
    byoc: storageQuotaByAZ(),
    rhInfra: storageQuotaByAZ(),
    isAvailable: false,
  });

  const storageQuotaByProviderInfraAZ = () => ({
    aws: storageQuotaByInfraAZ(),
    gcp: storageQuotaByInfraAZ(),
  });

  const storageQuotaByProductProviderInfraAZ = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = storageQuotaByProviderInfraAZ();
    });
    return result;
  };

  // Initialize an empty tree for storage quota.
  // To be populated at processStorageQuota.
  // the tree levels are:
  // billing model -> products -> cloud-provider -> infra (byoc, rhinfra) -> multi / single az.
  const storageQuotaByBillingProductProviderInfraAZ = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = storageQuotaByProductProviderInfraAZ();
    });
    return result;
  };

  const loadBalancerQuotaByProvider = () => ({
    aws: { available: 0 },
    gcp: { available: 0 },
  });

  const addOnsQuotaByAz = () => ({
    singleAz: { available: 0 },
    multiAz: { available: 0 },
    totalAvailable: 0,
  });
  const addOnsQuotaByInfraAz = () => ({
    byoc: addOnsQuotaByAz(),
    rhInfra: addOnsQuotaByAz(),
    isAvailable: false,
  });
  const addOnsQuotaByProviderInfraAz = () => ({
    aws: addOnsQuotaByInfraAz(),
    gcp: addOnsQuotaByInfraAz(),
  });
  const addOnsQuotaByProductProviderInfraAz = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = addOnsQuotaByProviderInfraAz();
    });
    return result;
  };
  const addOnsQuotaByBillingProductProviderInfraAz = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = addOnsQuotaByProductProviderInfraAz();
    });
    return result;
  };

  return {
    clustersQuota: clustersQuotaByBillingProductProviderInfraAz(),
    nodesQuota: nodesQuotaByBillingProductProviderInfra(),
    storageQuota: storageQuotaByBillingProductProviderInfraAZ(),
    loadBalancerQuota: loadBalancerQuotaByProvider(),
    addOnsQuota: addOnsQuotaByBillingProductProviderInfraAz(),
  };
};

/**
 * Normalize incoming quota and construct an easy to query structure to figure
 * out how many of each resource types we have available.
 * This is done here to ensure the calculation is done every time we get the quota,
 * and that we won't have to replicate it across different components
 * which might need to query this data.
 */
const processQuota = (response) => {
  const allQuotas = emptyQuota();
  const items = get(response.data, 'items', []);
  items.forEach((rawItem) => {
    const item = normalizeQuotaCost(rawItem);

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

  return allQuotas;
};

const fetchQuota = organizationID => (
  accountsService.getOrganizationQuota(organizationID).then(processQuota)
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
  emptyQuota,
  processQuota,
  selfTermsReview,
};

export {
  userActions,
  userInfoResponse,
  getOrganizationAndQuota,
  selfTermsReview,
};
