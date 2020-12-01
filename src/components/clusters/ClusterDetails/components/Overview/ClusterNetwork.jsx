import React from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';

function ClusterNetwork({ cluster }) {
  return (
    cluster.managed && cluster.network && (
      <>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Network
          </DescriptionListTerm>
          <DescriptionList isHorizontal className="ocm-c-description-list-secondary">
            { cluster.network.machine_cidr
            && (
            <DescriptionListGroup>
              <DescriptionListTerm>Machine CIDR: </DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.network.machine_cidr}
              </DescriptionListDescription>
            </DescriptionListGroup>
            )}
            { cluster.network.service_cidr
            && (
            <DescriptionListGroup>
              <DescriptionListTerm>Service CIDR: </DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.network.service_cidr}
              </DescriptionListDescription>
            </DescriptionListGroup>
            )}
            { cluster.network.pod_cidr
            && (
            <DescriptionListGroup>
              <DescriptionListTerm>Pod CIDR: </DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.network.pod_cidr}
              </DescriptionListDescription>
            </DescriptionListGroup>
            )}
            { cluster.network.host_prefix
            && (
            <DescriptionListGroup>
              <DescriptionListTerm>Host prefix: </DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.network.host_prefix}
              </DescriptionListDescription>
            </DescriptionListGroup>
            )}
          </DescriptionList>
        </DescriptionListGroup>
      </>
    )
  );
}

ClusterNetwork.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ClusterNetwork;
