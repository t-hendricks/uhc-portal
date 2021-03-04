import get from 'lodash/get';

import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';

// Used for matching any in various fields of quota cost related resources
const any = 'any';

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
  hasManagedQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
  availableClustersFromQuota,
  availableNodesFromQuota,
};
