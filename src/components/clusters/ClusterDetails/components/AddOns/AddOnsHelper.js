import get from 'lodash/get';

import {
  availableQuota, hasPotentialQuota, queryFromCluster, quotaTypes,
} from '../../../common/quotaSelectors';

// An add-on is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (addOn, cluster, organization, quotaList) => {
  // We get quota together with organization.
  // TODO: have action/reducer set quota.fullfilled, drop organization arg.
  if (!addOn.enabled || !organization.fulfilled) {
    return false;
  }

  // If the add-on is not in the quota cost, it should not be available
  return hasPotentialQuota(quotaList, {
    ...queryFromCluster(cluster),
    resourceType: quotaTypes.ADD_ON,
    resourceName: addOn.resource_name,
  }) >= 1;
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
const hasQuota = (addOn, cluster, organization, quotaList) => {
  if (!isAvailable(addOn, cluster, organization, quotaList)) {
    return false;
  }

  return availableQuota(quotaList, {
    ...queryFromCluster(cluster),
    resourceType: quotaTypes.ADD_ON,
    resourceName: addOn.resource_name,
  }) >= 1;
};

const quotaCostOptions = (resourceName, cluster, quotaList, allOptions, currentValue = 0) => {
  // Note: This is only currently looking for addon resource types
  // eslint-disable-next-line no-param-reassign
  currentValue = Number.isNaN(currentValue) ? 0 : currentValue;
  const query = {
    ...queryFromCluster(cluster),
    resourceType: quotaTypes.ADD_ON,
    resourceName,
  };

  if (!hasPotentialQuota(quotaList, query)) {
    // If the resource name was not found in quota, it might not be an addon resource name,
    // but still valid. For now we will just return all options in this case to allow all resource
    // names to work and avoid an empty options list.
    return allOptions;
  }
  const available = availableQuota(quotaList, query);
  return allOptions.filter(option => (available + currentValue) >= option.value);
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
  addOn, cluster, clusterAddOns, clusterMachinePools, breakOnFirstError = true,
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
  validateAddOnRequirements,
};
