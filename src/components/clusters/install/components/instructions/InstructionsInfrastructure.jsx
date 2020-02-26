import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardBody, Title, GalleryItem, Gallery,
} from '@patternfly/react-core';
import bareMetalIcon from '../../../../../styles/images/server.svg';
import AWSLogo from '../../../../../styles/images/AWS.png';
import AzureLogo from '../../../../../styles/images/Microsoft_Azure_Logo.svg';
import GCPLogo from '../../../../../styles/images/google-cloud-logo.svg';
import vSphereLogo from '../../../../../styles/images/vmware_vsphere.png';
import CRCLogo from '../../../../../styles/images/laptop.svg';
import OSPLogo from '../../../../../styles/images/Logo-Red_Hat-OpenStack_Platform-A-Standard-RGB.svg';
import RHVLogo from '../../../../../styles/images/Logo-Red_Hat-Virtualization-A-Standard-RGB.png';
import IBMZLogo from '../../../../../styles/images/ibmz-logo.svg';
import CardBadge from '../CardBadge';

const InstructionsInfrastructure = () => (
  <Card>
    <div className="pf-c-content ocm-page">
      <Title headingLevel="h3" size="2xl">
        Select an infrastructure provider
      </Title>
      <Gallery gutter="md" className="ocp-infra-gallery">
        <GalleryItem>
          <Link to="/install/aws" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={AWSLogo} alt="AWS" className="infra-logo" />
              <Title headingLevel="h5" size="lg">Run on Amazon Web Services</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/azure/installer-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={AzureLogo} alt="Azure" className="infra-logo" />
              <Title headingLevel="h5" size="lg">Run on Microsoft Azure</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/gcp/installer-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={GCPLogo} alt="GCP" className="infra-logo-google-cloud" />
              <Title headingLevel="h5" size="lg">Run on Google Cloud Platform</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/vsphere/user-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={vSphereLogo} alt="vSphere" className="infra-logo-vsphere" />
              <Title headingLevel="h5" size="lg">Run on VMware vSphere</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/openstack/installer-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={OSPLogo} alt="OpenStack" className="infra-logo-osp" />
              <Title headingLevel="h5" size="lg">Run on Red Hat OpenStack</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/rhv/installer-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isDevPreview />
            <CardBody>
              <img src={RHVLogo} alt="Red Hat Virtualization" className="infra-logo-rhv" />
              <Title headingLevel="h5" size="lg">Run on Red Hat Virtualization</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/metal/user-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={bareMetalIcon} alt="Bare Metal" className="infra-logo" />
              <Title headingLevel="h5" size="lg">Run on Bare Metal</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/ibmz/user-provisioned" className="infra-card infra-card-cloud-provider" id="ibm">
            <CardBadge isHidden />
            <CardBody>
              <img src={IBMZLogo} alt="IBM" className="infra-logo-ibm" />
              <Title headingLevel="h5" size="lg">Run on IBM Z</Title>
            </CardBody>
          </Link>
        </GalleryItem>
        <GalleryItem>
          <Link to="/install/crc/installer-provisioned" className="infra-card infra-card-cloud-provider">
            <CardBadge isHidden />
            <CardBody>
              <img src={CRCLogo} alt="CRC" className="infra-logo-crc" />
              <Title headingLevel="h5" size="lg" className="infra-crc-title">Run on Laptop</Title>
              <span className="infra-crc-icon-text">Powered by Red Hat CodeReady Containers</span>
            </CardBody>
          </Link>
        </GalleryItem>
      </Gallery>
    </div>
  </Card>
);

export default InstructionsInfrastructure;
