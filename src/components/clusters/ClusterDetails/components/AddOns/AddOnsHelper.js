import get from 'lodash/get';
import has from 'lodash/has';

import { billingModels } from '../../../../../common/subscriptionTypes';

/**
 * Returns last level indexed by resource_name e.g. {'addon-foo': 2, 'addon-bar': Infinity}.
 */
const quotaLookup = (cluster, quota) => {
  const billingModel = get(cluster, 'billing_model', billingModels.STANDARD);
  const product = cluster.subscription.plan.id; // TODO plan.type
  const cloudProviderID = get(cluster, 'cloud_provider.id', 'any');
  const infra = cluster.ccs.enabled ? 'byoc' : 'rhInfra';
  const zoneType = cluster.multi_az ? 'multiAz' : 'singleAz';

  return get(quota.addOnsQuota, [billingModel, product, cloudProviderID, infra, zoneType], {});
};

// An add-on is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (addOn, cluster, organization, quota) => {
  // We get quota together with organization.
  // TODO: have action/reducer set quota.fullfilled, drop organization arg.
  if (!addOn.enabled || !organization.fulfilled) {
    return false;
  }

  // If the add-on is not in the quota cost, it should not be available
  return has(quotaLookup(cluster, quota), addOn.resource_name);
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

  return get(quotaLookup(cluster, quota), addOn.resource_name, 0) >= 1;
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

const getParameterValue = (addOnInstallation, paramID) => {
  const param = getParameter(addOnInstallation, paramID);
  if (param) {
    return param.value;
  }
  return undefined;
};

const parameterValuesForEditing = (addOnInstallation, addOn) => {
  const vals = { parameters: {} };
  if (hasParameters(addOn)) {
    vals.parameters = Object.values(addOn.parameters.items).reduce((acc, curr) => {
      let paramValue = getParameterValue(addOnInstallation, curr.id);
      if (curr.value_type === 'boolean') {
        // Ensure existing boolean value is returned as a boolean, and always return false otherwise
        paramValue = (paramValue || '').toLowerCase() === 'true';
      }
      if (paramValue !== undefined) {
        // eslint-disable-next-line no-param-reassign
        acc[curr.id] = paramValue;
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
  hasParameters,
  getParameter,
  parameterValuesForEditing,
};
