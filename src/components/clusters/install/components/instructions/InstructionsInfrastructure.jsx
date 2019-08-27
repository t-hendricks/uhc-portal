import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import PageTitle from '../../../../common/PageTitle';
import bareMetalIcon from '../../../../../styles/images/Icon_RH_Hardware_Server-A-Single_RGB_Flat.png';
import AWSLogo from '../../../../../styles/images/AWS.png';
import AzureLogo from '../../../../../styles/images/Microsoft_Azure_Logo.svg';
import GCPLogo from '../../../../../styles/images/google-cloud-logo.svg';
import vSphereLogo from '../../../../../styles/images/vmware_vsphere.png';

const InstructionsInfrastructure = () => (
  <Card>
    <div className="pf-c-content ocm-page">
      <PageTitle title="Infrastructure Provider" />
      <div className="flex-container">
        <Link to="/install/aws" className="infra-card infra-card-cloud-provider">
          <CardBody>
            <img src={AWSLogo} alt="AWS" className="infra-logo" />
          </CardBody>
        </Link>
        <Link to="/install/metal/user-provisioned" className="infra-card infra-card-cloud-provider">
          <CardBody>
            Bare Metal
            <br />
            <img src={bareMetalIcon} alt="Bare Metal" className="infra-logo" />
          </CardBody>
        </Link>
      </div>
      <div className="flex-container">
        <Link to="/install/azure/installer-provisioned" className="infra-card infra-card-cloud-provider">
          <CardBody>
            <img src={AzureLogo} alt="Azure" className="infra-logo" />
            <br />
            <span className="azure-dev-preview-card">
              <CodeIcon />
              {' '}
              Developer Preview
            </span>
          </CardBody>
        </Link>
        <Link to="/install/vsphere/user-provisioned" className="infra-card infra-card-cloud-provider">
          <CardBody>
            <img src={vSphereLogo} alt="vSphere" className="infra-logo-vsphere" />
          </CardBody>
        </Link>
      </div>
      <div className="flex-container">
        <Link to="/install/gcp/installer-provisioned" className="infra-card infra-card-cloud-provider">
          <CardBody className="gcp-card-body">
            <img src={GCPLogo} alt="GCP" className="infra-logo-google-cloud" />
            <br />
            <span className="gcp-dev-preview-card">
              <CodeIcon />
              {' '}
              Developer Preview
            </span>
          </CardBody>
        </Link>
        <CardBody className="infra-card-placeholder" />
      </div>
    </div>
  </Card>
);

export default InstructionsInfrastructure;
