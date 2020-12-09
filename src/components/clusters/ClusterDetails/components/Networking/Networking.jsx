import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  GridItem,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
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
      gotRouters,
    } = this.props;

    if (!gotRouters) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Spinner centered />
          </EmptyStateBody>
        </EmptyState>
      );
    }

    return (
      <Grid hasGutter>
        <GridItem lg={9} md={12}>
          <EditCluserRoutersCard refreshCluster={refreshCluster} />
        </GridItem>
        <GridItem lg={3} md={12}>
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
  gotRouters: PropTypes.bool.isRequired,
};

export default Networking;
