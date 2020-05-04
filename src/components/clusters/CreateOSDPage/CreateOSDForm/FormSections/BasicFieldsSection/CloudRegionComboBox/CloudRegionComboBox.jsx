// CloudRegionComboBox shows a selection of regions for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import ErrorBox from '../../../../../../common/ErrorBox';

function CloudRegionComboBox({
  input, cloudProviderID, cloudProviders, disabled,
}) {
  const regionOption = region => (
    <FormSelectOption
      key={region.id}
      value={region.id}
      label={`${region.id}, ${region.display_name}`}
    />
  );

  if (cloudProviders.fulfilled) {
    const regions = (Object.values(cloudProviders.providers[cloudProviderID].regions))
      .filter(region => region.enabled);
    return (
      <FormSelect
        className="cloud-region-combo-box"
        aria-label="Region"
        isDisabled={disabled}
        {...input}
      >
        {regions.map(region => regionOption(region))}
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

CloudRegionComboBox.propTypes = {
  cloudProviderID: PropTypes.string.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  // Plus extraprops passed by react-bootstrap / patternfly-react FormControl
};

export default CloudRegionComboBox;
