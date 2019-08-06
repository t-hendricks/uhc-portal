// MachineTypeSelector renders a series of radio buttons for all available node types,
// allowing the user to select just one.
// It is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import { Gallery, GalleryItem } from '@patternfly/react-core';
import { CpuIcon, MemoryIcon, ContainerNodeIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import FlatRadioButton from '../../../../common/FlatRadioButton';
import ErrorBox from '../../../../common/ErrorBox';
import { humanizeValueWithUnit } from '../../../../../common/units';
import sortMachineTypes from './sortMachineTypes';

const machineTypeIcon = (machineType) => {
  const machineTypeFamily = machineType.charAt(0);
  switch (machineTypeFamily) {
    case 'r':
      return <MemoryIcon size="lg" />;
    case 'c':
      return <CpuIcon size="lg" />;
    case 'm':
      return <ContainerNodeIcon size="lg" />;
    default:
      return null;
  }
};

class MachineTypeSelection extends React.Component {
  state = {
    currentValue: '',
  }

  componentDidMount() {
    const { getMachineTypes, machineTypes } = this.props;
    if (!machineTypes.fulfilled) {
      // Don't let the user submit if we couldn't get machine types yet.
      this.setInvalidValue();
    }
    if (!machineTypes.pending && !machineTypes.fulfilled) {
      // fetch cloud providers from server only if needed.
      getMachineTypes();
    }

    if (machineTypes.fulfilled) {
      this.setDefaultValue();
    }
  }

  componentDidUpdate() {
    const { machineTypes } = this.props;
    const { currentValue } = this.state;
    if (machineTypes.error || machineTypes.pending || !this.hasQuota(currentValue)) {
      // Don't let the user submit if we couldn't get machine types.
      this.setInvalidValue();
    }

    if (currentValue === '' && machineTypes.fulfilled) {
      // we got the machine types, and the user hasn't selected one yet - set to default.
      this.setDefaultValue();
    }

    // if some external param changed, like MultiAz, and we no longer have quota
    // for the selected instance type, we need to unselect it, and mark ourselves as invalid.
    if (currentValue && !this.hasQuota(currentValue)) {
      // this setState is guarded so the linter error can be ignored.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ currentValue: '' });
    }
  }

  setDefaultValue() {
    // Find the first machineType we have quota for, and set it as default
    const { machineTypes, input } = this.props;
    const defaultType = machineTypes.types.find(type => this.hasQuota(type.id));
    if (defaultType) {
      this.setState({ currentValue: defaultType.id });
      input.onChange(defaultType.id);
    }
  }

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { input } = this.props;
    input.onChange('');
  }

  hasQuota(machineType) {
    const { isMultiAz, quota } = this.props;
    if (!quota.fulfilled) {
      return false;
    }
    const available = quota.quotaList.nodeQuota.rhInfra[isMultiAz ? 'multiAz' : 'singleAz'][machineType] || 0;
    return available > 0;
  }

  render() {
    // getMachineTypes is unused here, but it's needed so it won't
    // go into extraProps and then get to the DOM, generating a React warning.
    const {
      machineTypes,
      getMachineTypes,
      isMultiAz,
      quota,
      input,
      meta: { error, touched },
      ...extraProps
    } = this.props;
    const { currentValue } = this.state;


    const changeHandler = (value) => {
      this.setState({ currentValue: value });
      input.onChange(value);
    };

    const machineTypeRadio = (machineType) => {
      const humanizedMemory = humanizeValueWithUnit(machineType.memory.value,
        machineType.memory.unit);
      const labelTitle = `${machineType.cpu.value} ${machineType.cpu.unit} ${humanizedMemory.value} ${humanizedMemory.unit} RAM`;

      const hasQuota = this.hasQuota(machineType.id);
      return (
        <GalleryItem key={machineType.id}>
          <FlatRadioButton
            {...extraProps}
            id={`machineTypeRadio.${machineType.id}`}
            value={machineType.id}
            isDisabled={!hasQuota}
            isSelected={hasQuota && currentValue === machineType.id}
            titleText={labelTitle}
            secondaryText={machineType.name}
            icon={machineTypeIcon(machineType.id)}
            onChange={changeHandler}
          />
        </GalleryItem>
      );
    };

    if (machineTypes.fulfilled) {
      machineTypes.types.sort(sortMachineTypes);
      return (
        <div className="node-type-input">
          <div className="node-type-label">Node type</div>
          {(touched && error) && (<span className="error">{error}</span>)}
          <Gallery gutter="sm">
            {machineTypes.types.map(type => machineTypeRadio(type))}
          </Gallery>
        </div>
      );
    }

    return machineTypes.error ? (
      <ErrorBox message="Error loading node types" response={machineTypes} />
    ) : (
      <React.Fragment>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading node types..</div>
      </React.Fragment>
    );
  }
}

MachineTypeSelection.propTypes = {
  input: PropTypes.shape({ onChange: PropTypes.func.isRequired }).isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  quota: PropTypes.object.isRequired,
  // Plus extraprops passed by redux Field
};

export default MachineTypeSelection;
