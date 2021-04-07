import get from 'lodash/get';

/**
 * Returns last level load balancer quota object indexed by the resource_name 'network'.
 */
const quotaLookup = (quotaList, billingModel, product, cloudProviderID, isBYOC, isMultiAZ) => {
  const resourceName = 'network';
  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAZ ? 'multiAZ' : 'singleAZ';
  return get(quotaList.loadBalancerQuota,
    [billingModel, product, cloudProviderID, infra, zoneType, resourceName], {});
};

const filterLoadBalancerValuesByQuota = (currentValue, loadBalancerValues, remainingQuota) => {
  const result = { ...loadBalancerValues };
  if (!result.values) {
    return { values: [] };
  }
  if (currentValue) {
    result.values = result.values.filter(el => el <= remainingQuota + currentValue);
  } else {
    result.values = result.values.filter(el => el <= remainingQuota);
  }
  return result;
};

export {
  filterLoadBalancerValuesByQuota,
  quotaLookup,
};
