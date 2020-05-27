// MachineTypeSelector renders a series of radio buttons for all available node types,
// allowing the user to select just one.
// It is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import { CpuIcon, MemoryIcon, ContainerNodeIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import FlatRadioButton from '../../../../../../common/FlatRadioButton';
import ErrorBox from '../../../../../../common/ErrorBox';
import { humanizeValueWithUnit } from '../../../../../../../common/units';

const machineTypeIcon = (machineTypeCategory) => {
  switch (machineTypeCategory) {
    case 'memory_optimized':
      return <MemoryIcon size="lg" />;
    case 'compute_optimized':
      return <CpuIcon size="lg" />;
    case 'general_purpose':
      return <ContainerNodeIcon size="lg" />;
    default:
      return <ContainerNodeIcon size="lg" />;
  }
};

class MachineTypeSelection extends React.Component {
  componentDidMount() {
    const {
      machineTypes, organization,
    } = this.props;

    if (machineTypes.fulfilled && organization.fulfilled) {
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

  hasQuotaForType(machineType) {
    const {
      isMultiAz, organization, quota, isBYOC, cloudProviderID,
    } = this.props;
    if (!organization.fulfilled) {
      return false;
    }
    const infra = isBYOC ? 'byoc' : 'rhInfra';
    const available = quota.clustersQuota[cloudProviderID][infra][isMultiAz ? 'multiAz' : 'singleAz'][machineType] || 0;
    return available > 0;
  }

  render() {
    // getMachineTypes and isBYOC is unused here, but it's needed so it won't
    // go into extraProps and then get to the DOM, generating a React warning.
    const {
      machineTypes,
      sortedMachineTypes,
      getMachineTypes,
      isBYOC,
      isMultiAz,
      quota,
      organization,
      input,
      meta: { error, touched },
      cloudProviderID,
      ...extraProps
    } = this.props;

    const changeHandler = (value) => {
      input.onChange(value);
    };

    const machineTypeRadio = (machineType) => {
      const humanizedMemory = humanizeValueWithUnit(machineType.memory.value,
        machineType.memory.unit);
      const labelTitle = `${machineType.cpu.value} ${machineType.cpu.unit} ${humanizedMemory.value} ${humanizedMemory.unit} RAM`;

      const hasQuota = this.hasQuotaForType(machineType.id);
      let { name } = machineType;
      const nameParts = name.split(' - '); // Assuming the formatting on the backend side is "type - category". If the backend changes the formatting, this assumption will break
      name = (
        <>
          <div>
            {nameParts[0]}
          </div>
          <div>
            {nameParts[1]}
          </div>
        </>
      );
      return (
        <FlatRadioButton
          {...extraProps}
          key={machineType.id}
          id={`machineTypeRadio.${machineType.id}`}
          value={machineType.id}
          isDisabled={!hasQuota}
          tooltip={!hasQuota && 'You do not have quota for this node type. Contact sales to purchase additional quota.'}
          isSelected={hasQuota && input.value === machineType.id}
          titleText={labelTitle}
          secondaryText={name}
          icon={machineTypeIcon(machineType.category)}
          onChange={changeHandler}
        />
      );
    };
    if (machineTypes.fulfilled && organization.fulfilled) {
      if (sortedMachineTypes.length === 0) {
        return <div>No supported machine types</div>;
      }
      return (
        <>
          {(touched && error) && (<span className="error">{error}</span>)}
          <div className="flat-radio-buttons-flex-container">
            {sortedMachineTypes.map(type => machineTypeRadio(type))}
          </div>
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
  isMultiAz: PropTypes.bool.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  quota: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    touched: PropTypes.bool,
  }).isRequired,
  // Plus extraprops passed by redux Field
};

export default MachineTypeSelection;
