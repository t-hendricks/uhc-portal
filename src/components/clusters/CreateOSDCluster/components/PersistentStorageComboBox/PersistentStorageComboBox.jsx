// PersistentStorageComboBox shows a selection of storage options
// for setting on the installed a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import ErrorBox from '../../../../common/ErrorBox';
import { humanizeValueWithUnitGiB } from '../../../../../common/units';

class PersistentStorageComboBox extends React.Component {
  state = {
    isExpanded: false,
  };

  componentDidMount() {
    const { getPersistentStorage, persistentStorageValues } = this.props;
    if (!persistentStorageValues.fulfilled) {
      // Don't let the user submit if we couldn't get persistent storage yet.
      this.setInvalidValue();
    }
    if (!persistentStorageValues.pending && !persistentStorageValues.fulfilled) {
      // fetch persistent storage from server only if needed.
      getPersistentStorage();
    }
  }

  componentDidUpdate() {
    const { persistentStorageValues } = this.props;
    if (persistentStorageValues.error || persistentStorageValues.pending) {
      // Don't let the user submit if we couldn't get persistent storage.
      this.setInvalidValue();
    }
  }

  onSelect = (event, selection) => {
    const { input } = this.props;
    this.setState({ isExpanded: false });
    input.onChange(selection);
  };

  onToggle = (isExpanded) => {
    this.setState({
      isExpanded,
    });
  };

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { input } = this.props;
    input.onChange('');
  }

  render() {
    const {
      input, persistentStorageValues, disabled,
    } = this.props;
    const {
      isExpanded,
    } = this.state;
    // Set up options for storage values
    const storageOption = (value) => {
      // value is a tuple of {value, unit}
      const valueWithUnit = humanizeValueWithUnitGiB(value.value);
      // Values passed in the select are *always* in bytes, but we display them
      // in a humanize form.

      return (
        <SelectOption
          key={value.value.toString()}
          value={value.value.toString()}
        >
          {`${valueWithUnit.value} ${valueWithUnit.unit}`}
        </SelectOption>
      );
    };

    if (persistentStorageValues.fulfilled) {
      return (
        <Select
          className="quota-combo-box"
          variant={SelectVariant.single}
          aria-label="Persistent Storage"
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          selections={input.value}
          isExpanded={isExpanded}
          disabled={disabled}
        >
          {persistentStorageValues.values.map(value => storageOption(value))}
        </Select>
      );
    }

    return persistentStorageValues.error ? (
      <ErrorBox message="Error loading persistent storage list" response={persistentStorageValues} />
    ) : (
      <React.Fragment>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading persistent storage list...</div>
      </React.Fragment>
    );
  }
}

PersistentStorageComboBox.propTypes = {
  getPersistentStorage: PropTypes.func.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default PersistentStorageComboBox;
