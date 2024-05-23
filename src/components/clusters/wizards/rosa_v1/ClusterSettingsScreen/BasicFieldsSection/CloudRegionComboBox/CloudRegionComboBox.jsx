// CloudRegionComboBox shows a selection of regions for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

import { AWS_DEFAULT_REGION } from '~/components/clusters/wizards/rosa_v1/createOSDInitialValues';

import ErrorBox from '../../../../../../common/ErrorBox';

import './CloudRegionComboBox.scss';

class CloudRegionComboBox extends React.Component {
  componentDidMount() {
    const { input, availableRegions } = this.props;
    const { value: initialRegion } = input;
    const isInitialRegionAvailable = availableRegions.find((region) => region.id === initialRegion);

    if (!initialRegion || (initialRegion && !isInitialRegionAvailable)) {
      const [firstAvailableRegion] = availableRegions;
      this.onChange(firstAvailableRegion.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { isMultiAz, input, cloudProviderID, cloudProviders } = this.props;

    const regionData = cloudProviders?.providers?.[cloudProviderID]?.regions?.[input.value];
    const supportsMultiAz = regionData?.supports_multi_az ?? true;

    if (isMultiAz && !prevProps.isMultiAz && !supportsMultiAz) {
      this.onChange(AWS_DEFAULT_REGION);
    }
  }

  onChange = (value) => {
    const {
      input: { onChange },
      handleCloudRegionChange,
    } = this.props;
    onChange(value);
    if (handleCloudRegionChange) {
      handleCloudRegionChange();
    }
  };

  render() {
    const { input, availableRegions, cloudProviders, disabled, isMultiAz } = this.props;

    const regionOption = (region) => (
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
          onChange={(_event, value) => this.onChange(value)}
        >
          {availableRegions.map((region) => regionOption(region))}
        </FormSelect>
      );
    }

    return cloudProviders.error ? (
      <ErrorBox message="Error loading region list" response={cloudProviders} />
    ) : (
      <>
        <div className="spinner-fit-container">
          <Spinner />
        </div>
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
