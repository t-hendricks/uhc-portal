import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import ClusterIngressCard from './components/ClusterIngressCard';
import NetworkConfigurationCard from './components/NetworkConfigurationCard';
import VPCDetailsCard from './components/VPCDetailsCard';
import VPCSubnetsCard from './components/VPCSubnetsCard';

class Networking extends React.Component {
  componentWillUnmount() {
    const { resetRouters } = this.props;
    resetRouters();
  }

  render() {
    const { network, refreshCluster, gotRouters, provider } = this.props;

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
          <ClusterIngressCard refreshCluster={refreshCluster} provider={provider} />
        </GridItem>
        <GridItem lg={3} md={12}>
          <NetworkConfigurationCard network={network} />
        </GridItem>
        <GridItem lg={9} md={12}>
          <VPCDetailsCard />
        </GridItem>
        <GridItem lg={3} md={12}>
          <VPCSubnetsCard />
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
