import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Title } from '@patternfly/react-core';
import { UserIcon, ConnectedIcon, SyncAltIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_primary_color_100 } from '@patternfly/react-tokens';
import CardBadge from '../../common/CardBadge';

export const InstructionsBareMetal = () => (
  <Card>
    <div className="pf-c-content ocm-page">
      <Title headingLevel="h3" size="2xl">
        Bare Metal: Select an installation type
      </Title>
      <div className="flex-container">
        <Link to="/assisted-installer/clusters/~new" className="aws-ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isDevPreview />
          <CardBody>
            <ConnectedIcon color={global_primary_color_100.value} size="xl" alt="Installer-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
            <Title headingLevel="h3" size="lg">Assisted Bare Metal Installer</Title>
            {' '}
            Deploy an OpenShift 4.6 cluster on your own infrastructure using a Discovery ISO
            that makes it easy to connect discovered hardware.
          </CardBody>
        </Link>
        <Link to="/install/metal/installer-provisioned" className="aws-ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isRecommened />
          <CardBody>
            <SyncAltIcon color={global_primary_color_100.value} size="xl" alt="Installer-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
            <Title headingLevel="h3" size="lg">Installer-provisioned infrastructure</Title>
            {' '}
            Deploy an OpenShift cluster on infrastructure that the installation program
            provisions and the cluster maintains.
          </CardBody>
        </Link>
        <Link to="/install/metal/user-provisioned" className="aws-ipi-upi-infra-card infra-card pf-c-card">
          <CardBadge isHidden />
          <CardBody>
            <UserIcon color={global_primary_color_100.value} size="xl" alt="User-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
            <Title headingLevel="h3" size="lg">User-provisioned infrastructure</Title>
            Deploy an OpenShift cluster on infrastructure that you prepare and maintain.
          </CardBody>
        </Link>
      </div>
    </div>
  </Card>
);

export default InstructionsBareMetal;
