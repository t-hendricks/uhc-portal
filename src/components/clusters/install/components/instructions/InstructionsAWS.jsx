import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@patternfly/react-core';
import PageTitle from '../../../../common/PageTitle';
import upiLogo from '../../../../../styles/images/Icon_RH_Diagram_DevelopmentModel_RGB_Flat.png';
import ipiLogo from '../../../../../styles/images/Icon_RH_Diagram_Lifecycle_RGB_Flat.png';

const InstructionsAWS = () => (
  <Card>
    <div className="pf-c-content ocm-page">
      <PageTitle title="Install on AWS: Infrastructure Type" />
      <div className="flex-container">
        <Link to="/install/aws/installer-provisioned" className="aws-ipi-upi-infra-card infra-card">
          <CardBody>
            Installer-Provisioned Infrastructure
            <br />
            <img src={ipiLogo} alt="Installer-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
            <br />
            <strong>Recommended:</strong>
            {' '}
            Deploy an OpenShift cluster on infrastructure that the installation program
            provisions and the cluster maintains.
          </CardBody>
        </Link>
        <Link to="/install/aws/user-provisioned" className="aws-ipi-upi-infra-card infra-card">
          <CardBody>
            User-Provisioned Infrastructure
            <br />
            <img src={upiLogo} alt="User-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
            <br />
            Deploy an OpenShift cluster on infrastructure that you prepare and maintain.
          </CardBody>
        </Link>
      </div>
    </div>
  </Card>
);

export default InstructionsAWS;
