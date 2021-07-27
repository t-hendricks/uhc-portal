import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ExpandableSectionToggle,
  PageSection,
  Split,
  SplitItem,
  FormSelect,
  FormSelectOption,
  Text,
  TextContent,
} from '@patternfly/react-core';
import {
  PageHeader, PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Table, TableHeader, TableBody, expandable, cellWidth,
} from '@patternfly/react-table';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

import produce from 'immer';
import { has, get } from 'lodash';

import ExternalLink from '../../common/ExternalLink';
import links, {
  tools,
  channels,
  operatingSystems,
  operatingSystemOptions,
  architectureOptions,
  githubReleasesToFetch,
  urlsSelector,
} from '../../../common/installLinks';
import DevPreviewBadge from '../../common/DevPreviewBadge';

import DownloadButton from '../../clusters/install/instructions/components/DownloadButton';
import AlignRight from '../../common/AlignRight';
import DownloadsCategoryDropdown from '../DownloadsCategoryDropdown';
import DownloadsSection from '../DownloadsSection';
import DownloadPullSecret from '../DownloadPullSecret';
import CopyPullSecret from '../CopyPullSecret';

import './DownloadsPage.scss';

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
    transforms: [cellWidth(20)],
  },
  {
    title: 'Architecture type',
    transforms: [cellWidth(20)],
  },
  {
    // For download button.
    title: '',
    transforms: [cellWidth(10)],
  },
];

/**
 * @returns User's OS (one of `operatingSystems` keys), or null if detection failed.
 */
export function detectOS() {
  const { platform } = window.navigator;
  const macOSPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  if (macOSPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.mac;
  }
  if (windowsPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.windows;
  }
  if (/Linux/.test(platform)) {
    return operatingSystems.linux;
  }
  return null;
}

/**
 * Returns relevant subset of `operatingSystemOptions`.
 */
export const allOperatingSystemsForTool = (urls, tool, channel) => (
  operatingSystemOptions.filter(({ value: OS }) => (
    architectureOptions.find(({ value: architecture }) => (
      has(urls, [tool, channel, architecture, OS])
    ))
  ))
);

/**
 * Returns relevant subset of `architectureOptions`
 * (not all of them valid for currently chosen OS, but form _some_ OS).
 */
export const allArchitecturesForTool = (urls, tool, channel) => (
  architectureOptions.filter(({ value: architecture }) => (
    operatingSystemOptions.find(({ value: OS }) => (
      has(urls, [tool, channel, architecture, OS])
    ))
  ))
);

/**
 * Returns relevant subset from `architectureOptions`.
 */
export const architecturesForToolOS = (urls, tool, channel, OS) => (
  architectureOptions.filter(({ value: architecture }) => (
    has(urls, [tool, channel, architecture, OS])
  ))
);

export const operatingSystemDropdown = (urls, tool, channel, OS, setOS) => (
  <FormSelect value={OS} onChange={setOS} aria-label="Select OS dropdown">
    <FormSelectOption key="select" value="select" label="Select OS" isDisabled />
    {allOperatingSystemsForTool(urls, tool, channel).map(({ value, label }) => (
      <FormSelectOption key={value} value={value} label={label} />
    ))}
  </FormSelect>
);

const architectureSelectOption = (urls, tool, channel, OS, { value, label }) => (
  has(urls, [tool, channel, value, OS]) ? (
    <FormSelectOption key={value} value={value} label={label} />
  ) : (
    <FormSelectOption
      isDisabled
      key={value}
      value={value}
      label={label}
      title="This type of architecture is not available for the selected OS type"
    />
  )
);

export const architectureDropdown = (urls, tool, channel, OS, architecture, setArchitecture) => {
  const allOptions = allArchitecturesForTool(urls, tool, channel);
  const optionsForOS = architecturesForToolOS(urls, tool, channel, OS);
  return (
    <FormSelect
      aria-label="Select architecture dropdown"
      value={architecture}
      onChange={setArchitecture}
      isDisabled={optionsForOS.length <= 1}
    >
      <FormSelectOption key="select" value="select" label="Select architecture" isDisabled />
      {allOptions.map(option => architectureSelectOption(urls, tool, channel, OS, option))}
    </FormSelect>
  );
};

/**
 * @param tool - one of `installLinks.tools`.
 * @param detectedOS - result of detectOS(), injected for testing.
 * @returns {OS, architecture}
 */
export const initialSelection = (urls, tool, channel, detectedOS) => {
  // Start with an OS and architecture chosen so that some users can
  // click Download directly without having to change selections.
  const OS = detectedOS || allOperatingSystemsForTool(urls, tool, channel)?.[0]?.value;
  const architecture = architecturesForToolOS(urls, tool, channel, OS)?.[0]?.value;
  return { OS, architecture };
};

/**
 *
 * @param expanded - { [tool]: boolean }
 * @param selections - { [tool]: { OS, architecture } }
 * @param setSelections - callback to replace whole `selections` map
 * @param urls - full urls data, including latest github releases.
 * @param tool - one of `tools`
 * @param channel - one of `channels`
 * @param name - text for Name column
 * @returns a row object suitable for <Table>.
 */
export const toolRow = (expanded, selections, setSelections, urls, tool, channel, name) => {
  const { OS, architecture } = (
    selections[tool] || initialSelection(urls, tool, channel, detectOS())
  );
  // Callbacks for dropdowns:
  const onChangeOS = (newOS) => {
    let newArchitecture = architecture;
    // Invalidate arch selection if not compatible
    if (!has(urls, [tool, channel, architecture, newOS])) {
      const optionsForOS = architecturesForToolOS(urls, tool, channel, newOS);
      newArchitecture = optionsForOS.length > 1 ? 'select' : optionsForOS[0].value;
    }
    setSelections({ ...selections, [tool]: { OS: newOS, architecture: newArchitecture } });
  };
  const onChangeArchitecture = (newArchitecture) => {
    setSelections({ ...selections, [tool]: { OS, architecture: newArchitecture } });
  };

  // If Github API fetching of last release fails, we can't link to direct download,
  // fallback to navigating to last release page in new tab, where user will pick OS/arch.
  let fallback = null;
  if (allOperatingSystemsForTool(urls, tool, channel).length === 0) {
    fallback = get(urls, [tool, channel, 'fallbackNavigateURL']);

    return {
      isOpen: !!expanded[tool],
      expandKey: tool, // custom property for `onCollapse` callback
      cells: [
        '',
        { title: name },
        '', // hide OS dropdown
        '', // hide architecture dropdown
        {
          title: (
            <AlignRight>
              <DownloadButton url={fallback} download={false} tool={tool} text="Download" />
            </AlignRight>
          ),
        },
      ],
    };
  }

  const url = get(urls, [tool, channel, architecture, OS]);
  return {
    isOpen: !!expanded[tool],
    expandKey: tool, // custom property for `onCollapse` callback
    cells: [
      '',
      { title: name },
      { title: operatingSystemDropdown(urls, tool, channel, OS, onChangeOS) },
      { title: architectureDropdown(urls, tool, channel, OS, architecture, onChangeArchitecture) },
      {
        title: (
          <AlignRight><DownloadButton url={url} tool={tool} text="Download" /></AlignRight>
        ),
      },
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

const cliToolRows = (expanded, selections, setSelections, urls) => [
  toolRow(expanded, selections, setSelections, urls, tools.CLI_TOOLS, channels.STABLE, 'OpenShift command-line interface (oc)'),
  descriptionRow(0,
    <TextContent>
      <Text>
        Create applications and manage OpenShift projects from the command line
        using the OpenShift CLI (oc).
      </Text>
      <Text>
        Get started with the OpenShift CLI for
        {' '}
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
    </TextContent>),

  toolRow(expanded, selections, setSelections, urls, tools.OCM, channels.STABLE,
    <>
      OCM API command-line interface (ocm-cli)
      {' '}
      <DevPreviewBadge />
    </>),
  descriptionRow(2,
    <TextContent>
      <Text>
        Manage your OpenShift clusters from the command line using the
        OpenShift Cluster Manager CLI (ocm CLI).
      </Text>
      <Text>
        <ExternalLink href={links.OCM_CLI_DOCS}>
          Get started with the ocm CLI
        </ExternalLink>
      </Text>
    </TextContent>),

  toolRow(expanded, selections, setSelections, urls, tools.ROSA, channels.STABLE, 'Red Hat OpenShift Service on AWS (ROSA) command-line interface (rosa CLI)'),
  descriptionRow(4,
    <Text>
      Manage your Red Hat OpenShift Service on AWS (ROSA) clusters
      from the command line using the rosa CLI.
      {' '}
      <ExternalLink href={links.ROSA_DOCS}>
        Get started with rosa CLI
      </ExternalLink>
    </Text>),
];

const devToolRows = (expanded, selections, setSelections, urls) => [
  toolRow(expanded, selections, setSelections, urls, tools.ODO, channels.STABLE, 'Developer-focused CLI for OpenShift (odo)'),
  descriptionRow(0,
    <Text>
      Write, build, and deploy applications on OpenShift with odo, a fast, iterative,
      and straightforward CLI tool for developers.
      {' '}
      <ExternalLink href={links.ODO_DOCS}>Learn more</ExternalLink>
    </Text>),

  toolRow(expanded, selections, setSelections, urls, tools.HELM, channels.STABLE, 'Helm 3 CLI'),
  descriptionRow(2,
    <Text>
      Define, install, and upgrade application packages as Helm charts using Helm 3,
      a package manager for Kubernetes.
      {' '}
      <ExternalLink href={links.HELM_DOCS}>Learn more</ExternalLink>
    </Text>),

  toolRow(expanded, selections, setSelections, urls, tools.RHOAS, channels.STABLE,
    <>
      Red Hat OpenShift Application Services CLI (rhoas CLI)
      <DevPreviewBadge />
    </>),
  descriptionRow(4,
    <TextContent>
      <Text>
        Create and manage Kafka instances and topics, service accounts, and more
        using the rhoas CLI.
      </Text>
      <Text>
        <ExternalLink href={links.RHOAS_CLI_DOCS}>
          Get started with the rhoas CLI
        </ExternalLink>
      </Text>
    </TextContent>),
];

const installationRows = (expanded, selections, setSelections, urls) => [
  toolRow(expanded, selections, setSelections, urls, tools.X86INSTALLER, channels.STABLE, 'OpenShift for x86_64 Installer'),
  descriptionRow(0,
    <TextContent>
      <Text>
        Download and extract your operating system&apos;s installation program and
        place the file in the directory where you&apos;ll store your configuration details.
        Then, create clusters on supported x86_64 infrastructure using our
        {' '}
        <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink>
        {' '}
        as a guide.
      </Text>
      <Text>
        Learn how to deploy in the
        {' '}
        <Link to="/create">cloud</Link>
        , or in your
        {' '}
        <Link to="/create/datacenter">data center</Link>
        .
      </Text>
    </TextContent>),

  toolRow(expanded, selections, setSelections, urls, tools.IBMZINSTALLER, channels.STABLE, 'OpenShift for IBM Z Installer'),
  descriptionRow(2,
    <TextContent>
      <Text>
        Download and extract your operating system&apos;s installation program and
        place the file in the directory where you&apos;ll store your configuration details.
        Then, create clusters on supported IBM Z infrastructure using our
        {' '}
        <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink>
        {' '}
        as a guide.
      </Text>
      <Text>
        Learn how to deploy in your
        {' '}
        <Link to="/install/ibmz/user-provisioned">data center</Link>
        .
      </Text>
    </TextContent>),

  toolRow(expanded, selections, setSelections, urls, tools.PPCINSTALLER, channels.STABLE, 'OpenShift for Power Installer'),
  descriptionRow(4,
    <TextContent>
      <Text>
        Download and extract your operating system&apos;s installation program and
        place the file in the directory where you&apos;ll store your configuration details.
        Then, create clusters on supported Power infrastructure using our
        {' '}
        <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink>
        {' '}
        as a guide.
      </Text>
      <Text>
        Learn how to deploy in your
        {' '}
        <Link to="/install/power/user-provisioned">data center</Link>
        .
      </Text>
    </TextContent>),

  toolRow(expanded, selections, setSelections, urls, tools.ARMINSTALLER, channels.PRE_RELEASE,
    <>
      OpenShift for ARM Installer
      {' '}
      <DevPreviewBadge />
    </>),
  descriptionRow(6,
    <TextContent>
      <Text>
        Download and extract your operating system&apos;s installation program and
        place the file in the directory where you&apos;ll store your configuration details.
        Then, create clusters on supported ARM infrastructure using our
        {' '}
        <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink>
        {' '}
        as a guide.
      </Text>
      <Text>
        Learn how to deploy in
        {' '}
        <Link to="/install/aws/arm">AWS</Link>
        .
      </Text>
    </TextContent>),

  toolRow(expanded, selections, setSelections, urls, tools.CRC, channels.STABLE, 'CodeReady Containers'),
  descriptionRow(8,
    <TextContent>
      <Text>
        Download and open the CodeReady Containers file to automatically start
        a step-by-step installation guide.
      </Text>
      <Text>
        <Link to="/create/local">Create a minimal cluster on your desktop</Link>
        {' '}
        for local development and testing.
      </Text>
    </TextContent>),
];

const tokenColumns = [
  {
    title: null,
    cellFormatters: [expandable],
    transforms: [cellWidth(10)],
  },
  {
    title: null,
    transforms: [cellWidth(90)],
  },
  {
    title: null,
    transforms: [cellWidth(10)],
  },
];

/** Used to track row collapsed/expanded state */
const expandKeys = {
  ...tools,
  // the rest should be distinct from `tools` keys.
  PULL_SECRET: 'PULL_SECRET',
  TOKEN_OCM: 'TOKEN_OCM',
};

const tokenRows = (expanded, token) => [
  {
    isOpen: !!expanded[expandKeys.PULL_SECRET],
    expandKey: expandKeys.PULL_SECRET, // custom property for `onCollapse` callback
    cells: [
      '',
      'Pull secret',
      {
        title: (
          <AlignRight>
            <Split hasGutter>
              <SplitItem>
                <CopyPullSecret token={token} text="Copy" variant="link-inplace" />
              </SplitItem>
              <SplitItem>
                <DownloadPullSecret token={token} text="Download" />
              </SplitItem>
            </Split>
          </AlignRight>
        ),
      },
    ],
  },
  descriptionRow(0,
    <TextContent>
      <Text>
        An image pull secret provides authentication for the cluster to access services and
        registries which serve the container images for OpenShift components.
        Every individual user gets a single pull secret generated.
        The pull secret can be used when installing clusters, based on the required infrastructure.
      </Text>
      <Text>
        Learn how to
        {' '}
        <Link to="/create">
          create a cluster
        </Link>
        {' '}
        or
        {' '}
        <ExternalLink href={links.OCM_DOCS_PULL_SECRETS}>
          learn more about pull secrets
        </ExternalLink>
        .
      </Text>
    </TextContent>),

  {
    isOpen: !!expanded[expandKeys.TOKEN_OCM],
    expandKey: expandKeys.TOKEN_OCM, // custom property for `onCollapse` callback
    cells: [
      '',
      'OpenShift Cluster Manager API Token',
      {
        title: (
          <AlignRight>
            <Link to="/token">
              <Button variant="secondary" icon={<ArrowRightIcon />} iconPosition="right">
                View API token
              </Button>
            </Link>
          </AlignRight>
        ),
      },
    ],
  },
  descriptionRow(2,
    <Text>
      Use your API token to authenticate against your OpenShift Cluster Manager account.
    </Text>),
];

class DownloadsPage extends React.Component {
  static initialExpanded() {
    const initial = {};
    Object.keys(expandKeys).forEach((tool) => {
      initial[tool] = false;
    });
    return initial;
  }

  state = {
    selectedCategory: 'ALL', // one of `downloadsCategoryTitles` keys
    expanded: DownloadsPage.initialExpanded(), // { [tool]: isOpen }
    selections: {}, // { [tool]: { OS, architecture} }
  }

  componentDidMount() {
    const { getAuthToken, githubReleases, getLatestRelease } = this.props;
    getAuthToken();
    githubReleasesToFetch.forEach((repo) => {
      if (!githubReleases[repo].fulfilled) {
        getLatestRelease(repo);
      }
    });
  }

  setCategory = (selectedCategory) => {
    this.setState({ selectedCategory });
  }

  onCollapse = (event, rowIndex, newOpen, rowData) => {
    this.setState(produce((draft) => {
      draft.expanded[rowData.expandKey] = newOpen;
    }));
  }

  setSelections = (selections) => {
    this.setState({ selections });
  }

  render() {
    const { token, githubReleases } = this.props;
    const { selectedCategory, expanded, selections } = this.state;

    const urls = urlsSelector(githubReleases);
    const rowsByCategory = {
      CLI: cliToolRows(expanded, selections, this.setSelections, urls),
      DEV: devToolRows(expanded, selections, this.setSelections, urls),
      INSTALLATION: installationRows(expanded, selections, this.setSelections, urls),
      TOKENS: tokenRows(expanded, token),
    };
    rowsByCategory.ALL = [].concat(...Object.values(rowsByCategory));

    // Expand if at least one collapsed, collapse if all expanded.
    const shownKeys = rowsByCategory[selectedCategory].map(row => row.expandKey).filter(Boolean);
    const allExpanded = shownKeys.every(key => expanded[key]);
    const willExpandAll = !allExpanded;

    const expandCollapseAll = () => {
      this.setState(produce((draft) => {
        shownKeys.forEach((key) => {
          draft.expanded[key] = willExpandAll;
        });
      }));
    };

    return (
      <>
        <PageHeader className="downloads-page-header">
          <Split>
            <SplitItem isFilled>
              <PageHeaderTitle className="ocm-page-title" title="Downloads" />
            </SplitItem>
          </Split>
          <Split className="subheader">
            <SplitItem>
              <DownloadsCategoryDropdown
                selectedCategory={selectedCategory}
                setCategory={this.setCategory}
              />
            </SplitItem>
            <SplitItem>
              <ExpandableSectionToggle
                className="expand-collapse-all"
                isExpanded={!willExpandAll}
                onToggle={expandCollapseAll}
              >
                {willExpandAll ? 'Expand all' : 'Collapse all'}
              </ExpandableSectionToggle>
            </SplitItem>
          </Split>
        </PageHeader>

        <PageSection>
          <PageSection variant="light" padding={{ default: 'noPadding' }} className="downloads-page-body">
            <DownloadsSection
              selectedCategory={selectedCategory}
              category="CLI"
              description={(
                <Text>
                  Download command line tools to manage and work with OpenShift from your terminal.
                </Text>
              )}
            >
              <Table
                aria-label="CLI tools table"
                cells={columns}
                rows={rowsByCategory.CLI}
                onCollapse={this.onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </DownloadsSection>

            <DownloadsSection
              selectedCategory={selectedCategory}
              category="DEV"
              description={(
                <Text>
                  Access all the powers of Kubernetes through a simplified workflow with
                  Red Hat’s developer tools.
                  {' '}
                  <ExternalLink href="https://developers.redhat.com/topics/developer-tools">Learn more</ExternalLink>
                </Text>
              )}
            >
              <Table
                aria-label="Developer tools table"
                cells={columns}
                rows={rowsByCategory.DEV}
                onCollapse={this.onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </DownloadsSection>

            <DownloadsSection
              selectedCategory={selectedCategory}
              category="INSTALLATION"
              description={(
                <Text>
                  Install OpenShift based on your infrastructure.
                  For the installer matching your infrastructure type, select
                  the operating system and architecture on which you wish to
                  run the installer.  Then follow the steps provided
                  within your infrastructure&apos;s tab on the
                  {' '}
                  <Link to="/create">create cluster</Link>
                  {' '}
                  page to install an OpenShift cluster.
                </Text>
              )}
            >
              <Table
                aria-label="OpenShift installation table"
                cells={columns}
                rows={rowsByCategory.INSTALLATION}
                onCollapse={this.onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </DownloadsSection>

            <DownloadsSection category="TOKENS" selectedCategory={selectedCategory}>
              <Table
                aria-label="Tokens table"
                cells={tokenColumns}
                rows={rowsByCategory.TOKENS}
                onCollapse={this.onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </DownloadsSection>
          </PageSection>
        </PageSection>
      </>
    );
  }
}
DownloadsPage.propTypes = {
  token: PropTypes.object.isRequired,
  getAuthToken: PropTypes.func.isRequired,
  githubReleases: PropTypes.object.isRequired,
  getLatestRelease: PropTypes.func.isRequired,
};

export default DownloadsPage;
