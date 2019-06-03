import React from 'react';
import { Link } from 'react-router-dom';
import {
  CardBody,
} from 'patternfly-react';
import bareMetalIcon from '../../../../../styles/images/Icon_RH_Hardware_Server-A-Single_RGB_Flat.png';
import AWSLogo from '../../../../../styles/images/AWS.png';
import AzureLogo from '../../../../../styles/images/Microsoft_Azure_Logo.svg';
import vSphereLogo from '../../../../../styles/images/vmware_vsphere.png';

const InstructionsInfrastructure = () => (
  <div className="pf-c-content">
    <h1>Infrastructure Provider</h1>
    <div className="grid-container">
      <Link to="/install/aws" className="infra-card">
        <CardBody>
          <img src={AWSLogo} alt="AWS" className="infra-logo" />
        </CardBody>
      </Link>
      <Link to="/install/metal/user-provisioned" className="infra-card">
        <CardBody>
          Bare Metal
          <br />
          <img src={bareMetalIcon} alt="Bare Metal" className="infra-logo" />
        </CardBody>
      </Link>
    </div>
    <div className="grid-container">
      <Link to="/install/azure/user-provisioned" className="infra-card">
        <CardBody>
          <img src={AzureLogo} alt="Azure" className="infra-logo" />
        </CardBody>
      </Link>
      <Link to="/install/vsphere/user-provisioned" className="infra-card">
        <CardBody>
          <img src={vSphereLogo} alt="vSphere" className="infra-logo-vsphere" />
        </CardBody>
      </Link>
    </div>
  </div>
);

export default InstructionsInfrastructure;
