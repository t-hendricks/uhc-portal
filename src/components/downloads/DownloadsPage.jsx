import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Stack,
  StackItem,
  FormSelect,
  FormSelectOption,
  Text,
} from '@patternfly/react-core';
import {
  Table, TableHeader, TableBody, expandable, cellWidth,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { has, get } from 'lodash';

import PageTitle from '../common/PageTitle';
import ExternalLink from '../common/ExternalLink';
import links, {
  urls,
  tools,
  channels,
  operatingSystemOptions,
  architectureOptions,
} from '../../common/installLinks';
import DownloadButton from '../clusters/install/instructions/components/DownloadButton';
import { detectOS } from '../clusters/install/instructions/components/DownloadAndOSSelection';

const columns = [
  {
    title: null,
    cellFormatters: [expandable],
    transforms: [cellWidth(10)],
  },
  {
    title: 'Name',
    transforms: [cellWidth(40)],
  },
  {
    title: 'OS type',
    transforms: [cellWidth(15)],
  },
  {
    title: 'Architecture type',
    transforms: [cellWidth(15)],
  },
  {
    // For download button.
    title: '',
    transforms: [cellWidth(20)],
  },
];

/**
 * Returns relevant subset of `operatingSystemOptions`.
 */
export const allOperatingSystemsForTool = tool => (
  operatingSystemOptions.filter(({ value: OS }) => (
    architectureOptions.find(({ value: architecture }) => (
      has(urls, [tool, channels.STABLE, architecture, OS])
    ))
  ))
);

/**
 * Returns relevant subset of `architectureOptions`
 * (not all of them valid for currently chosen OS, but form _some_ OS).
 */
export const allArchitecturesForTool = tool => (
  architectureOptions.filter(({ value: architecture }) => (
    operatingSystemOptions.find(({ value: OS }) => (
      has(urls, [tool, channels.STABLE, architecture, OS])
    ))
  ))
);

/**
 * Returns relevant subset from `architectureOptions`.
 */
export const architecturesForToolOS = (tool, OS) => (
  architectureOptions.filter(({ value: architecture }) => (
    has(urls, [tool, channels.STABLE, architecture, OS])
  ))
);

const operatingSystemDropdown = (tool, OS, setOS) => (
  <FormSelect value={OS} onChange={setOS} aria-label="select-os-dropdown">
    <FormSelectOption key="select" value="select" label="Select OS" isDisabled />
    {allOperatingSystemsForTool(tool).map(({ value, label }) => (
      <FormSelectOption key={value} value={value} label={label} />
    ))}
  </FormSelect>
);

const architectureSelectOption = (tool, OS, { value, label }) => (
  has(urls, [tool, channels.STABLE, value, OS]) ? (
    <FormSelectOption key={value} value={value} label={label} />
  ) : (
    <FormSelectOption
      isDisabled
      value={value}
      label={label}
      title="This type of architecture is not available for the selected OS type"
    />
  )
);

const architectureDropdown = (tool, OS, architecture, setArchitecture) => {
  const allOptions = allArchitecturesForTool(tool);
  const optionsForOS = architecturesForToolOS(tool, OS);
  return (
    <FormSelect
      aria-label="select-arch-dropdown"
      value={architecture}
      onChange={setArchitecture}
      isDisabled={optionsForOS.length <= 1}
    >
      <FormSelectOption key="select" value="select" label="Select architecture" isDisabled />
      {allOptions.map(option => architectureSelectOption(tool, OS, option))}
    </FormSelect>
  );
};

/**
 * @param tool - one of `installLinks.tools`.
 * @param detectedOS - result of detectOS(), injected for testing.
 * @returns {OS, architecture}
 */
export const initialSelection = (tool, detectedOS) => {
  // Start with an OS and architecture chosen so that some users can
  // click Download directly without having to change selections.
  const OS = detectedOS || allOperatingSystemsForTool(tool)[0];
  const architecture = architecturesForToolOS(tool, OS)[0];
  return { OS, architecture };
};

export const useToolRow = (expanded, tool, name) => {
  const initial = initialSelection(tool, detectOS());
  const [OS, setOS] = React.useState(initial.OS);
  const [architecture, setArchitecture] = React.useState(initial.architecture);
  const onChangeOS = (newOS) => {
    setOS(newOS);
    // Invalidate arch selection if not compatible
    if (!has(urls, [tool, channels.STABLE, architecture, newOS])) {
      const optionsForOS = architecturesForToolOS(tool, newOS);
      setArchitecture(optionsForOS.length > 1 ? 'select' : optionsForOS[0].value);
    }
  };

  const url = get(urls, [tool, channels.STABLE, architecture, OS]);
  return {
    isOpen: !!expanded[tool],
    tool, // custom property for `onCollapse` callback
    cells: [
      '',
      name,
      { title: operatingSystemDropdown(tool, OS, onChangeOS) },
      { title: architectureDropdown(tool, OS, architecture, setArchitecture) },
      { title: <DownloadButton url={url} tool={tool} text="Download" /> },
    ],
  };
};

const descriptionRow = (parentIndex, child) => (
  {
    parent: parentIndex,
    fullWidth: true,
    cells: [
      { title: child },
    ],
  }
);

const cliToolRows = expanded => [
  useToolRow(expanded, tools.CLI_TOOLS, 'OpenShift command-line interface (oc)'),
  descriptionRow(0,
    <>
      <Text>
        Create applications and manage OpenShift projects from the command line
        using the OpenShift CLI (oc).
      </Text>
      <Text>
        Get started with the OpenShift CLI for
        <ExternalLink href={links.CLI_TOOLS_OCP_GETTING_STARTED}>
          OpenShift Container Platform (OCP)
        </ExternalLink>
        {' '}
        or
        {' '}
        <ExternalLink href={links.CLI_TOOLS_OSD_GETTING_STARTED}>
          OpenShift Dedicated (OSD)
        </ExternalLink>
        .
      </Text>
    </>),

  // TODO ocm-cli

  useToolRow(expanded, tools.ROSA, 'Red Hat OpenShift Service on AWS (ROSA) command-line interface (rosa CLI)'),
  descriptionRow(2,
    <Text>
      Manage your Red Hat OpenShift Service on AWS (ROSA) clusters
      from the command line using the rosa CLI.
      {' '}
      <ExternalLink href={links.ROSA_DOCS}>
        Get started with rosa CLI
      </ExternalLink>
    </Text>),
];

const devToolRows = expanded => [
  useToolRow(expanded, tools.ODO, 'Developer-focused CLI for OpenShift (odo)'),
  descriptionRow(0,
    <Text>
      Write, build, and deploy applications on OpenShift with odo, a fast, iterative,
      and straightforward CLI tool for developers.
      {' '}
      <ExternalLink href={links.ODO_DOCS}>Learn more</ExternalLink>
    </Text>),

  useToolRow(expanded, tools.HELM, 'Helm 3 CLI'),
  descriptionRow(2,
    <Text>
      Define, install, and upgrade application packages as Helm charts using Helm 3,
      a package manager for Kubernetes.
      {' '}
      <ExternalLink href={links.HELM_DOCS}>Learn more</ExternalLink>
    </Text>),

  // TODO rhoas
];

const installationRows = expanded => [
  useToolRow(expanded, tools.INSTALLER, 'OpenShift Installer'),
  descriptionRow(0,
    <Stack>
      <StackItem>
        Download and extract your operating system&apos;s installation program and
        place the file in the directory where you&apos;ll store your configuration details.
        After installing OpenShift, create clusters on supported infrastructure using our
        {' '}
        <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink>
        {' '}
        as a guide.
      </StackItem>
      <StackItem>
        Learn how to deploy in the
        {' '}
        <Link to="/create">cloud</Link>
        , or in your
        {' '}
        <Link to="/create/datacenter">data center</Link>
        .
      </StackItem>
    </Stack>),

  useToolRow(expanded, tools.CRC, 'CodeReady Containers'),
  descriptionRow(2,
    <Stack>
      <StackItem>
        Download and open the CodeReady Containers file to automatically start
        a step-by-step installation guide.
      </StackItem>
      <StackItem>
        <Link to="/create/local">Create a minimal cluster on your desktop</Link>
        for local development and testing.
      </StackItem>
    </Stack>),
];

const DownloadsPage = () => {
  // {tool: isOpen}
  const initialExpanded = {};
  Object.keys(tools).forEach((tool) => {
    initialExpanded[tool] = false;
  });
  const [expanded, setExpanded] = useState(initialExpanded);
  const onCollapse = (event, rowIndex, newOpen, rowData) => {
    setExpanded({ ...expanded, [rowData.tool]: newOpen });
  };

  return (
    <>
      <PageTitle title="Downloads" />

      <PageSection>
        <PageSection variant="light">
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2">
                Command-line interface (CLI) tools
              </Title>
            </StackItem>

            <StackItem>
              <Text>
                Download command line tools to manage and work with OpenShift from your terminal.
              </Text>
              <Table
                aria-label="CLI tools table"
                cells={columns}
                rows={cliToolRows(expanded)}
                onCollapse={onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </StackItem>

            <StackItem>
              <Title headingLevel="h2">
                Developer tools
              </Title>
            </StackItem>

            <StackItem>
              <Text>
                Access all the powers of Kubernetes through a simplified workflow with
                Red Hat’s developer tools.
                {' '}
                <ExternalLink href="https://developers.redhat.com/topics/developer-tools">Learn more</ExternalLink>
              </Text>
              <Table
                aria-label="Developer tools table"
                cells={columns}
                rows={devToolRows(expanded)}
                onCollapse={onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </StackItem>

            <StackItem>
              <Title headingLevel="h2">
                OpenShift installation
              </Title>
            </StackItem>

            <StackItem>
              <Text>
                Install OpenShift based on your infrastructure.
                Start by downloading the installer, then follow the steps provided
                within your infrastructure&apos;s tab on the
                {' '}
                <Link to="/create">create cluster</Link>
                {' '}
                page to install an OpenShift cluster.
              </Text>
              <Table
                aria-label="OpenShift installation table"
                cells={columns}
                rows={installationRows(expanded)}
                onCollapse={onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </StackItem>
          </Stack>
        </PageSection>
      </PageSection>
    </>
  );
};
DownloadsPage.propTypes = {
};

export default DownloadsPage;
