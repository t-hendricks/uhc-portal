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

// Returns number of clusters of specific type that can be created/added, from 0 to `Infinity`.
// Returns 0 if necessary data not fulfilled yet.
// NOTE: this receives `state.userProfile.organization.quotaList`, not top-level state.
const availableClustersFromQuota = (
  quotaList,
  {
    // TODO: this should also take a `product` param?
    cloudProviderID,
    resourceName,
    isBYOC,
    isMultiAz,
  },
) => {
  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAz ? 'multiAz' : 'singleAz';

  return get(quotaList.clustersQuota, [cloudProviderID, infra, zoneType, resourceName], 0);
};

// Returns number of nodes of specific type that can be created/added, from 0 to `Infinity`.
// Returns 0 if necessary data not fulfilled yet.
// NOTE: this receives `state.userProfile.organization.quotaList`, not top-level state.
const availableNodesFromQuota = (
  quotaList,
  {
    // TODO: this should also take a `product` param?
    cloudProviderID,
    resourceName,
    isBYOC,
    // isMultiAz - unused here.
  },
) => {
  const infra = isBYOC ? 'byoc' : 'rhInfra';

  const available = get(quotaList.nodesQuota, [cloudProviderID, infra, resourceName, 'available'], 0);
  const cost = get(quotaList.nodesQuota, [cloudProviderID, infra, resourceName, 'cost'], Infinity);
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
};
