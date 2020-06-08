import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  Title,
  CardBody,
} from '@patternfly/react-core';

function NetworkConfigurationCard({ network }) {
  return (
    <Card>
      <CardHeader>
        <Title headingLevel="h2" size="lg" className="card-title">Network configuration</Title>
      </CardHeader>
      <CardBody>
        <>
          <dl className="networking-tab">
            <dt>Machine CIDR</dt>
            <dd>
              {network.machine_cidr || 'N/A'}
            </dd>
            <dt>Service CIDR</dt>
            <dd>
              {network.service_cidr || 'N/A'}
            </dd>
            <dt>Pod CIDR</dt>
            <dd>
              {network.pod_cidr || 'N/A'}
            </dd>
            <dt>Host prefix</dt>
            <dd id="networking-tab-last">
              {`/${network.host_prefix}` || 'N/A'}
            </dd>
          </dl>
        </>
      </CardBody>
    </Card>
  );
}

NetworkConfigurationCard.propTypes = {
  network: PropTypes.object.isRequired,
};

export default NetworkConfigurationCard;
