import React from 'react';
import { Link } from 'react-router-dom';
import {
  CardBody,
} from 'patternfly-react';
import upiLogo from '../../../../../styles/images/Icon_RH_Diagram_DevelopmentModel_RGB_Flat.png';
import ipiLogo from '../../../../../styles/images/Icon_RH_Diagram_Lifecycle_RGB_Flat.png';

const InstructionsAWS = () => (
  <div className="pf-c-content">
    <h1>Install on AWS: Infrastructure Type</h1>
    <div className="grid-container">
      <Link to="/install/aws/ipi" className="aws-ipi-upi-infra-card infra-card">
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
      <Link to="/install/aws/upi" className="aws-ipi-upi-infra-card infra-card">
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
);

export default InstructionsAWS;
