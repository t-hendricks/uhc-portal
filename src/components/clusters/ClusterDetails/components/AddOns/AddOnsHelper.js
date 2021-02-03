import get from 'lodash/get';
import has from 'lodash/has';

const supportsFreeAddOns = cluster => ['osd', 'moa', 'rosa'].includes((cluster.product.id).toLowerCase());

// Add-ons with 0 resource cost are free for OSD/ROSA clusters
const isFreeAddOn = (addOn, cluster) => {
  if (addOn.resource_cost === 0) {
    return supportsFreeAddOns(cluster);
  }
  return false;
};

// An add-on is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (addOn, cluster, organization, quota) => {
  if (!addOn.enabled || !organization.fulfilled) {
    return false;
  }

  // If the add-on is free, it should be available
  if (isFreeAddOn(addOn, cluster)) {
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

const getInstalled = (addOn, clusterAddOns) => clusterAddOns.items.find(
  item => item.addon.id === addOn.id,
);

// An add-on can only be installed if the org has quota for this particular add-on
const hasQuota = (addOn, cluster, organization, quota) => {
  if (!isAvailable(addOn, cluster, organization, quota)) {
    return false;
  }

  // Quota is unnecessary for free add-ons
  if (isFreeAddOn(addOn, cluster)) {
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

const hasParameters = addOn => get(addOn, 'parameters.items.length', 0) > 0;

const getParameter = (addOn, paramID) => {
  if (hasParameters(addOn)) {
    return addOn.parameters.items.find(item => item.id === paramID);
  }
  return undefined;
};

const parameterValuesForEditing = (addOnInstallation, addOn) => {
  const vals = { parameters: {} };
  if (hasParameters(addOnInstallation) && hasParameters(addOn)) {
    vals.parameters = Object.entries(addOnInstallation.parameters.items).reduce((acc, curr) => {
      if (getParameter(addOn, curr[1].id)) {
        // eslint-disable-next-line no-param-reassign
        acc[curr[1].id] = curr[1].value;
      }
      return acc;
    }, {});
  }
  return vals;
};

export {
  isAvailable,
  isInstalled,
  getInstalled,
  hasQuota,
  availableAddOns,
  supportsFreeAddOns,
  hasParameters,
  getParameter,
  parameterValuesForEditing,
};
