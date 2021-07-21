// CloudRegionComboBox shows a selection of regions for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import get from 'lodash/get';

import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ErrorBox from '../../../../../../common/ErrorBox';
import './CloudRegionComboBox.scss';

class CloudRegionComboBox extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      isMultiAz, input, cloudProviderID, cloudProviders,
    } = this.props;

    const selectedRegionData = get(cloudProviders, 'providers[cloudProviderID].regions[input.value]', {});

    if ((isMultiAz && !prevProps.isMultiAz) && !selectedRegionData.supports_multi_az) {
      input.onChange(cloudProviderID === 'aws' ? 'us-east-1' : 'us-east1');
    }
  }

  onChange = (value, event) => {
    const { input: { onChange }, handleCloudRegionChange } = this.props;
    if (handleCloudRegionChange) {
      handleCloudRegionChange();
    }
    onChange(event, value); // redux form has the parameters the other way around from PF
  };

  render() {
    const {
      input, availableRegions, cloudProviders, disabled, isMultiAz,
    } = this.props;

    const regionOption = region => (
      <FormSelectOption
        key={region.id}
        value={region.id}
        label={`${region.id}, ${region.display_name}`}
        isDisabled={isMultiAz && !region.supports_multi_az}
      />
    );

    if (cloudProviders.fulfilled) {
      return (
        <FormSelect
          className="cloud-region-combo-box"
          aria-label="Region"
          isDisabled={disabled}
          {...input}
          onChange={this.onChange}
        >
          {availableRegions.map(region => regionOption(region))}
        </FormSelect>
      );
    }

    return cloudProviders.error ? (
      <ErrorBox message="Error loading region list" response={cloudProviders} />
    ) : (
      <>
        <div className="spinner-fit-container"><Spinner /></div>
        <div className="spinner-loading-text">Loading region list...</div>
      </>
    );
  }
}

CloudRegionComboBox.propTypes = {
  cloudProviderID: PropTypes.string.isRequired,
  availableRegions: PropTypes.array.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  isMultiAz: PropTypes.bool,
  handleCloudRegionChange: PropTypes.func,
  // Plus extraprops passed by react-bootstrap / patternfly-react FormControl
};

export default CloudRegionComboBox;
