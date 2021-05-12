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
  const infra = cluster.ccs?.enabled ? 'byoc' : 'rhInfra';
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

const quotaCostOptions = (resourceName, cluster, quota, allOptions, currentValue = 0) => {
  // Note: This is only currently looking for addon resource types
  // eslint-disable-next-line no-param-reassign
  currentValue = Number.isNaN(currentValue) ? 0 : currentValue;
  const availableQuota = get(quotaLookup(cluster, quota), resourceName, -1);
  if (availableQuota === -1) {
    // If the resource name was not found in quota, it might not be an addon resource name,
    // but still valid. For now we will just return all options in this case to allow all resource
    // names to work and avoid an empty options list.
    return allOptions;
  }
  return allOptions.filter(option => (availableQuota + currentValue) >= option.value);
};

const availableAddOns = (addOns, cluster, clusterAddOns, organization, quota) => {
  if (!get(addOns, 'items.length', false)) {
    return [];
  }

  return addOns.items.filter(addOn => isAvailable(addOn, cluster, organization, quota)
    || isInstalled(addOn, clusterAddOns));
};

const hasParameters = addOn => get(addOn, 'parameters.items.length', 0) > 0;

const hasRequirements = addOn => get(addOn, 'requirements.length', 0) > 0;

const getParameter = (addOn, paramID) => {
  if (hasParameters(addOn)) {
    return addOn.parameters.items.find(item => item.id === paramID);
  }
  return undefined;
};

const getParameterValue = (addOnInstallation, paramID, defaultValue = undefined) => {
  const param = getParameter(addOnInstallation, paramID);
  if (param) {
    return param.value;
  }
  return defaultValue;
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
      if (curr.options !== undefined && curr.options.length > 0) {
        // Ensure if options exist that one is always selected
        paramValue = paramValue || curr.options[0].value;
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

// return a list of add-on parameters with the corresponding add-on installation parameter value
const parameterAndValue = (addOnInstallation, addOn) => {
  const vals = { parameters: {} };
  if (hasParameters(addOn)) {
    vals.parameters = Object.values(addOn.parameters.items).reduce((acc, curr) => {
      let paramValue = getParameterValue(addOnInstallation, curr.id);
      if (curr.value_type === 'boolean') {
        // Ensure existing boolean value is returned as a boolean, and always return false otherwise
        paramValue = (paramValue || '').toString().toLowerCase() === 'true';
      }
      if (curr.options) {
        const optionObj = curr.options.find(obj => obj.value === paramValue);
        if (optionObj?.name) {
          paramValue = optionObj.name;
        }
      }
      if (paramValue !== undefined) {
        const updatedParam = { value: paramValue.toString(), ...curr };
        // eslint-disable-next-line no-param-reassign
        acc[curr.id] = updatedParam;
      }
      return acc;
    }, {});
  }
  return vals;
};

const formatRequirementData = (data) => {
  const attrs = [];
  Object.entries(data)
    .forEach(([field, requiredValue]) => {
      if (Array.isArray(requiredValue)) {
        attrs.push(`${field} is ${requiredValue.join(' or ')}`);
      } else if (typeof requiredValue === 'number') {
        attrs.push(`${field} >= ${requiredValue}`);
      } else {
        attrs.push(`${field} is ${requiredValue}`);
      }
    });
  return attrs.join(' and ');
};

const requirementFulfilledByResource = (myResource, requirement) => {
  let constraintsMet = true;
  Object.entries(requirement.data)
    .every(([field, requiredValue]) => {
      let clusterValue = get(myResource, field);
      if (clusterValue === undefined) {
        // eslint-disable-next-line default-case
        switch (field) {
          case 'replicas': {
            clusterValue = get(myResource, 'autoscaling.max_replicas');
            break;
          }
          case 'nodes.compute': {
            clusterValue = get(myResource, 'nodes.autoscale_compute.max_replicas');
            break;
          }
        }
      }
      if (Array.isArray(requiredValue)) {
        constraintsMet = requiredValue.includes(clusterValue);
      } else if (typeof requiredValue === 'number') {
        constraintsMet = clusterValue >= requiredValue;
      } else {
        constraintsMet = clusterValue === requiredValue;
      }
      return constraintsMet;
    });
  return constraintsMet;
};

const validateAddOnRequirements = (
  addOn, cluster, clusterAddOns, clusterMachinePools, breakOnFirstError = false,
) => {
  const requirementStatus = {
    fulfilled: true,
    errorMsgs: [],
  };
  if (hasRequirements(addOn)) {
    addOn.requirements.every((requirement) => {
      let requirementMet = false;
      let requirementError;
      switch (requirement.resource) {
        case 'cluster': {
          requirementMet = requirementFulfilledByResource(cluster, requirement);
          break;
        }
        case 'addon': {
          if (get(clusterAddOns, 'items.length', false)) {
            requirementMet = clusterAddOns.items
              .some(addon => requirementFulfilledByResource(addon, requirement));
          }
          if (!requirementMet) {
            requirementError = 'This addon requires an addon to be installed where '
              + `${formatRequirementData(requirement.data)}`;
          }
          break;
        }
        case 'machine_pool': {
          if (get(clusterMachinePools, 'data.length', false)) {
            requirementMet = clusterMachinePools.data
              .some(machinePool => requirementFulfilledByResource(machinePool, requirement));
          }
          break;
        }
        default: {
          break;
        }
      }
      if (!requirementMet) {
        if (!requirementError) {
          requirementError = `This addon requires a ${requirement.resource} where `
            + `${formatRequirementData(requirement.data)}`;
        }
        requirementStatus.errorMsgs.push(requirementError);
      }
      if (requirementStatus.fulfilled) {
        requirementStatus.fulfilled = requirementMet;
      }
      return !(!requirementStatus.fulfilled && breakOnFirstError);
    });
  }
  return requirementStatus;
};

export {
  isAvailable,
  isInstalled,
  getInstalled,
  hasQuota,
  quotaCostOptions,
  availableAddOns,
  hasParameters,
  hasRequirements,
  getParameter,
  getParameterValue,
  parameterValuesForEditing,
  parameterAndValue,
  validateAddOnRequirements,
};
