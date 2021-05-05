import get from 'lodash/get';

import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';

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
 * Returns true if a QuotaCost.related_resources item matches given constraints.
 * query should consists of same fields as the resource; omitted fields are treated as 'any'.
 */
const relatedResourceMatches = (resource, query) => (
  match(resource.resource_type, query.resource_type || any)
  && matchCaseInsensitively(resource.product, query.product || normalizedProducts.ANY)
  && match(resource.billing_model, query.billing_model || any)
  && match(resource.cloud_provider, query.cloud_provider || any)
  && match(resource.byoc, query.byoc || any)
  && matchCaseInsensitively(resource.availability_zone_type, query.availability_zone_type || any)
  && match(resource.resource_name, query.resource_name || any)
);

/**
 * Returns remaining matching quota (integer, possibly 0 or Infinity) from a single QuotaCost item.
 * query should consists of same fields as the resource; omitted fields are treated as 'any'.
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
  return Math.floor((quotaCostItem.allowed - quotaCostItem.consumed) / bestCost);
};

/**
 * Returns remaining matching quota (integer, possibly 0 or Infinity).
 * resourceType is required; othre query fields may be omitted, default to 'any'.
 */
const availableQuota = (
  quotaList,
  {
    resourceType,
    product,
    billingModel,
    cloudProviderID,
    isBYOC,
    isMultiAz,
    resourceName,
  },
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
  let available = 0;
  quotaList.items.forEach((quotaCostItem) => {
    available += availableFromQuotaCostItem(quotaCostItem, query);
  });
  return available;
};

/**
 * Returns true if org has matching quota with cost 0 or allowed > 0, even if it's all consumed!
 * This is useful to show a specific resource (possibly greyed out) vs not show it at all.
 * resourceType is required; othre query fields may be omitted, default to 'any'.
 */
const hasPotentialQuota = (
  quotaList,
  {
    resourceType,
    product,
    billingModel,
    cloudProviderID,
    isBYOC,
    isMultiAz,
    resourceName,
  },
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
const queryFromCluster = cluster => (
  {
    product: cluster.subscription.plan.id, // TODO plan.type,
    billingModel: get(cluster, 'billing_model', billingModels.STANDARD),
    cloudProviderID: get(cluster, 'cloud_provider.id', 'any'),
    isBYOC: get(cluster, 'ccs.enabled', false),
    isMultiAz: get(cluster, 'multi_az', false),
  }
);

const hasAwsQuotaSelector = (state, product, billing = billingModels.STANDARD) => (
  // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
  // TODO don't hardcode, look up by product (https://issues.redhat.com/browse/SDA-3231).
  product === normalizedProducts.ROSA ? true
    : get(
      state.userProfile.organization.quotaList,
      ['clustersQuota', billing, product, 'aws', 'isAvailable'],
      false,
    )
);
const hasGcpQuotaSelector = (state, product, billing = billingModels.STANDARD) => (
  get(
    state.userProfile.organization.quotaList,
    ['clustersQuota', billing, product, 'gcp', 'isAvailable'],
    false,
  )
);
const hasManagedQuotaSelector = (state, product) => {
  const { STANDARD, MARKETPLACE } = billingModels;

  // has marketplace or standard quota for AWS or GCP
  return hasAwsQuotaSelector(state, product, STANDARD)
      || hasGcpQuotaSelector(state, product, STANDARD)
      || hasAwsQuotaSelector(state, product, MARKETPLACE)
      || hasGcpQuotaSelector(state, product, MARKETPLACE);
};

// TODO: special-case ROSA?
const awsQuotaSelector = (state, product, billing = billingModels.STANDARD) => (
  get(state.userProfile.organization.quotaList, ['clustersQuota', billing, product, 'aws'])
);

const gcpQuotaSelector = (state, product, billing = billingModels.STANDARD) => (
  get(state.userProfile.organization.quotaList, ['clustersQuota', billing, product, 'gcp'])
);

/**
 * Returns number of clusters of specific type that can be created/added, from 0 to `Infinity`.
 * Returns 0 if necessary data not fulfilled yet.
 * @param quotaList - `state.userProfile.organization.quotaList`
 */
const availableClustersFromQuota = (
  quotaList,
  {
    product,
    cloudProviderID,
    resourceName,
    isBYOC,
    isMultiAz,
    billingModel,
  },
) => {
  if (product === normalizedProducts.ROSA) {
    // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
    // TODO look up by product (https://issues.redhat.com/browse/SDA-3231) and check cost.
    return Infinity;
  }

  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAz ? 'multiAz' : 'singleAz';

  let available = get(
    quotaList.clustersQuota,
    [billingModel, product, cloudProviderID, infra, zoneType, resourceName],
    0,
  );

  // support resource_name of 'any'
  const anyResource = get(
    quotaList.clustersQuota,
    [billingModel, product, cloudProviderID, infra, zoneType, any],
    0,
  );

  if (anyResource > available) {
    available = anyResource;
  }

  return available;
};

/**
 * Returns number of nodes of specific type that can be created/added, from 0 to `Infinity`.
 * Returns 0 if necessary data not fulfilled yet.
 * @param quotaList - `state.userProfile.organization.quotaList`
 */
const availableNodesFromQuota = (
  quotaList,
  {
    product,
    cloudProviderID,
    resourceName,
    isBYOC,
    // isMultiAz - unused here.
    billingModel,
  },
) => {
  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const data = get(
    quotaList.nodesQuota, [billingModel, product, cloudProviderID, infra, resourceName], {},
  );
  let available = get(data, 'available', 0);
  // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
  // TODO don't hardcode, look up by product (https://issues.redhat.com/browse/SDA-3231).
  let cost = (product === normalizedProducts.ROSA) ? 0
    : get(data, 'cost', Infinity);

  if (cost === 0) {
    return Infinity;
  }

  // support 'any' resource_name for nodes
  const resourceAnyQuota = get(
    quotaList.nodesQuota, [billingModel, product, cloudProviderID, infra, any], {},
  );
  const anyAvailable = get(resourceAnyQuota, 'available', 0);

  if (anyAvailable > available) {
    available = anyAvailable;
    cost = get(resourceAnyQuota, 'cost', Infinity);
  }

  // If you're able to create half a node, you're still in "not enough quota" situation.
  return Math.floor(available / cost);
};

export {
  availableQuota,
  hasPotentialQuota,
  queryFromCluster,
  hasManagedQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
  availableClustersFromQuota,
  availableNodesFromQuota,
};
