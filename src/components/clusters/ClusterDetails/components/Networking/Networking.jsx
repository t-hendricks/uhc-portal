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
import EditClusterRoutersCard from './components/EditClusterRoutersCard';

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
      provider,
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
      <Grid>
        <GridItem lg={9} md={12}>
          <EditClusterRoutersCard refreshCluster={refreshCluster} provider={provider} />
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
  provider: PropTypes.string,
};

export default Networking;
