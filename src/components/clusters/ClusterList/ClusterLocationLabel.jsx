// ClusterLocationLabel shows the location of the cluster in the form of
// "Cloud Provider (human readable location name)".

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';

const awsRegions = {
  'us-east-2': 'US East (Ohio)',
  'us-east-1': 'US East (N. Virginia)',
  'us-west-1': 'US West (N. California)',
  'us-west-2': 'US West (Oregon)',
  'ap-south-1': 'Asia Pacific (Mumbai)',
  'ap-northeast-3': 'Asia Pacific (Osaka-Local)',
  'ap-northeast-2': 'Asia Pacific (Seoul)',
  'ap-southeast-1': 'Asia Pacific (Singapore)',
  'ap-southeast-2': 'Asia Pacific (Sydney)',
  'ap-northeast-1': 'Asia Pacific (Tokyo)',
  'ca-central-1': 'Canada (Central)',
  'cn-north-1': 'China (Beijing)',
  'cn-northwest-1': 'China (Ningxia)',
  'eu-central-1': 'EU (Frankfurt)',
  'eu-west-1': 'EU (Ireland)',
  'eu-west-2': 'EU (London)',
  'eu-west-3': 'EU (Paris)',
  'eu-north-1': 'EU (Stockholm)',
  'sa-east-1': 'South America (São Paulo)',
  'us-gov-east-1': 'AWS GovCloud (US-East)',
  'us-gov-west-1': 'AWS GovCloud (US)',
};


class ClusterLocationLabel extends React.Component {
  componentDidMount() {
    const { getCloudProviders, cloudProviders } = this.props;
    if (!cloudProviders.pending && !cloudProviders.error && !cloudProviders.fulfilled) {
      getCloudProviders();
    }
  }

  render() {
    const { regionID, cloudProviderID, cloudProviders } = this.props;
    if (cloudProviderID === 'aws' && awsRegions[regionID]) {
      return (
        <React.Fragment>
          AWS
          {' '}
          {awsRegions[regionID]}
        </React.Fragment>
      );
    }
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
