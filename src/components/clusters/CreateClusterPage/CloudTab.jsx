import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PageSection,
  Title,
  Button,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import {
  Table, TableHeader, TableBody, expandable, cellWidth,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@patternfly/react-icons';

import RedHatLogo from '../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import IBMCloudLogo from '../../../styles/images/ibm_cloud-icon.png';
import MicrosoftLogo from '../../../styles/images/Microsoft_logo.svg';
import AWSLogo from '../../../styles/images/AWS.png';
import links from './CreateClusterConsts';


const getColumns = () => ([
  {
    title: null,
    cellFormatters: [expandable],
    transforms: [cellWidth(10)],
  },
  {
    title: 'Offerings',
    transforms: [cellWidth(25)],
  },
  {
    title: 'Purchased through',
    transforms: [cellWidth(20)],
  },
  {
    title: '',
    transforms: [cellWidth(20)],
  },
  {
    title: 'Get started',
  },
]);

const osdRow = (shouldExpand = true, isOpen = true, hasQuota = true) => {
  const offeringRow = {
    cells: [
      {
        title: (
          <>
            <img className="partner-logo" src={RedHatLogo} alt="OSD" />
          </>
        ),
      },
      (
        <>
          <a href={links.OSD_LEARN_MORE} rel="noopener noreferrer" target="_blank">
            Red Hat OpenShift Dedicated
          </a>
        </>
      ),
      'Red Hat',
      'Available on AWS and GCP',
      (
        <>
          {hasQuota ? (
            <Link id="create-cluster" to="/create/osd">
              <Button>
              Create cluser
              </Button>
            </Link>
          ) : (
            <Button component="a" href={links.OSD_LEARN_MORE} variant="secondary" rel="noopener noreferrer" target="_blank">
              Learn more
            </Button>
          )}
        </>
      ),
    ],
  };
  const descriptionRow = {
    parent: 0,
    fullWidth: true,
    cells: [
      {
        title: (
          <Stack hasGutter>
            <StackItem>
            A complete OpenShift cluster provided as a fully-managed cloud service
            dedicated to a single customer. Reduce operational complexity and focus
            on building and scaling applications that add more value to your business.
              <br />
              Hosted on Amazon Web Services (AWS) and Google Cloud.
            </StackItem>
            <StackItem>
              <a href={links.OSD_LEARN_MORE} rel="noopener noreferrer" target="_blank">
                Learn more about Red Hat OpenShift Dedicated
                {' '}
                <ArrowRightIcon />
              </a>
            </StackItem>
          </Stack>
        ),
      },
    ],
  };
  if (shouldExpand) {
    offeringRow.isOpen = isOpen;
    return [offeringRow, descriptionRow];
  }
  return [offeringRow];
};

const activeSubscriptionsTable = () => {
  const columns = getColumns();
  const rows = osdRow(false);

  return (
    <Table
      className="managed-subscriptions"
      aria-label="Managed subscriptions"
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const managedServices = (hasQuota) => {
  const [openRows, setOpenRows] = useState([]);
  const onCollapse = (e, rowKey, open) => {
    if (open) {
      setOpenRows([...openRows, rowKey]);
    } else {
      setOpenRows(openRows.filter(row => row !== rowKey));
    }
  };

  const rowKeys = hasQuota
    ? {
      azure: 0,
      ibm: 2,
      aws: 4,
    } : {
      osd: 0,
      azure: 2,
      ibm: 4,
      aws: 6,
    };

  const defaultRows = [{
    isOpen: openRows.includes(rowKeys.azure),
    cells: [
      (
        <>
          <img className="partner-logo" src={MicrosoftLogo} alt="Microsoft" />
        </>
      )
      ,
      (
        <>
          <a href={links.AZURE} target="_blank" rel="noopener noreferrer">
            Azure Red Hat Openshift
          </a>
        </>
      ),
      'Microsoft Azure',
      'Flexible hourly billing',
      (
        <>
          <Button component="a" href={links.AZURE} variant="secondary" target="_blank" rel="noopener noreferrer">
          Try it on Azure
          </Button>
        </>
      ),
    ],
  },
  {
    parent: rowKeys.azure,
    fullWidth: true,
    cells: [
      {
        title: (
          <Stack hasGutter>
            <StackItem>
              A flexible, self-service deployment of OpenShift clusters provided as a
              fully-managed cloud service patched, updated, and monitored by Microsoft and Red Hat.
              <br />
              Hosted on Microsoft Azure.
            </StackItem>
            <StackItem>
              <a href={links.AZURE} target="_blank" rel="noopener noreferrer">
                Learn more about Azure Red Hat OpenShift
                {' '}
                <ArrowRightIcon />
              </a>
            </StackItem>
          </Stack>
        ),
      },
    ],
  },
  {
    isOpen: openRows.includes(rowKeys.ibm),
    cells: [
      (
        <>
          <img className="partner-logo" src={IBMCloudLogo} alt="IBM Cloud" />
        </>
      ),
      (
        <>
          <a href={links.IBM_CLOUD_LEARN_MORE} target="_blank" rel="noopener noreferrer">
            OpenShift on IBM Cloud
          </a>
        </>
      ),
      'IBM',
      'Flexible hourly billing',
      (
        <>
          <Button component="a" href={links.IBM_CLOUD} variant="secondary" target="_blank" rel="noopener noreferrer">
          Try it on IBM
          </Button>
        </>
      ),
    ],
  },
  {
    parent: rowKeys.ibm,
    fullWidth: true,
    cells: [
      {
        title: (
          <Stack hasGutter>
            <StackItem>
              A preconfigured OpenShift environment provided as a fully-managed cloud
              service at enterprise scale.
              <br />
              Hosted on IBM Cloud.
            </StackItem>
            <StackItem>
              <a href={links.IBM_CLOUD_LEARN_MORE} target="_blank" rel="noopener noreferrer">
                Learn more about Red Hat OpenShift on IBM Cloud
                {' '}
                <ArrowRightIcon />
              </a>
            </StackItem>
          </Stack>
        ),
      },
    ],
  },
  {
    isOpen: openRows.includes(rowKeys.aws),
    cells: [
      (
        <>
          <img className="partner-logo" src={AWSLogo} alt="AWS" />
        </>
      ),
      (
        <>
          <a href={links.AWS} target="_blank" rel="noopener noreferrer">
            Red Hat OpenShift Service on AWS
          </a>
        </>
      ),
      'Amazon Web Services',
      'Flexible hourly billing',
      (
        <>
          <Button component="a" href={links.AWS} rel="noopener noreferrer" variant="secondary">
            Learn more
          </Button>
        </>
      ),
    ],
  },
  {
    parent: rowKeys.aws,
    fullWidth: true,
    cells: [
      {
        title: (
          <Stack hasGutter>
            <StackItem>
              A Quick Start architecture that sets up a cloud architecture, builds infrastructure
              from templates, and deploys Red Hat OpenShift Container Platform.
              <br />
              Hosted on AWS.
            </StackItem>
            <StackItem>
              <a href={links.AWS} target="_blank" rel="noopener noreferrer">
                Learn more about Red Hat OpenShift Service on AWS
                {' '}
                <ArrowRightIcon />
              </a>
            </StackItem>
          </Stack>
        ),
      },
    ],
  },
  ];

  const rows = hasQuota
    ? defaultRows
    : osdRow(true, openRows.includes(rowKeys.osd), hasQuota).concat(defaultRows);

  return (
    <Table
      aria-label="Managed services table"
      rows={rows}
      cells={getColumns(openRows.length === 0)}
      onCollapse={onCollapse}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const runItYourself = () => {
  const columns = ['Cloud provider', 'Installation options'];
  const rows = [
    [
      <><Link to="/install/aws">AWS</Link></>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <><Link to="/install/azure">Azure</Link></>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <><Link to="/install/gcp">Google Cloud</Link></>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <><Link to="/install/metal">Platform agnostic</Link></>,
      'Full stack automation and pre-existing infrastructure',
    ],
  ];
  return (
    <Table
      className="run-it-yourself"
      aria-label="Run it yourself"
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const CloudTab = ({ hasOSDQuota }) => (
  <>
    {
    hasOSDQuota && (
      <PageSection variant="light">
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2">
        Active subscriptions
            </Title>
          </StackItem>
          <StackItem>
            {activeSubscriptionsTable()}
            <Link to="/subscriptions">
              <Button id="subscriptions" variant="link">
                View your available quota
                {' '}
                <ArrowRightIcon />
              </Button>
            </Link>
          </StackItem>
        </Stack>
      </PageSection>
    )
    }
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">
          Managed services
          </Title>
        </StackItem>
        <StackItem>
          Managed as a service. Simplify your IT by running your OpenShift
          cluster with one of our partners below.
          {managedServices(hasOSDQuota)}
        </StackItem>
      </Stack>
    </PageSection>
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" className="font-weight-light">
          Run it yourself
          </Title>
        </StackItem>
        <StackItem>
          Run OpenShift clusters on your own by installing from another cloud provider.
          {runItYourself()}
        </StackItem>
      </Stack>
    </PageSection>
  </>
);

export default CloudTab;

CloudTab.propTypes = {
  hasOSDQuota: PropTypes.bool.isRequired,
};
