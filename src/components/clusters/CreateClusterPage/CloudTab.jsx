import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PageSection,
  Title,
  Button,
  Stack,
  StackItem,
  ButtonVariant,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, expandable, cellWidth } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { OCM } from 'openshift-assisted-ui-lib';

import RedHatLogo from '../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import IBMCloudLogo from '../../../styles/images/ibm_cloud-icon.png';
import MicrosoftLogo from '../../../styles/images/Microsoft_logo.svg';
import AWSLogo from '../../../styles/images/AWS.png';
import links from './CreateClusterConsts';
import CreateClusterDropDown from './CreateClusterDropDown';
import ExternalLink from '~/components/common/ExternalLink';

const { TechnologyPreview, PreviewBadgePosition } = OCM;

const getColumns = () => [
  {
    title: '',
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
    title: '\u00A0',
    transforms: [cellWidth(20)],
  },
  {
    title: 'Get started',
  },
];

const osdRow = (shouldExpand = true, isOpen = true, hasQuota = true, rowKey = 0) => {
  let contents = (
    <ExternalLink
      href={links.OSD_LEARN_MORE}
      isButton
      variant={ButtonVariant.secondary}
      className="create-button"
      noIcon
    >
      <span data-testid="osd-learn-more-button">Learn more</span>
    </ExternalLink>
  );

  if (hasQuota) {
    contents = (
      <Button
        className="create-button"
        variant={ButtonVariant.primary}
        component={(props) => (
          <Link
            {...props}
            id="create-cluster"
            to="/create/osd"
            data-testid="osd-create-cluster-button"
          />
        )}
      >
        Create cluster
      </Button>
    );
  }

  const offeringRow = {
    cells: [
      {
        title: (
          <>
            <img className="partner-logo" src={RedHatLogo} alt="OSD" />
          </>
        ),
      },
      <>
        <ExternalLink href={links.OSD_LEARN_MORE} noIcon>
          Red Hat OpenShift Dedicated
        </ExternalLink>
      </>,
      'Red Hat',
      'Available on AWS and GCP',
      <>{contents}</>,
    ],
  };
  const descriptionRow = {
    parent: rowKey,
    fullWidth: true,
    cells: [
      {
        title: (
          <Stack hasGutter>
            <StackItem>
              A complete OpenShift cluster provided as a fully-managed cloud service dedicated to a
              single customer. Reduce operational complexity and focus on building and scaling
              applications that add more value to your business.
              <br />
              Hosted on Amazon Web Services (AWS) and Google Cloud.
            </StackItem>
            <StackItem>
              <ExternalLink href={links.OSD_LEARN_MORE}>
                Learn more about Red Hat OpenShift Dedicated
              </ExternalLink>
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

const osdTrialRow = () => {
  const contents = (
    <Button
      className="create-button"
      variant={ButtonVariant.primary}
      component={(props) => (
        <Link
          {...props}
          id="create-trial-cluster"
          to="/create/osdtrial?trial=osd"
          data-testid="osd-create-trial-cluster"
        />
      )}
    >
      Create trial cluster
    </Button>
  );

  const offeringRow = {
    cells: [
      {
        title: (
          <>
            <img className="partner-logo" src={RedHatLogo} alt="OSD" />
          </>
        ),
      },
      <>
        <ExternalLink href={links.OSD_LEARN_MORE} noIcon>
          Red Hat OpenShift Dedicated Trial
        </ExternalLink>
      </>,
      'Red Hat',
      'Available on AWS and GCP',
      <>{contents}</>,
    ],
  };
  return offeringRow;
};

const managedServices = (hasQuota, trialEnabled) => {
  const [openRows, setOpenRows] = useState([]);
  const onCollapse = (e, rowKey, open) => {
    if (open) {
      setOpenRows([...openRows, rowKey]);
    } else {
      setOpenRows(openRows.filter((row) => row !== rowKey));
    }
  };

  const rowKeys = trialEnabled
    ? {
        osdTrial: 0,
        osd: 1,
        azure: 3,
        ibm: 5,
        aws: 7,
      }
    : {
        osd: 0,
        azure: 2,
        ibm: 4,
        aws: 6,
      };

  const defaultRows = [
    {
      isOpen: openRows.includes(rowKeys.azure),
      cells: [
        <>
          <img className="partner-logo" src={MicrosoftLogo} alt="Microsoft" />
        </>,
        <>
          <ExternalLink href={links.AZURE} noIcon>
            Azure Red Hat OpenShift
          </ExternalLink>
        </>,
        'Microsoft Azure',
        'Flexible hourly billing',
        <>
          <ExternalLink
            isButton
            noIcon
            variant={ButtonVariant.secondary}
            href={links.AZURE}
            className="create-button"
          >
            Try it on Azure
          </ExternalLink>
        </>,
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
                fully-managed cloud service by Microsoft and Red Hat.
                <br />
                Hosted on Microsoft Azure.
              </StackItem>
              <StackItem>
                <ExternalLink href={links.AZURE}>
                  Learn more about Azure Red Hat OpenShift
                </ExternalLink>
              </StackItem>
            </Stack>
          ),
        },
      ],
    },
    {
      isOpen: openRows.includes(rowKeys.ibm),
      cells: [
        <>
          <img className="partner-logo" src={IBMCloudLogo} alt="IBM Cloud" />
        </>,
        <>
          <ExternalLink href={links.IBM_CLOUD_LEARN_MORE} noIcon>
            Red Hat OpenShift on IBM Cloud
          </ExternalLink>
        </>,
        'IBM',
        'Flexible hourly billing',
        <>
          <ExternalLink
            isButton
            noIcon
            href={links.IBM_CLOUD}
            variant={ButtonVariant.secondary}
            className="create-button"
          >
            Try it on IBM
          </ExternalLink>
        </>,
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
                A preconfigured OpenShift environment provided as a fully-managed cloud service at
                enterprise scale.
                <br />
                Hosted on IBM Cloud.
              </StackItem>
              <StackItem>
                <ExternalLink href={links.IBM_CLOUD_LEARN_MORE}>
                  Learn more about Red Hat OpenShift on IBM Cloud
                </ExternalLink>
              </StackItem>
            </Stack>
          ),
        },
      ],
    },
    {
      isOpen: openRows.includes(rowKeys.aws),
      cells: [
        <>
          <img className="partner-logo" src={AWSLogo} alt="AWS" />
        </>,
        <>
          <ExternalLink noIcon href={links.AWS}>
            Red Hat OpenShift Service on AWS (ROSA)
          </ExternalLink>
        </>,
        'Amazon Web Services',
        'Flexible hourly billing',
        <>
          <CreateClusterDropDown toggleId="rosa-create-cluster-dropdown" />
        </>,
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
                Build, deploy, and manage Kubernetes applications with Red Hat OpenShift running
                natively on AWS.
                <br />
                Hosted on AWS.
              </StackItem>
              <StackItem>
                <ExternalLink href={links.AWS}>
                  Learn more about Red Hat OpenShift Service on AWS
                </ExternalLink>
              </StackItem>
            </Stack>
          ),
        },
      ],
    },
  ];

  const rows = osdRow(true, openRows.includes(rowKeys.osd), hasQuota, rowKeys.osd).concat(
    defaultRows,
  );
  if (trialEnabled) {
    rows.unshift(osdTrialRow());
  }

  return (
    <Table
      aria-label="Managed services table"
      rows={rows}
      cells={getColumns()}
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
      <>
        <Link to="/install/alibaba/installer-provisioned" className="pf-u-mr-xs">
          Alibaba Cloud
        </Link>
        <TechnologyPreview position={PreviewBadgePosition.inline} />
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/aws">AWS (x86_64)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/aws/arm">AWS (ARM)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/azure">Azure (x86_64)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/azure/multi/installer-provisioned" className="pf-u-mr-xs">
          Azure (multi-architecture)
        </Link>
        <TechnologyPreview position={PreviewBadgePosition.inline} />
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/gcp">Google Cloud</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/ibm-cloud" className="pf-u-mr-xs">
          IBM Cloud
        </Link>
        <TechnologyPreview position={PreviewBadgePosition.inline} />
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/platform-agnostic">Platform agnostic (x86_64)</Link>
      </>,
      'Pre-existing infrastructure',
    ],
  ];
  return (
    <Table className="run-it-yourself" aria-label="Run it yourself" cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const CloudTab = ({ hasOSDQuota, trialEnabled }) => (
  <>
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">Managed services</Title>
        </StackItem>
        <StackItem>
          Create clusters in the cloud using a managed service.
          {managedServices(hasOSDQuota, trialEnabled)}
          <Button
            variant={ButtonVariant.link}
            id="subscriptions"
            component={(props) => (
              <Link {...props} to="/quota" data-testid="osd-view-available-quota-link" />
            )}
          >
            View your available OpenShift Dedicated quota <ArrowRightIcon />
          </Button>
        </StackItem>
      </Stack>
    </PageSection>
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">Run it yourself</Title>
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
  trialEnabled: PropTypes.bool.isRequired,
};
