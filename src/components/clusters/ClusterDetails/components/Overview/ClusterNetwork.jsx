import React from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Flex,
} from '@patternfly/react-core';

function ClusterNetwork({ cluster }) {
  return (
    (cluster.managed && cluster.network && (
      <>
        <DescriptionListGroup>
          <DescriptionListTerm>Network</DescriptionListTerm>
          <DescriptionListDescription>
            <dl className="pf-l-stack">
              {cluster.network.machine_cidr && (
                <Flex>
                  <dt>Machine CIDR: </dt>
                  <dd>{cluster.network.machine_cidr}</dd>
                </Flex>
              )}
              {cluster.network.service_cidr && (
                <Flex>
                  <dt>Service CIDR: </dt>
                  <dd>{cluster.network.service_cidr}</dd>
                </Flex>
              )}
              {cluster.network.pod_cidr && (
                <Flex>
                  <dt>Pod CIDR: </dt>
                  <dd>{cluster.network.pod_cidr}</dd>
                </Flex>
              )}
              {cluster.network.host_prefix && (
                <Flex>
                  <dt>Host prefix: </dt>
                  <dd>{cluster.network.host_prefix}</dd>
                </Flex>
              )}
            </dl>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </>
    )) ||
    null
  );
}

ClusterNetwork.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ClusterNetwork;
