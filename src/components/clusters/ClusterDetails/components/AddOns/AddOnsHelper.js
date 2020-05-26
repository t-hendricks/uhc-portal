import get from 'lodash/get';
import has from 'lodash/has';

// An add-on is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (addOn, cluster, organization, quota) => {
  if (!addOn.enabled || !organization.fulfilled) {
    return false;
  }

  // If the add-on is free, it should be available on OSD clusters
  if (cluster.product.id === 'osd' && addOn.resource_cost === 0) {
    return true;
  }

  // If the add-on is not in the quota summary, it should not be available
  return has(quota.addOnsQuota, addOn.resource_name);
};

const isInstalled = (addOn, clusterAddOns) => {
  if (!get(clusterAddOns, 'items.length', false)) {
    return false;
  }

  return clusterAddOns.items.some(clusterAddOn => clusterAddOn.addon.id === addOn.id);
};

// An add-on can only be installed if the org has quota for this particular add-on
const hasQuota = (addOn, cluster, organization, quota) => {
  if (!isAvailable(addOn, cluster, organization, quota)) {
    return false;
  }

  // Quota is unnecessary for free add-ons on OSD clusters
  if (cluster.product.id === 'osd' && addOn.resource_cost === 0) {
    return true;
  }

  return get(quota.addOnsQuota, addOn.resource_name, 0) >= addOn.resource_cost;
};

const availableAddOns = (addOns, cluster, clusterAddOns, organization, quota) => {
  if (!get(addOns, 'items.length', false)) {
    return [];
  }

  return addOns.items.filter(addOn => isAvailable(addOn, cluster, organization, quota)
                             || isInstalled(addOn, clusterAddOns));
};

export {
  isAvailable,
  isInstalled,
  hasQuota,
  availableAddOns,
};
