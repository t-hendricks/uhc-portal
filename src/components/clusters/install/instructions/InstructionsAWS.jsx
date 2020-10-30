import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Title } from '@patternfly/react-core';
import { UserIcon, SyncAltIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import CardBadge from '../../common/CardBadge';

const InstructionsAWS = () => (
  <Card>
    <div className="pf-c-content ocm-page">
      <Title headingLevel="h3" size="2xl">
        AWS: Select an installation type
      </Title>
      <div className="flex-container">
        <Link to="/install/aws/installer-provisioned" className="ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isRecommened />
          <CardBody>
            <SyncAltIcon
              alt="Installer-Provisioned Infrastructure"
              className="ipi-upi-infra-logo"
            />
            <Title headingLevel="h3" size="lg">Installer-provisioned infrastructure</Title>
            {' '}
            Deploy an OpenShift cluster on infrastructure that the installation program
            provisions and the cluster maintains.
          </CardBody>
        </Link>
        <Link to="/install/aws/user-provisioned" className="ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isHidden />
          <CardBody>
            <UserIcon
              alt="User-Provisioned Infrastructure"
              className="ipi-upi-infra-logo"
            />
            <Title headingLevel="h3" size="lg">User-provisioned infrastructure</Title>
            Deploy an OpenShift cluster on infrastructure that you prepare and maintain.
          </CardBody>
        </Link>
      </div>
    </div>
  </Card>
);

export default InstructionsAWS;
