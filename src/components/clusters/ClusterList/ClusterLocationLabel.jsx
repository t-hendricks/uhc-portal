// ClusterLocationLabel shows the location of the cluster in the form of
// "Cloud Provider (human readable location name)".

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';

class ClusterLocationLabel extends React.Component {
  componentDidMount() {
    const { getCloudProviders, cloudProviders } = this.props;
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
  }

  render() {
    const { regionID, cloudProviderID, cloudProviders } = this.props;
    if (cloudProviders.fulfilled
        && cloudProviders.providers[cloudProviderID]
        && cloudProviders.providers[cloudProviderID].regions
        && cloudProviders.providers[cloudProviderID].regions[regionID]) {
      return (
        <React.Fragment>
          {cloudProviders.providers[cloudProviderID].name.toUpperCase()}
          {` ${cloudProviders.providers[cloudProviderID].regions[regionID].display_name}`}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {cloudProviderID.toUpperCase()}
        {` (${regionID})`}
      </React.Fragment>
    );
  }
}

ClusterLocationLabel.propTypes = {
  regionID: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  cloudProviders: state.cloudProviders.cloudProviders,
});

const mapDispatchToProps = {
  getCloudProviders: cloudProviderActions.getCloudProviders,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterLocationLabel);
