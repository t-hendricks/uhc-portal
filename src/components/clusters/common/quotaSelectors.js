import get from 'lodash/get';

import { normalizedProducts } from '../../../common/subscriptionTypes';

const hasAwsQuotaSelector = (state, product) => (
  // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
  // TODO don't hardcode, look up by product (https://issues.redhat.com/browse/SDA-3231).
  product === normalizedProducts.ROSA ? true
    : get(
      state.userProfile.organization.quotaList,
      ['clustersQuota', product, 'aws', 'isAvailable'],
      false,
    )
);
const hasGcpQuotaSelector = (state, product) => (
  get(
    state.userProfile.organization.quotaList,
    ['clustersQuota', product, 'gcp', 'isAvailable'],
    false,
  )
);
const hasManagedQuotaSelector = (state, product) => (
  hasAwsQuotaSelector(state, product) || hasGcpQuotaSelector(state, product)
);

const awsQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.aws');

const gcpQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.gcp');

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
  },
) => {
  if (product === normalizedProducts.ROSA) {
    // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
    // TODO look up by product (https://issues.redhat.com/browse/SDA-3231) and check cost.
    return Infinity;
  }

  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAz ? 'multiAz' : 'singleAz';

  return get(quotaList.clustersQuota, [product, cloudProviderID, infra, zoneType, resourceName], 0);
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
  },
) => {
  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const data = get(quotaList.nodesQuota, [product, cloudProviderID, infra, resourceName], {});
  const available = get(data, 'available', 0);
  // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
  // TODO don't hardcode, look up by product (https://issues.redhat.com/browse/SDA-3231).
  const cost = (product === normalizedProducts.ROSA) ? 0
    : get(data, 'cost', Infinity);

  if (cost === 0) {
    return Infinity;
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
