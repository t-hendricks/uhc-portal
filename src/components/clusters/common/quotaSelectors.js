import get from 'lodash/get';

import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';
import { BillingModel } from '~/types/clusters_mgmt.v1';

/**
 * Known quota resourceType values.
 */
const quotaTypes = {
  ADD_ON: 'add-on',
  CLUSTER: 'cluster',
  NODE: 'compute.node',
  LOAD_BALANCER: 'network.loadbalancer',
  STORAGE: 'pv.storage',
};

// Used for matching any in various fields of quota cost related resources
const any = 'any';

/**
 * Compares two values, allowing 'any' on either side.
 */
const match = (a, b) => a === b || a === any || b === any;

/**
 * Compares two values, case-insensitively, allowing 'any' on either side.
 * (covers rhinfra vs rhInfra, any vs ANY)
 */
const matchCaseInsensitively = (a, b) => match(a.toLowerCase(), b.toLowerCase());

/**
 * Performs an explicit mapping from a given billingModel to the billingModel which should be used to check quotas for
 */
const getBillingQuotaModel = (model) => {
  switch (model) {
    case BillingModel.MARKETPLACE_AWS:
      return billingModels.MARKETPLACE;
    default:
      return model;
  }
};

/**
 * Returns true if a QuotaCost.related_resources item matches given constraints.
 * query should consist of same fields as the resource; omitted fields are treated as 'any'.
 */
const relatedResourceMatches = (resource, query) =>
  match(resource.resource_type, query.resource_type || any) &&
  matchCaseInsensitively(resource.product, query.product || normalizedProducts.ANY) &&
  match(resource.billing_model, getBillingQuotaModel(query.billing_model || any)) &&
  match(resource.cloud_provider, query.cloud_provider || any) &&
  match(resource.byoc, query.byoc || any) &&
  matchCaseInsensitively(resource.availability_zone_type, query.availability_zone_type || any) &&
  match(resource.resource_name, query.resource_name || any);

/**
 * Returns remaining matching quota (integer, possibly 0 or Infinity) from a single QuotaCost item.
 * query should consist of same fields as the resource; omitted fields are treated as 'any'.
 */
const availableFromQuotaCostItem = (quotaCostItem, query) => {
  const matchingCosts = [];
  quotaCostItem.related_resources.forEach((resource) => {
    if (relatedResourceMatches(resource, query)) {
      matchingCosts.push(resource.cost);
    }
  });
  if (matchingCosts.length === 0) {
    return 0;
  }
  const bestCost = Math.min(...matchingCosts);
  if (bestCost === 0) {
    return Infinity;
  }

  // If you're able to create half a node, you're still in "not enough quota" situation.
  const available = Math.floor((quotaCostItem.allowed - quotaCostItem.consumed) / bestCost);

  // Negative ResourceQuota does exist
  // For each quota cost item only consider the related resources with positive quota available
  // Otherwise for queries containing "any" selectors could match negative quota cost items
  // and incorrectly disable the item for a user when there may be another match that has
  // available quota
  return available > 0 ? available : 0;
};

/**
 * Returns remaining matching quota (integer, possibly 0 or Infinity).
 * resourceType is required; other query fields may be omitted, default to 'any'.
 */
const availableQuota = (quotaList, params) => {
  const { resourceType, resourceName, product, billingModel, cloudProviderID, isBYOC, isMultiAz } =
    params;

  const normalizedBillingModel =
    billingModel === 'standard-trial' ? billingModels.STANDARD : billingModel;
  const query = {
    resource_type: resourceType,
    product,
    billing_model: normalizedBillingModel || any,
    cloud_provider: cloudProviderID || any,
    byoc: { [true]: 'byoc', [false]: 'rhinfra', [undefined]: any }[isBYOC],
    availability_zone_type: { [true]: 'multi', [false]: 'single', [undefined]: any }[isMultiAz],
    resource_name: resourceName || any,
  };
  let available = 0;
  quotaList.items?.forEach((quotaCostItem) => {
    available += availableFromQuotaCostItem(quotaCostItem, query);
  });
  return available;
};

/**
 * Returns an object containing the addon's available billing options (standard/marketplace), quota cost information, and cloud accounts if applicable
 */
const addOnBillingQuota = (quotaList, { resourceType, resourceName }) => {
  const models = {};
  const query = {
    resource_name: resourceName,
    resource_type: resourceType,
  };
  quotaList.items.forEach((quotaCostItem) => {
    quotaCostItem.related_resources.forEach((resource) => {
      if (relatedResourceMatches(resource, query)) {
        if (resource.billing_model === any || resource.billing_model === billingModels.STANDARD) {
          if (!models.standard) {
            models.standard = {
              cost: resource.cost,
              allowed: quotaCostItem.allowed,
              consumed: quotaCostItem.consumed,
            };
          }
        } else if (resource.billing_model === billingModels.MARKETPLACE) {
          if (!models.marketplace) {
            let cloudAccounts = null;
            if (quotaCostItem.cloud_accounts) {
              const rhmAccounts = quotaCostItem.cloud_accounts.filter(
                (m) => m.cloud_provider_id === 'rhm',
              );
              const awsAccounts = quotaCostItem.cloud_accounts.filter(
                (m) => m.cloud_provider_id === 'aws',
              );
              const azureAccounts = quotaCostItem.cloud_accounts.filter(
                (m) => m.cloud_provider_id === 'azure',
              );
              cloudAccounts = {
                rhm: rhmAccounts,
                aws: awsAccounts,
                azure: azureAccounts,
              };
            }
            models.marketplace = {
              cost: resource.cost,
              cloudAccounts,
              allowed: quotaCostItem.allowed,
              consumed: quotaCostItem.consumed,
            };
          }
        }
      }
    });
  });
  return models;
};

/**
 * Returns true if org has matching quota with cost 0 or allowed > 0, even if it's all consumed!
 * This is useful to show a specific resource (possibly greyed out) vs not show it at all.
 * resourceType is required; other query fields may be omitted, default to 'any'.
 */
const hasPotentialQuota = (
  quotaList,
  { resourceType, product, billingModel, cloudProviderID, isBYOC, isMultiAz, resourceName },
) => {
  const query = {
    resource_type: resourceType,
    product,
    billing_model: billingModel || any,
    cloud_provider: cloudProviderID || any,
    byoc: { [true]: 'byoc', [false]: 'rhinfra', [undefined]: any }[isBYOC],
    availability_zone_type: { [true]: 'multi', [false]: 'single', [undefined]: any }[isMultiAz],
    resource_name: resourceName || any,
  };
  let allowed = false;
  quotaList.items.forEach((quotaCostItem) => {
    quotaCostItem.related_resources.forEach((resource) => {
      if (relatedResourceMatches(resource, query)) {
        if (resource.cost === 0 || quotaCostItem.allowed > 0) {
          allowed = true;
        }
      }
    });
  });
  return allowed;
};

/**
 * Returns partial query object for availableQuota() matching an existing cluster.
 */
const queryFromCluster = (cluster) => ({
  product: cluster.subscription.plan.type,
  billingModel: get(cluster, 'billing_model', billingModels.STANDARD),
  cloudProviderID: get(cluster, 'cloud_provider.id', 'any'),
  isBYOC: get(cluster, 'ccs.enabled', false),
  isMultiAz: get(cluster, 'multi_az', false),
});

/**
 * Returns number of clusters of specific type that can be created/added, from 0 to `Infinity`.
 * Returns 0 if necessary data not fulfilled yet.
 * @param quotaList - `state.userProfile.organization.quotaList`
 * @param query - {product, cloudProviderID, resourceName, isBYOC,isMultiAz, billingModel}
 */
const availableClustersFromQuota = (quotaList, query) =>
  availableQuota(quotaList, { ...query, resourceType: quotaTypes.CLUSTER });

const hasManagedQuotaSelector = (state, product) =>
  availableClustersFromQuota(state.userProfile.organization.quotaList, {
    product,
  }) >= 1;

/**
 * Returns number of nodes of specific type that can be created/added, from 0 to `Infinity`.
 * Returns 0 if necessary data not fulfilled yet.
 * @param quotaList - `state.userProfile.organization.quotaList`
 * @param query - {product, cloudProviderID, resourceName, isBYOC,isMultiAz, billingModel}
 */
const availableNodesFromQuota = (quotaList, query) =>
  availableQuota(quotaList, { ...query, resourceType: quotaTypes.NODE });

const getAwsBillingAccountsFromQuota = (quotaList) => {
  const marketplaceQuota = quotaList.items.find(
    (quota) => quota.quota_id === 'cluster|byoc|moa|marketplace',
  );
  return (
    marketplaceQuota?.cloud_accounts?.filter((account) => account.cloud_provider_id === 'aws') || []
  );
};

export {
  quotaTypes,
  any,
  availableQuota,
  hasPotentialQuota,
  queryFromCluster,
  hasManagedQuotaSelector,
  availableClustersFromQuota,
  availableNodesFromQuota,
  addOnBillingQuota,
  getAwsBillingAccountsFromQuota,
};
