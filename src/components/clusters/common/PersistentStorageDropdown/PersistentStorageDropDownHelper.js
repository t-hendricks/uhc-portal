
import get from 'lodash/get';
import has from 'lodash/has';
import { parseValueWithUnit } from '../../../../common/units';

import { billingModels } from '../../../../common/subscriptionTypes';

/**
 * Returns last level indexed by resource_name e.g. {'gp2': 2700}.
 */
const quotaLookup = (cluster, quota) => {
  const billingModel = get(cluster, 'billing_model', billingModels.STANDARD);
  const product = cluster.subscription.plan.id; // TODO plan.type
  const cloudProviderID = get(cluster, 'cloud_provider.id', 'any');
  const infra = cluster.ccs.enabled ? 'byoc' : 'rhInfra';
  const zoneType = cluster.multi_az ? 'multiAZ' : 'singleAZ';
  const resourceName = 'gp2';
  return get(quota.storageQuota,
    [billingModel, product, cloudProviderID, infra, zoneType, resourceName], {});
};


// Storage quota is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (cluster, organization, quota) => {
  // We get quota together with organization.
  // TODO: have action/reducer set quota.fullfilled, drop organization arg.
  if (!organization.fulfilled) {
    return false;
  }

  // If the storage quota is not in the quota cost, it should not be available
  return has(quotaLookup(cluster, quota));
};

const baseClusterQuota = 107374182400; // The base cluster storage quota is 100 GiB (in bytes).

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
  isAvailable,
  filterPersistentStorageValuesByQuota,
};
