import get from 'lodash/get';

import {
  availableQuota, hasPotentialQuota, queryFromCluster, quotaTypes,
} from '../../../common/quotaSelectors';

// An add-on is only visible if it has an entry in the quota summary
// regardless of whether the org has quota or not
const isAvailable = (addOn, cluster, organization, quotaList) => {
  // We get quota together with organization.
  // TODO: have action/reducer set quota.fulfilled, drop organization arg.
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

const requirementFulfilledByResource = (myResource, requirement) => Object.entries(requirement.data)
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
        case 'aws.sts.enabled': {
          clusterValue = false;
          break;
        }
        case 'compute.memory':
        case 'compute.cpu': {
          // In these cases we don't want to deal with checking the requirement at all in the UI,
          // instead we just allow it through and let the backend deal with it.
          return true;
        }
      }
    }
    // We need the product id to match what CS expects but the cluster value is always the AMS
    // equivalent. Change the cluster value to lowercase for product id only to get round the issue.
    if (clusterValue && field === 'product.id') {
      clusterValue = clusterValue.toLowerCase();
    }
    if (Array.isArray(requiredValue)) {
      return requiredValue.includes(clusterValue);
    }
    if (typeof requiredValue === 'number') {
      return clusterValue >= requiredValue;
    }
    return clusterValue === requiredValue;
  });

const validateAddOnResourceRequirement = (
  requirement, cluster, clusterAddOns = [], clusterMachinePools = [],
) => {
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
  }
  return [requirementMet, requirementError];
};

const validateAddOnResourceRequirementList = (
  requirements, cluster, clusterAddOns = [], clusterMachinePools = [], breakOnFirstError = false,
) => {
  const requirementStatus = {
    fulfilled: true,
    errorMsgs: [],
  };
  if (requirements.length > 0) {
    requirements.every((requirement) => {
      const [requirementMet, requirementError] = validateAddOnResourceRequirement(
        requirement, cluster, clusterAddOns, clusterMachinePools,
      );

      if (!requirementMet) {
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

// validates that a given addons requirements are fulfilled
const validateAddOnRequirements = (
  addOn, cluster, clusterAddOns, clusterMachinePools, breakOnFirstError = false,
) => validateAddOnResourceRequirementList(get(addOn, 'requirements', []), cluster,
  clusterAddOns, clusterMachinePools, breakOnFirstError);

// validates that a given addon parameters conditions are fulfilled
const validateAddOnParameterConditions = (
  addOnParam, cluster, breakOnFirstError = false,
) => validateAddOnResourceRequirementList(get(addOnParam, 'conditions', []), cluster,
  breakOnFirstError);

// return a list of parameters for the given addon filtering out any that have conditions that are
// not satisfied by the cluster. If no cluster is specified, all parameters will be returned.
const getParameters = (addOn, cluster = undefined) => {
  if (get(addOn, 'parameters.items.length', 0) > 0) {
    if (cluster === undefined) {
      return get(addOn, 'parameters.items', []);
    }
    return addOn.parameters.items.filter((param) => {
      const requirementStatus = validateAddOnParameterConditions(param, cluster, true);
      return requirementStatus.fulfilled;
    });
  }
  return [];
};

// returns true if the given addon has parameters. If a cluster is specified, any parameters with
// conditions that are not satisfied by the cluster will be ignored.
const hasParameters = (addOn, cluster = undefined) => get(getParameters(addOn, cluster), 'length', 0) > 0;

const minQuotaCount = (addOn) => {
  let min = 1;
  if (hasParameters(addOn)) {
    addOn.parameters.items.forEach((param) => {
      if (param.value_type === 'resource' && param.id === addOn.resource_name
        && param.options !== undefined && param.options.length > 0) {
        const values = param.options
          .map(option => Number(option.value))
          .filter(value => !Number.isNaN(value));
        min = Math.min(...values);
      }
    });
  }
  return min;
};

// An add-on can only be installed if the org has quota for this particular add-on
const hasQuota = (addOn, cluster, organization, quotaList) => {
  if (!isAvailable(addOn, cluster, organization, quotaList)) {
    return false;
  }
  const minCount = minQuotaCount(addOn);
  return availableQuota(quotaList, {
    ...queryFromCluster(cluster),
    resourceType: quotaTypes.ADD_ON,
    resourceName: addOn.resource_name,
  }) >= minCount;
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

const parameterValuesForEditing = (addOnInstallation, addOn, cluster = undefined) => {
  const vals = { parameters: {} };
  if (hasParameters(addOn, cluster)) {
    vals.parameters = getParameters(addOn, cluster).reduce((acc, curr) => {
      let paramValue = getParameterValue(addOnInstallation, curr.id);
      if (curr.value_type === 'boolean') {
        // Ensure existing boolean value is returned as a boolean, and always return false otherwise
        paramValue = (paramValue || '').toLowerCase() === 'true';
      }
      if (curr.options !== undefined && curr.options.length > 0) {
        // Ensure if options exist that one is always selected
        paramValue = paramValue || undefined;
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
const parameterAndValue = (addOnInstallation, addOn, cluster = undefined) => {
  const vals = { parameters: {} };
  if (hasParameters(addOn, cluster)) {
    vals.parameters = getParameters(addOn, cluster).reduce((acc, curr) => {
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

export {
  isAvailable,
  isInstalled,
  getInstalled,
  hasQuota,
  quotaCostOptions,
  availableAddOns,
  validateAddOnRequirements,
  validateAddOnParameterConditions,
  getParameters,
  hasParameters,
  hasRequirements,
  getParameter,
  getParameterValue,
  parameterValuesForEditing,
  parameterAndValue,
  minQuotaCount,
};
