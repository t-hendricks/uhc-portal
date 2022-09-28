// ClusterLocationLabel shows the location of the cluster in the form of
// "Cloud Provider (location name)".

import React from 'react';
import PropTypes from 'prop-types';

class ClusterLocationLabel extends React.Component {
  componentDidMount() {
    const { getCloudProviders, cloudProviders } = this.props;
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
  }

  render() {
    const { regionID, cloudProviderID, cloudProviders } = this.props;
    const provider =
      cloudProviders.fulfilled && cloudProviders.providers[cloudProviderID]
        ? cloudProviders.providers[cloudProviderID].display_name
        : cloudProviderID.toUpperCase();

    return (
      <>
        {provider}
        {regionID !== 'N/A' && ` (${regionID})`}
      </>
    );
  }
}

ClusterLocationLabel.propTypes = {
  regionID: PropTypes.string.isRequired, // parent component passes N/A when unknown
  cloudProviderID: PropTypes.string.isRequired, // parent component passes N/A when unknown
  getCloudProviders: PropTypes.func.isRequired,
  cloudProviders: PropTypes.object.isRequired,
};

export default ClusterLocationLabel;
