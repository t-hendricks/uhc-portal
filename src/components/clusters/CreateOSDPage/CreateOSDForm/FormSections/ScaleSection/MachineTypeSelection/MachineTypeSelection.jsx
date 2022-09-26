// MachineTypeSelection renders a series of radio buttons for all available node types,
// allowing the user to select just one.
// It is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Select, SelectGroup, SelectOption } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ErrorBox from '../../../../../../common/ErrorBox';
import PopoverHint from '../../../../../../common/PopoverHint';
import { humanizeValueWithUnit } from '../../../../../../../common/units';
import { noMachineTypes } from '../../../../../../../common/helpers';
import {
  availableClustersFromQuota,
  availableNodesFromQuota,
} from '../../../../../common/quotaSelectors';
import { normalizedProducts, billingModels } from '../../../../../../../common/subscriptionTypes';
import { DEFAULT_FLAVOUR_ID } from '../../../../../../../redux/actions/flavourActions';
import { constants } from '../../../CreateOSDFormConstants';
import sortMachineTypes, { machineCategories } from './sortMachineTypes';

/** Returns useful info about the machine type - CPUs, RAM, [GPUs]. */
const machineTypeLabel = (machineType) => {
  if (!machineType) {
    return '';
  }
  const humanizedMemory = humanizeValueWithUnit(machineType.memory.value, machineType.memory.unit);
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

  // Default selection scenarios:
  // - First time, default is available => select it.
  // - First time, default is not listed (due to quota or ccs_only) => leave placeholder ''.
  // - Error fetching flavours (very unlikely) => no need to show error to user, leave placeholder.
  // - User selected a type manually, then changed CSS or multiAz, choice still listed.
  //   => keep it.
  // - User selected a type manually, then changed CSS or multiAz, choice no longer listed.
  //   => restore placeholder '' to force choice (even if have quota for default).
  //   - componentDidUpdate running in this situation (e.g. onToggle) should not select default.
  // - Something was selected (either automatically or manually), then changed cloud provider.
  //   CloudProviderSelectionField does `change('machine_type', '')` => same as first time.

  componentDidMount() {
    const {
      flavours,
      getDefaultFlavour,
      machine_type: { input },
    } = this.props;

    if (!flavours.fulfilled && !flavours.pending) {
      getDefaultFlavour();
    }

    if (!input.value && this.dataReady()) {
      this.setDefaultValue();
    }

    // If user had made a choice, then some external param changed like CCS/MultiAz,
    // (we can get here on mount after switching wizard steps)
    // and selected type is no longer availble, force user to choose again.
    if (input.value && this.dataReady() && !this.isTypeAvailable(input.value)) {
      this.setInvalidValue();
    }
  }

  componentDidUpdate() {
    const {
      machine_type: { input },
    } = this.props;
    if (!input.value && this.dataReady()) {
      this.setDefaultValue();
    }

    // If user had made a choice, then some external param changed,
    // and selected type is no longer availble, force user to choose again.
    if (input.value && this.dataReady() && !this.isTypeAvailable(input.value)) {
      this.setInvalidValue();
    }
  }

  setDefaultValue() {
    // Select the type suggested by backend, if possible.
    const {
      cloudProviderID,
      flavours,
      machine_type: { input },
      machine_type_force_choice: { input: forceChoiceInput },
    } = this.props;

    if (forceChoiceInput.value) {
      return; // Keep untouched, wait for user to choose.
    }

    const defaultType = flavours.byID[DEFAULT_FLAVOUR_ID]?.[cloudProviderID]?.compute_instance_type;
    if (this.isTypeAvailable(defaultType)) {
      input.onChange(defaultType);
    }
    // If it's not available, don't select anything, wait for user to choose.
  }

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass 'required' validation.
    const {
      machine_type: { input },
      machine_type_force_choice: { input: forceChoiceInput },
    } = this.props;
    // Order might matter here!
    // If we cleared to '' before force_choice, componentDidUpdate could select new value(?)
    forceChoiceInput.onChange(true);
    input.onChange('');
  }

  onToggle = (isOpen) => {
    this.setState({
      isOpen,
    });
  };

  /** Checks whether required data arrived. */
  dataReady() {
    const { flavours, machineTypes, organization } = this.props;
    return (
      // Wait for quota_cost.  Presently, it's fetched together with organization.
      organization.fulfilled &&
      machineTypes.fulfilled &&
      // Tolerate flavours error gracefully.
      (flavours.fulfilled || flavours.error)
    );
  }

  /**
   * Checks whether type can be offered, based on quota and ccs_only.
   * Returns false if necessary data not fulfilled yet.
   */
  isTypeAvailable(machineTypeID) {
    const {
      machineTypes,
      quota,
      cloudProviderID,
      isBYOC,
      isMultiAz,
      isMachinePool,
      product,
      billingModel,
    } = this.props;

    if (!this.dataReady()) {
      return false;
    }

    const machineType = machineTypes.typesByID[machineTypeID];
    if (!machineType) {
      return false;
    }
    const resourceName = machineType.generic_name;

    if (!isBYOC && machineType.ccs_only) {
      return false;
    }

    const quotaParams = {
      product,
      cloudProviderID,
      isBYOC,
      isMultiAz,
      resourceName,
      billingModel,
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
    // getMachineTypes and isBYOC are unused here, but it's needed so
    // it won't go into extraProps and then get to the DOM, generating a React warning.
    const {
      machineTypes,
      getMachineTypes,
      isBYOC,
      isMultiAz,
      quota,
      organization,
      machine_type: {
        input,
        meta: { error, touched },
      },
      machine_type_force_choice: { input: forceChoiceInput },
      cloudProviderID,
      isMachinePool,
      inModal = false,
      ...extraProps
    } = this.props;

    const changeHandler = (_, value) => {
      input.onChange(value);
      forceChoiceInput.onChange(false);
      this.onToggle(false);
    };

    const machineTypeSelectItem = (machineType) => {
      const hasQuota = this.isTypeAvailable(machineType.id);
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
      const selectGroups = machineGroups
        .map(([categoryLabel, categoryMachines]) => {
          if (categoryMachines.length > 0) {
            return (
              <SelectGroup label={categoryLabel} key={categoryLabel}>
                {categoryMachines.map((machineType) => machineTypeSelectItem(machineType))}
              </SelectGroup>
            );
          }
          return null;
        })
        .filter(Boolean);
      return selectGroups;
    };

    const sortedMachineTypes = sortMachineTypes(machineTypes, cloudProviderID);
    const filteredMachineTypes = sortedMachineTypes.filter((type) => this.isTypeAvailable(type.id));

    if (this.dataReady()) {
      if (filteredMachineTypes.length === 0) {
        return <div>{noMachineTypes}</div>;
      }
      const { isOpen } = this.state;
      const options = groupedSelectItems(filteredMachineTypes);
      // In the dropdown we put the machine type id in separate description row,
      // but the Select toggle doesn't support that, so combine both into one label.
      const selection = machineTypeFullLabel(
        filteredMachineTypes.find((machineType) => machineType.id === input.value) || null,
      );
      return (
        <FormGroup
          label="Compute node instance type"
          isRequired
          validated={touched && error ? 'error' : 'default'}
          isHelperTextBeforeField
          helperTextInvalid={touched && error}
          fieldId="node_type"
          labelIcon={<PopoverHint hint={constants.computeNodeInstanceTypeHint} />}
        >
          <Select
            variant="single"
            selections={selection}
            isOpen={isOpen}
            placeholderText="Select instance type"
            onToggle={this.onToggle}
            onSelect={changeHandler}
            maxHeight={inModal ? 300 : 600}
            menuAppendTo="parent"
          >
            {options}
          </Select>
        </FormGroup>
      );
    }

    return machineTypes.error ? (
      <ErrorBox message="Error loading node types" response={machineTypes} />
    ) : (
      <>
        <div className="spinner-fit-container">
          <Spinner />
        </div>
        <div className="spinner-loading-text">Loading node types...</div>
      </>
    );
  }
}

const inputMetaPropTypes = PropTypes.shape({
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    touched: PropTypes.bool,
  }).isRequired,
});

MachineTypeSelection.propTypes = {
  machine_type: inputMetaPropTypes.isRequired,
  machine_type_force_choice: inputMetaPropTypes.isRequired,
  getDefaultFlavour: PropTypes.func.isRequired,
  flavours: PropTypes.object.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  isMachinePool: PropTypes.bool.isRequired,
  inModal: PropTypes.bool,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
  quota: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  // Plus extraprops passed by redux Field
};

export default MachineTypeSelection;
