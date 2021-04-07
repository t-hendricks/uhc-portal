
import get from 'lodash/get';
import { parseValueWithUnit } from '../../../../common/units';

const baseClusterQuota = 107374182400; // The base cluster storage quota is 100 GiB (in bytes).

/**
 * Returns last level storage quota object indexed by the resource_name 'gp2'.
 */
const quotaLookup = (quotaList, billingModel, product, cloudProviderID, isBYOC, isMultiAZ) => {
  const resourceName = 'gp2';
  const infra = isBYOC ? 'byoc' : 'rhInfra';
  const zoneType = isMultiAZ ? 'multiAZ' : 'singleAZ';
  return get(quotaList.storageQuota,
    [billingModel, product, cloudProviderID, infra, zoneType, resourceName], {});
};

const filterPersistentStorageValuesByQuota = (currentValue,
  persistentStorageValues, remainingQuota) => {
  // Get quota for persistent storage.
  // this quota is "on top" of the base cluster quota of 100 GiB.
  const quotaInBytes = parseValueWithUnit(remainingQuota, 'GiB');
  const result = { ...persistentStorageValues };
  if (!result.values) {
    return { values: [{ value: baseClusterQuota, unit: 'B' }] };
  }
  if (currentValue) {
    result.values = result.values.filter(el => el.value <= quotaInBytes + currentValue);
  } else {
    result.values = result.values.filter(el => el.value <= quotaInBytes + baseClusterQuota);
  }
  return result;
};


export {
  quotaLookup,
  filterPersistentStorageValuesByQuota,
};
