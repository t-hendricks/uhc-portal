// PersistentStorageDropdown shows a selection of storage options
// for setting on the installed a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
  Tooltip,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ErrorBox from '../../../common/ErrorBox';
import { humanizeValueWithUnitGiB } from '../../../../common/units';
import { availableQuota, quotaTypes } from '../quotaSelectors';
import { filterPersistentStorageValuesByQuota } from './PersistentStorageDropDownHelper';
import { noQuotaTooltip } from '../../../../common/helpers';

class PersistentStorageDropdown extends React.Component {
  componentDidMount() {
    const {
      getPersistentStorage, persistentStorageValues,
    } = this.props;
    if (!persistentStorageValues.pending
      && !persistentStorageValues.fulfilled
      && !persistentStorageValues.error) {
      // fetch persistent storage from server only if needed.
      getPersistentStorage();
    }
  }

  render() {
    const {
      input, persistentStorageValues, disabled, currentValue, quotaList,
      billingModel, product, cloudProviderID, isBYOC, isMultiAZ,
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
      const storageQuota = availableQuota(quotaList, {
        resourceType: quotaTypes.STORAGE,
        billingModel,
        product,
        cloudProviderID,
        isBYOC,
        isMultiAZ,
        resourceName: 'gp2',
      });

      const filteredStorageValues = filterPersistentStorageValuesByQuota(currentValue,
        persistentStorageValues, storageQuota);
      const notEnoughQuota = filteredStorageValues.values.length <= 1;
      const isDisabled = disabled || notEnoughQuota;

      const formSelect = (
        <FormSelect
          className="quota-dropdown"
          aria-label="Persistent Storage"
          isDisabled={isDisabled}
          {...input}
        >
          {filteredStorageValues.values.map(value => storageOption(value))}
        </FormSelect>
      );

      if (notEnoughQuota) {
        return (
          <Tooltip
            content={noQuotaTooltip}
            position="right"
          >
            <div>
              {formSelect}
            </div>
          </Tooltip>
        );
      }
      return formSelect;
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

PersistentStorageDropdown.propTypes = {
  getPersistentStorage: PropTypes.func.isRequired,
  persistentStorageValues: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  quotaList: PropTypes.object.isRequired,
  currentValue: PropTypes.number,
  billingModel: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  isMultiAZ: PropTypes.bool.isRequired,
};

export default PersistentStorageDropdown;
