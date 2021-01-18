import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Title } from '@patternfly/react-core';
import { UserIcon, SyncAltIcon } from '@patternfly/react-icons';
import CardBadge from '../../common/CardBadge';

const InstructionsOSP = () => (
  <Card>
    <div className="pf-c-content ocm-page">
      <Title headingLevel="h3" size="2xl">
        OpenStack: Select an installation type
      </Title>
      <div className="flex-container">
        <Link to="/install/openstack/installer-provisioned" className="ocm-c-ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isRecommened />
          <CardBody className="ocm-c-ipi-upi-infra-card--body">
            <SyncAltIcon
              alt="Installer-Provisioned Infrastructure"
            />
            <Title headingLevel="h3" size="lg">Installer-provisioned infrastructure</Title>
            {' '}
            Deploy an OpenShift cluster on infrastructure that the installation program
            provisions and the cluster maintains.
          </CardBody>
        </Link>
        <Link to="/install/openstack/user-provisioned" className="ocm-c-ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isHidden />
          <CardBody className="ocm-c-ipi-upi-infra-card--body">
            <UserIcon
              alt="User-Provisioned Infrastructure"
            />
            <Title headingLevel="h3" size="lg">User-provisioned infrastructure</Title>
            Deploy an OpenShift cluster on infrastructure that you prepare and maintain.
          </CardBody>
        </Link>
      </div>
    </div>
  </Card>
);

export default InstructionsOSP;
