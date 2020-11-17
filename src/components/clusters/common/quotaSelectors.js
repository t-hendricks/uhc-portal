import get from 'lodash/get';

const hasAwsQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.aws.isAvailable', false);
const hasGcpQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.gcp.isAvailable', false);
const hasOSDQuotaSelector = state => hasAwsQuotaSelector(state) || hasGcpQuotaSelector(state);

const awsQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.aws', {
  byoc: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
  rhInfra: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
});

const gcpQuotaSelector = state => get(state, 'userProfile.organization.quotaList.clustersQuota.gcp', {
  byoc: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
  rhInfra: {
    singleAz: {},
    multiAz: {},
    totalAvailable: 0,
  },
});

// TODO: all uses of isROSA should go away.
const isROSA = product => ['MOA', 'ROSA'].includes(product);

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
  if (isROSA(product)) {
    // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
    // TODO look up by product (https://issues.redhat.com/browse/SDA-3231) and check cost.
    return Infinity;
  }

  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAz ? 'multiAz' : 'singleAz';

  return get(quotaList.clustersQuota, [cloudProviderID, infra, zoneType, resourceName], 0);
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
  const available = get(quotaList.nodesQuota, [cloudProviderID, infra, resourceName, 'available'], 0);

  // ROSA has zero cost (as far as Red Hat is concerned, billed by Amazon).
  // TODO don't hardcode, look up by product (https://issues.redhat.com/browse/SDA-3231).
  const cost = isROSA(product) ? 0
    : get(quotaList.nodesQuota, [cloudProviderID, infra, resourceName, 'cost'], Infinity);

  if (cost === 0) {
    return Infinity;
  }
  // If you're able to create half a node, you're still in "not enough quota" situation.
  return Math.floor(available / cost);
};

export {
  hasOSDQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
  availableClustersFromQuota,
  availableNodesFromQuota,
  isROSA,
};
