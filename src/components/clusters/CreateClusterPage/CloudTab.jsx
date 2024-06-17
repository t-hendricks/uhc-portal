/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import {
  Button,
  ButtonVariant,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import { cellWidth, expandable } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

import ExternalLink from '~/components/common/ExternalLink';
import SupportLevelBadge, { TECH_PREVIEW } from '~/components/common/SupportLevelBadge';
import { isRestrictedEnv } from '~/restrictedEnv';

import AWSLogo from '../../../styles/images/AWS.png';
import IBMCloudLogo from '../../../styles/images/ibm_cloud-icon.png';
import RedHatLogo from '../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import MicrosoftLogo from '../../../styles/images/Microsoft_logo.svg';

import links from './CreateClusterConsts';
import CreateClusterDropDown from './CreateClusterDropDown';

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

const osdRow = (hasQuota = true) => {
  let contents = (
    <ExternalLink
      href={links.OSD_LEARN_MORE}
      isButton
      variant={ButtonVariant.secondary}
      className="create-button"
      noIcon
    >
      <span>Learn more</span>
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
  return [offeringRow, descriptionRow];
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
          role="button"
        />
      )}
    >
      Create trial cluster
    </Button>
  );

  return {
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
};

const ManagedServices = ({ hasQuota, trialEnabled }) => {
  const [openRows, setOpenRows] = useState([]);
  const onCollapse = (e, rowKey, open) => {
    if (open) {
      setOpenRows([...openRows, rowKey]);
    } else {
      setOpenRows(openRows.filter((row) => row !== rowKey));
    }
  };

  const rosaRow = [
    {
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

  const defaultRows = [
    {
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
    ...rosaRow,
  ];

  let rows = rosaRow;
  let initialIndex = 1;

  if (!isRestrictedEnv()) {
    rows = osdRow(hasQuota).concat(defaultRows);
    if (trialEnabled) {
      rows.unshift(osdTrialRow());
      initialIndex = 2;
    }
  }

  for (let i = initialIndex; i < rows.length; i += 2) {
    const parent = i - 1;
    rows[i].parent = parent;
    rows[parent].isOpen = openRows.includes(parent);
  }

  return (
    <TableDeprecated
      aria-label="Managed services table"
      rows={rows}
      cells={getColumns()}
      onCollapse={onCollapse}
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
  );
};

const runItYourself = () => {
  const columns = ['Cloud provider', 'Installation options'];
  const rows = [
    [
      <>
        <Link to="/install/alibaba" className="pf-v5-u-mr-xs">
          Alibaba Cloud
        </Link>
        <SupportLevelBadge {...TECH_PREVIEW} />
      </>,
      'Pre-existing infrastructure',
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
        <Link to="/install/aws/multi/installer-provisioned">AWS (multi-architecture)</Link>
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/azure">Azure (x86_64)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/azure/arm/installer-provisioned">Azure (ARM)</Link>
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/azure/multi/installer-provisioned" className="pf-v5-u-mr-xs">
          Azure (multi-architecture)
        </Link>
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
        <Link to="/install/ibm-cloud">IBM Cloud</Link>
      </>,
      'Full stack automation',
    ],

    [
      <>
        <Link to="/install/metal/multi"> Baremetal (multi-architecture)</Link>
      </>,
      'Pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/powervs/installer-provisioned">IBM PowerVS (ppc64le)</Link>
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/platform-agnostic">Platform agnostic (x86_64)</Link>
      </>,
      'Pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/oracle-cloud">Oracle Cloud Infrastructure (virtual machines)</Link>
      </>,
      'Pre-existing infrastructure',
    ],
  ];
  return (
    <TableDeprecated
      className="run-it-yourself"
      aria-label="Run it yourself"
      cells={columns}
      rows={rows}
    >
      <TableHeaderDeprecated />
      <TableBodyDeprecated />
    </TableDeprecated>
  );
};

const QuotaLink = (props) => <Link {...props} to="/quota" />;

const CloudTab = ({ hasOSDQuota, trialEnabled }) => (
  <>
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">Managed services</Title>
        </StackItem>
        <StackItem>
          Create clusters in the cloud using a managed service.
          <ManagedServices hasQuota={hasOSDQuota} trialEnabled={trialEnabled} />
          {!isRestrictedEnv() && (
            <Button variant={ButtonVariant.link} id="subscriptions" component={QuotaLink}>
              View your available OpenShift Dedicated quota <ArrowRightIcon />
            </Button>
          )}
        </StackItem>
      </Stack>
    </PageSection>
    {!isRestrictedEnv() && (
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
    )}
  </>
);

export default CloudTab;

CloudTab.propTypes = {
  hasOSDQuota: PropTypes.bool.isRequired,
  trialEnabled: PropTypes.bool.isRequired,
};

ManagedServices.propTypes = {
  hasQuota: PropTypes.bool.isRequired,
  trialEnabled: PropTypes.bool.isRequired,
};
