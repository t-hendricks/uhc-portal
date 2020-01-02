// CloudRegionComboBox shows a selection of regions for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import ErrorBox from '../../../common/ErrorBox';
import { cloudProviderActions } from '../../../../redux/actions/cloudProviderActions';

class CloudRegionComboBox extends React.Component {
  componentDidMount() {
    const { getCloudProviders, cloudProviders } = this.props;

    if (!cloudProviders.pending && !cloudProviders.fulfilled && !cloudProviders.error) {
      // fetch cloud providers from server only if needed.
      getCloudProviders();
    }
  }

  render() {
    // getCloudProviders is unused here, but it's needed so it won't
    // go into extraProps and then get to the DOM, generating a React warning.
    const {
      input, cloudProviderID, cloudProviders, disabled,
    } = this.props;
    const regionOption = region => (
      <FormSelectOption
        key={region.id}
        value={region.id}
        label={`${region.id}, ${region.display_name}`}
      />
    );

    if (cloudProviders.fulfilled) {
      const regions = Object.values(cloudProviders.providers[cloudProviderID].regions);
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
}

CloudRegionComboBox.propTypes = {
  cloudProviderID: PropTypes.string.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  // Plus extraprops passed by react-bootstrap / patternfly-react FormControl
};

const mapStateToProps = state => ({
  cloudProviders: state.cloudProviders.cloudProviders,
});

const mapDispatchToProps = {
  getCloudProviders: cloudProviderActions.getCloudProviders,
};

export { CloudRegionComboBox as DisconnectedCloudRegionComboBox };

export default connect(mapStateToProps, mapDispatchToProps)(CloudRegionComboBox);
