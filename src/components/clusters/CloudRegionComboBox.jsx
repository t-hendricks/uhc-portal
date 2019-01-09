// CloudRegionComboBox shows a selection of regions for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, Spinner } from 'patternfly-react';
import { cloudProviderActions } from '../../redux/actions/cloudProviderActions';

class CloudRegionComboBox extends React.Component {
  componentDidMount() {
    const { getCloudProviders, cloudProviders } = this.props;
    if (!cloudProviders.fulfilled) {
      // Don't let the user submit if we couldn't get cloud provider regions yet.
      this.setInvalidValue();
    }
    if (!cloudProviders.pending && !cloudProviders.fulfilled) {
      // fetch cloud providers from server only if needed.
      getCloudProviders();
    }
  }

  componentDidUpdate() {
    const { cloudProviders } = this.props;
    if (cloudProviders.error || cloudProviders.pending) {
      // Don't let the user submit if we couldn't get cloud provider regions.
      this.setInvalidValue();
    }
  }

  setInvalidValue() {
    // Tell redux form the current value of this field is empty.
    // This will cause it to not pass validation if it is required.
    const { onChange } = this.props;
    onChange('');
  }

  render() {
    // getCloudProviders is unused here, but it's needed so it won't
    // go into extraProps and then get to the DOM, generating a React warning.
    const {
      cloudProviderID, cloudProviders, getCloudProviders, ...extraProps
    } = this.props;
    const regionOption = region => (
      <option value={region.id} key={region.id}>
        {region.id}
        {', '}
        {region.display_name}
      </option>);

    if (cloudProviders.fulfilled) {
      const regions = Object.values(cloudProviders.providers[cloudProviderID].regions);
      return (
        <select {...extraProps}>
          {regions.map(region => regionOption(region))}
        </select>
      );
    }

    return cloudProviders.error ? (
      <Alert>
        <span>{`Error loading region list: ${cloudProviders.errorMessage}`}</span>
      </Alert>
    ) : (
      <React.Fragment>
        <Spinner size="sm" inline loading />
        Loading region list...
      </React.Fragment>
    );
  }
}

CloudRegionComboBox.propTypes = {
  cloudProviderID: PropTypes.string.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
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
