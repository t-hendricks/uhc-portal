// PersistentStorageComboBox shows a selection of storage options
// for setting on the installed a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import get from 'lodash/get';
import ErrorBox from '../../../../common/ErrorBox';
import { humanizeValueWithUnitGiB, parseValueWithUnit } from '../../../../../common/units';

const baseClusterQuota = 107374182400; // The base cluster storage quota is 100 GiB (in bytes).

class PersistentStorageComboBox extends React.Component {
  componentDidMount() {
    const {
      getPersistentStorage, persistentStorageValues, organization, getOrganizationAndQuota,
    } = this.props;
    if (!organization.fulfilled && !organization.pending) {
      getOrganizationAndQuota();
    }

    if (!persistentStorageValues.pending
      && !persistentStorageValues.fulfilled
      && !persistentStorageValues.error) {
      // fetch persistent storage from server only if needed.
      getPersistentStorage();
    }
  }

  filterPersistentStorageValuesByQuota() {
    const { persistentStorageValues, quota } = this.props;
    // Get quota for persistent storage.
    // this quota is "on top" of the base cluster quota of 100 GiB.
    const persistentStorageQuota = get(quota, 'persistentStorageQuota', 0);
    const quotaInBytes = parseValueWithUnit(persistentStorageQuota, 'GiB');
    const result = { ...persistentStorageValues };
    result.values = result.values.filter(el => el.value <= quotaInBytes + baseClusterQuota);
    return result;
  }

  render() {
    const {
      input, persistentStorageValues, disabled,
    } = this.props;

    // Set up options for storage values
    const storageOption = (value) => {
      // value is a tuple of {value, unit}
      const valueWithUnit = humanizeValueWithUnitGiB(value.value);
      const strValue = value.value.toString();
      // Values passed in the select are *always* in bytes, but we display them
      // in a humanize form.

      return (
        <FormSelectOption
          key={strValue}
          value={strValue}
          label={`${valueWithUnit.value} ${valueWithUnit.unit}`}
        />
      );
    };

    if (persistentStorageValues.fulfilled) {
      const filteredStorageValues = this.filterPersistentStorageValuesByQuota();
      return (
        <FormSelect
          className="quota-combo-box"
          aria-label="Persistent Storage"
          isDisabled={disabled}
          {...input}
        >
          {filteredStorageValues.values.map(value => storageOption(value))}
        </FormSelect>
      );
    }

    return persistentStorageValues.error ? (
      <ErrorBox message="Error loading persistent storage list" response={persistentStorageValues} />
    ) : (
      <>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading persistent storage list...</div>
      </>
    );
  }
}

PersistentStorageComboBox.propTypes = {
  getPersistentStorage: PropTypes.func.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  quota: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
};

export default PersistentStorageComboBox;
