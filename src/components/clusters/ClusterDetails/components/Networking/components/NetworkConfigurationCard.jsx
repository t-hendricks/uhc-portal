import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';

import './NetworkConfigurationCard.scss';

function NetworkConfigurationCard({ network }) {
  return (
    <Card className="ocm-c-networking-network-configuration__card">
      <CardTitle>
        CIDR ranges
      </CardTitle>
      <CardBody className="ocm-c-networking-network-configuration__card--body">
        <>
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Machine CIDR</DescriptionListTerm>
              <DescriptionListDescription>
                {network.machine_cidr || 'N/A'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Service CIDR</DescriptionListTerm>
              <DescriptionListDescription>
                {network.service_cidr || 'N/A'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Pod CIDR</DescriptionListTerm>
              <DescriptionListDescription>
                {network.pod_cidr || 'N/A'}
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Host prefix</DescriptionListTerm>
              <DescriptionListDescription>
                {`/${network.host_prefix}` || 'N/A'}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </>
      </CardBody>
    </Card>
  );
}

NetworkConfigurationCard.propTypes = {
  network: PropTypes.object.isRequired,
};

export default NetworkConfigurationCard;
