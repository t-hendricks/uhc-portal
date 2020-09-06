import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardBody, Title, GalleryItem, Gallery, Stack, StackItem, CardTitle,
} from '@patternfly/react-core';
import bareMetalIcon from '../../../../styles/images/server.svg';
import AWSLogo from '../../../../styles/images/AWS.png';
import AzureLogo from '../../../../styles/images/Microsoft_Azure_Logo.svg';
import GCPLogo from '../../../../styles/images/google-cloud-logo.svg';
import vSphereLogo from '../../../../styles/images/vmware_vsphere.png';
import CRCLogo from '../../../../styles/images/laptop.svg';
import OSPLogo from '../../../../styles/images/Logo-Red_Hat-OpenStack_Platform-A-Standard-RGB.svg';
import RHVLogo from '../../../../styles/images/Logo-Red_Hat-Virtualization-A-Standard-RGB.png';
import IBMZLogo from '../../../../styles/images/ibmz-logo.svg';
import PowerLogo from '../../../../styles/images/power-logo.png';
import CardBadge from '../../common/CardBadge';
import TitleWithLink from '../../../common/TitleWithLink';

const pathname = '/install';

const InstructionsInfrastructure = () => (
  <Stack className="ocp-infrastructure">
    <StackItem>
      <Card>
        <CardTitle>
          <TitleWithLink
            id="public-cloud"
            headingLevel="h3"
            size="2xl"
            text="In the public cloud"
            pathname={pathname}
          />
        </CardTitle>
        <CardBody className="pf-c-content ocm-page">
          <Gallery hasGutter className="ocp-infra-gallery">
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
              <Link to="/install/azure" className="infra-card infra-card-cloud-provider">
                <CardBadge isHidden />
                <CardBody>
                  <img src={AzureLogo} alt="Azure" className="infra-logo" />
                  <Title headingLevel="h5" size="lg">Run on Microsoft Azure</Title>
                </CardBody>
              </Link>
            </GalleryItem>
            <GalleryItem>
              <Link to="/install/gcp" className="infra-card infra-card-cloud-provider">
                <CardBadge isHidden />
                <CardBody>
                  <img src={GCPLogo} alt="GCP" className="infra-logo-google-cloud" />
                  <Title headingLevel="h5" size="lg">Run on Google Cloud Platform</Title>
                </CardBody>
              </Link>
            </GalleryItem>
          </Gallery>
        </CardBody>
      </Card>
    </StackItem>
    <StackItem>
      <Card>
        <CardTitle>
          <TitleWithLink
            id="datacenter"
            headingLevel="h3"
            size="2xl"
            text="In your datacenter"
            pathname={pathname}
          />
        </CardTitle>
        <CardBody className="pf-c-content ocm-page">
          <Gallery hasGutter className="ocp-infra-gallery">
            <GalleryItem>
              <Link to="/install/metal" className="infra-card infra-card-cloud-provider">
                <CardBadge isHidden />
                <CardBody>
                  <img src={bareMetalIcon} alt="Bare Metal" className="infra-logo" />
                  <Title headingLevel="h5" size="lg">Run on Bare Metal</Title>
                </CardBody>
              </Link>
            </GalleryItem>
            <GalleryItem>
              <Link to="/install/openstack" className="infra-card infra-card-cloud-provider">
                <CardBadge isHidden />
                <CardBody>
                  <img src={OSPLogo} alt="OpenStack" className="infra-logo-osp" />
                  <Title headingLevel="h5" size="lg">Run on Red Hat OpenStack</Title>
                </CardBody>
              </Link>
            </GalleryItem>
            <GalleryItem>
              <Link to="/install/rhv/installer-provisioned" className="infra-card infra-card-cloud-provider">
                <CardBadge isHidden />
                <CardBody>
                  <img src={RHVLogo} alt="Red Hat Virtualization" className="infra-logo-rhv" />
                  <Title headingLevel="h5" size="lg">Run on Red Hat Virtualization</Title>
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
              <Link to="/install/power/user-provisioned" className="infra-card infra-card-cloud-provider ibm-or-power">
                <CardBadge isHidden />
                <CardBody>
                  <img src={PowerLogo} alt="Power Systems" className="infra-logo-power" />
                  <Title headingLevel="h5" size="lg">Run on Power</Title>
                </CardBody>
              </Link>
            </GalleryItem>
            <GalleryItem>
              <Link to="/install/ibmz/user-provisioned" className="infra-card infra-card-cloud-provider ibm-or-power">
                <CardBadge isHidden />
                <CardBody>
                  <img src={IBMZLogo} alt="IBM" className="infra-logo-ibm" />
                  <Title headingLevel="h5" size="lg">Run on IBM Z</Title>
                </CardBody>
              </Link>
            </GalleryItem>
          </Gallery>
        </CardBody>
      </Card>
    </StackItem>
    <StackItem>
      <Card>
        <CardTitle className="ocm-page with-helptext">
          <TitleWithLink
            id="laptop"
            headingLevel="h3"
            size="2xl"
            text="On your laptop"
            pathname={pathname}
          />
        </CardTitle>
        <CardBody>
        Create a minimal OpenShift developement cluster on your local machine
        </CardBody>
        <CardBody className="pf-c-content ocm-page">
          <Gallery hasGutter className="ocp-infra-gallery">
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
        </CardBody>
      </Card>
    </StackItem>
  </Stack>
);

export default InstructionsInfrastructure;
