import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
} from '@patternfly/react-core';
import NetworkConfigurationCard from './components/NetworkConfigurationCard';
import EditCluserRoutersCard from './components/EditClusterRoutersCard';

class Networking extends React.Component {
  componentWillUnmount() {
    const { resetRouters } = this.props;
    resetRouters();
  }

  render() {
    const {
      network,
      refreshCluster,
    } = this.props;

    return (
      <Grid gutter="md">
        <GridItem span={9}>
          <EditCluserRoutersCard refreshCluster={refreshCluster} />
        </GridItem>
        <GridItem span={3}>
          <NetworkConfigurationCard
            network={network}
          />
        </GridItem>
      </Grid>
    );
  }
}

Networking.propTypes = {
  network: PropTypes.object.isRequired,
  resetRouters: PropTypes.func.isRequired,
  refreshCluster: PropTypes.func.isRequired,
};

export default Networking;
