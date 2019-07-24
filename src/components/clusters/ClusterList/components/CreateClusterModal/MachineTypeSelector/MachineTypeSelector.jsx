// MachineTypeSelector renders a series of radio buttons for all available node types,
// allowing the user to select just one.
// It is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Gallery, GalleryItem } from '@patternfly/react-core';
import { Spinner } from 'patternfly-react';
import ErrorBox from '../../../../../common/ErrorBox';
import { humanizeValueWithUnit } from '../../../../../../common/units';

class MachineTypeSelector extends React.Component {
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
  }

  componentDidUpdate() {
    const { machineTypes } = this.props;
    if (machineTypes.error || machineTypes.pending) {
      // Don't let the user submit if we couldn't get machine types.
      this.setInvalidValue();
    }
  }

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { input } = this.props;
    input.onChange('');
  }

  render() {
    // getMachineTypes is unused here, but it's needed so it won't
    // go into extraProps and then get to the DOM, generating a React warning.
    const {
      cloudProviderID, machineTypes, getMachineTypes, input, meta: { error, touched }, ...extraProps
    } = this.props;

    const changeHandler = (_, event) => {
      input.onChange(event.target.value);
    };

    const machineTypeRadio = (machineType) => {
      const humanizedMemory = humanizeValueWithUnit(machineType.memory.value,
        machineType.memory.unit);
      const labelTitle = `${machineType.cpu.value} ${machineType.cpu.unit} ${humanizedMemory.value} ${humanizedMemory.unit} RAM`;
      return (
        <GalleryItem key={machineType.id}>
          <Radio
            {...input}
            {...extraProps}
            id={`machineTypeRadio.${machineType.id}`}
            value={machineType.id}
            label={(
              <React.Fragment>
                <h4>
                  {labelTitle}
                </h4>
                {machineType.name}
              </React.Fragment>
            )}
            onChange={changeHandler}
          />
        </GalleryItem>
      );
    };

    if (machineTypes.fulfilled) {
      return (
        <div className="node-type-input">
          <div className="node-type-label">Node type</div>
          {(touched && error) && (<span className="error">{error}</span>)}
          <Gallery>
            {machineTypes.types.map(type => machineTypeRadio(type))}
          </Gallery>
        </div>
      );
    }

    return machineTypes.error ? (
      <ErrorBox message="Error loading node types" response={machineTypes} />
    ) : (
      <React.Fragment>
        <Spinner size="sm" inline loading />
        Loading node types..
      </React.Fragment>
    );
  }
}

MachineTypeSelector.propTypes = {
  input: PropTypes.shape({ onChange: PropTypes.func.isRequired }).isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  // Plus extraprops passed by redux Field
};

export default MachineTypeSelector;
