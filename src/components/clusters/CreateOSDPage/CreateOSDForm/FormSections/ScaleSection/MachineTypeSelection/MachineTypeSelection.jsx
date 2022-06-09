// MachineTypeSelector renders a series of radio buttons for all available node types,
// allowing the user to select just one.
// It is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  SelectGroup,
  SelectOption,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ErrorBox from '../../../../../../common/ErrorBox';
import { humanizeValueWithUnit } from '../../../../../../../common/units';
import { noMachineTypes } from '../../../../../../../common/helpers';
import { availableClustersFromQuota, availableNodesFromQuota } from '../../../../../common/quotaSelectors';
import { normalizedProducts, billingModels } from '../../../../../../../common/subscriptionTypes';

/**
 * Defines order and labels of groups to display to user.
 * The `name` corresponds to `category` field in machine_types API,
 * and to `generic_name` in quota_cost API.
 */
export const machineCategories = [
  { name: 'general_purpose', label: 'General purpose' },
  { name: 'memory_optimized', label: 'Memory optimized' },
  { name: 'compute_optimized', label: 'Compute optimized' },
  { name: 'storage_optimized', label: 'Storage optimized' },
  { name: 'network_optimized', label: 'Network optimized' },
  { name: 'burstable', label: 'Burstable' },
  { name: 'accelerated_computing', label: 'Accelerated computing' },
];

/** Returns useful info about the machine type - CPUs, RAM, [GPUs]. */
const machineTypeLabel = (machineType) => {
  if (!machineType) {
    return '';
  }
  const humanizedMemory = humanizeValueWithUnit(machineType.memory.value,
    machineType.memory.unit);
  let label = `${machineType.cpu.value} ${machineType.cpu.unit} ${humanizedMemory.value} ${humanizedMemory.unit} RAM`;
  if (machineType.category === 'accelerated_computing') {
    const numGPUsStr = machineType.name.match(/\d+ GPU[s]?/g);
    if (numGPUsStr) {
      label += ` (${numGPUsStr})`;
    }
  }
  return label;
};

/** Returns exact id used by cloud provider. */
const machineTypeDescription = (machineType) => {
  if (!machineType) {
    return '';
  }
  return machineType.id;
};

/** Returns useful info plus exact id used by the cloud provider. */
const machineTypeFullLabel = (machineType) => {
  if (!machineType) {
    return '';
  }
  return `${machineTypeDescription(machineType)} - ${machineTypeLabel(machineType)}`;
};

class MachineTypeSelection extends React.Component {
  state = {
    isOpen: false,
  };

  componentDidMount() {
    const {
      machineTypes, organization, input,
    } = this.props;

    if (!input.value && machineTypes.fulfilled && organization.fulfilled) {
      this.setDefaultValue();
    }
  }

  componentDidUpdate() {
    const { machineTypes, input } = this.props;
    if (machineTypes.error || machineTypes.pending) {
      // Don't let the user submit if we couldn't get machine types.
      this.setInvalidValue();
    }

    if (!input.value && machineTypes.fulfilled) {
      // we got the machine types, and the user hasn't selected one yet - set to default.
      this.setDefaultValue();
    }

    // if some external param changed, like MultiAz, and we no longer have quota
    // for the selected instance type, we need to revert to default.
    if (input.value && !this.hasQuotaForType(input.value)) {
      this.setDefaultValue();
    }
  }

  setDefaultValue() {
    // Find the first sortedMachineTypes we have quota for, and set it as default
    const { sortedMachineTypes, input } = this.props;
    if (sortedMachineTypes.length > 0) {
      const defaultType = sortedMachineTypes.find(type => this.hasQuotaForType(type.id));
      if (defaultType) {
        input.onChange(defaultType.id);
      }
    }
  }

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { input } = this.props;
    input.onChange('');
  }

  onToggle = (isOpen) => {
    this.setState({
      isOpen,
    });
  };

  // Returns false if necessary data not fulfilled yet.
  hasQuotaForType(machineTypeID) {
    const {
      machineTypesByID, organization, quota,
      cloudProviderID, isBYOC, isMultiAz, isMachinePool, product, billingModel,
    } = this.props;

    // Wait for quota_cost.  Presently, it's fetched together with organization.
    if (!organization.fulfilled) {
      return false;
    }

    const machineType = machineTypesByID[machineTypeID];
    if (!machineType) {
      return false;
    }
    const resourceName = machineType.generic_name;

    const quotaParams = {
      product, cloudProviderID, isBYOC, isMultiAz, resourceName, billingModel,
    };

    const clustersAvailable = availableClustersFromQuota(quota, quotaParams);
    const nodesAvailable = availableNodesFromQuota(quota, quotaParams);

    if (isMachinePool) {
      // TODO: backend does allow creating machine pool with 0 nodes!
      // But in most cases you want a machine type you do have quota for,
      // and if we allow >= 0, the highlight of available types becomes useless.
      // Can we improve the experience without blocking 0-node pool creation?
      return nodesAvailable >= 1;
    }

    if (isBYOC) {
      const minimumNodes = isMultiAz ? 3 : 2;
      return clustersAvailable > 0 && nodesAvailable >= minimumNodes;
    }

    return clustersAvailable >= 1;
  }

  render() {
    // getMachineTypes, isBYOC , and machineTypesByID are unused here, but it's needed so
    // it won't go into extraProps and then get to the DOM, generating a React warning.
    const {
      machineTypes,
      sortedMachineTypes,
      getMachineTypes,
      isBYOC,
      isMultiAz,
      machineTypesByID,
      quota,
      organization,
      input,
      meta: { error, touched },
      cloudProviderID,
      isMachinePool,
      inModal = false,
      ...extraProps
    } = this.props;

    const changeHandler = (_, value) => {
      input.onChange(value);
      this.onToggle(false);
    };

    const machineTypeSelectItem = (machineType) => {
      const hasQuota = this.hasQuotaForType(machineType.id);
      return (
        <SelectOption
          {...extraProps}
          key={machineType.id}
          id={`machineType.${machineType.id}`}
          value={machineType.id}
          description={machineTypeDescription(machineType)}
          isSelected={hasQuota && input.value === machineType.id}
          formValue={machineType.id}
        >
          {machineTypeLabel(machineType)}
        </SelectOption>
      );
    };

    /**
     * Partitions machine types by categories. Keeps relative order within each category.
     * @param machines - Array of machine_types API items.
     * @returns Array of [categoryLabel, categoryMachines] pairs.
     *   Some may contain 0 machines.
     */
    const groupedMachineTypes = (machines) => {
      const machineGroups = [];
      const byCategoryName = {};
      machineCategories.forEach(({ name, label }) => {
        const categoryMachines = [];
        byCategoryName[name] = categoryMachines;
        machineGroups.push([label, categoryMachines]);
      });

      machines.forEach((machineType) => {
        if (byCategoryName[machineType.category]) {
          byCategoryName[machineType.category].push(machineType);
        }
      });

      return machineGroups;
    };

    const groupedSelectItems = (machines) => {
      const machineGroups = groupedMachineTypes(machines);
      const selectGroups = machineGroups.map(([categoryLabel, categoryMachines]) => {
        if (categoryMachines.length > 0) {
          return (
            <SelectGroup label={categoryLabel} key={categoryLabel}>
              {categoryMachines.map(machineType => machineTypeSelectItem(machineType))}
            </SelectGroup>
          );
        }
        return null;
      }).filter(Boolean);
      return selectGroups;
    };

    const quotaMachineTypes = sortedMachineTypes.filter(type => (
      this.hasQuotaForType(type.id)
    ));

    let displayedMachineTypes = quotaMachineTypes;
    if (machineTypes.fulfilled && organization.fulfilled) {
      if (!isBYOC) {
        displayedMachineTypes = quotaMachineTypes.filter(type => (!type.ccs_only));
      }
      if (displayedMachineTypes.length === 0) {
        return (
          <div>
            {noMachineTypes}
          </div>
        );
      }
      const { isOpen } = this.state;
      const options = groupedSelectItems(displayedMachineTypes);
      // In the dropdown we put the machine type id in separate description row,
      // but the Select toggle doesn't support that, so combine both into one label.
      const selection = machineTypeFullLabel(
        displayedMachineTypes.find(machineType => machineType.id === input.value) || null,
      );
      return (
        <>
          {(touched && error) && (<span className="error">{error}</span>)}
          <Select
            variant="single"
            selections={selection}
            isOpen={isOpen}
            onToggle={this.onToggle}
            onSelect={changeHandler}
            maxHeight={inModal ? 300 : 600}
            menuAppendTo="parent"
          >
            {options}
          </Select>
        </>
      );
    }

    return machineTypes.error ? (
      <ErrorBox message="Error loading node types" response={machineTypes} />
    ) : (
      <>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading node types...</div>
      </>
    );
  }
}

MachineTypeSelection.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  sortedMachineTypes: PropTypes.array.isRequired,
  machineTypesByID: PropTypes.object.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  isMachinePool: PropTypes.bool.isRequired,
  inModal: PropTypes.bool,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
  quota: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    touched: PropTypes.bool,
  }).isRequired,
  // Plus extraprops passed by redux Field
};

export default MachineTypeSelection;
