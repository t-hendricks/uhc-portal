import React from 'react';
import { produce } from 'immer';
import { get, has } from 'lodash';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom-v5-compat';

import {
  ExpandableSectionToggle,
  FormSelect,
  FormSelectOption,
  PageSection,
  Split,
  SplitItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Table as TableDeprecated } from '@patternfly/react-table/deprecated';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import { hasRestrictTokensCapability } from '~/common/restrictTokensHelper';
import { AppPage } from '~/components/App/AppPage';
import TechnologyPreview from '~/components/common/TechnologyPreview';
import { isRestrictedEnv } from '~/restrictedEnv';

import links, {
  architectureOptions,
  channels,
  githubReleasesToFetch,
  operatingSystemOptions,
  operatingSystems,
  tools,
  urlsSelector,
} from '../../../common/installLinks.mjs';
import useOrganization from '../../CLILoginPage/useOrganization';
import DownloadButton from '../../clusters/install/instructions/components/DownloadButton';
import AlignRight from '../../common/AlignRight';
import ExternalLink from '../../common/ExternalLink';
import SupportLevelBadge, {
  COOPERATIVE_COMMUNITY,
  DEV_PREVIEW,
} from '../../common/SupportLevelBadge';
import DownloadsCategoryDropdown from '../DownloadsCategoryDropdown';
import DownloadsSection from '../DownloadsSection';
import { downloadsCategories, expandKeys } from '../downloadsStructure';

import ExpandableRowPair from './ExpandableRowPair';
import TokenRows from './TokenRows';

import './DownloadsPage.scss';

const ColumnHeadings = () => (
  <Thead>
    <Tr>
      <Th width={10} />
      <Th width={40}>Name</Th>
      <Th width={20}>OS type</Th>
      <Th width={20}>Architecture type</Th>
    </Tr>
  </Thead>
);

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
export const allOperatingSystemsForTool = (urls, tool, channel) =>
  operatingSystemOptions.filter(({ value: OS }) =>
    architectureOptions.find(({ value: architecture }) =>
      has(urls, [tool, channel, architecture, OS]),
    ),
  );

/**
 * Returns relevant subset of `architectureOptions`
 * (not all of them valid for currently chosen OS, but form _some_ OS).
 */
export const allArchitecturesForTool = (urls, tool, channel) =>
  architectureOptions.filter(({ value: architecture }) =>
    operatingSystemOptions.find(({ value: OS }) => has(urls, [tool, channel, architecture, OS])),
  );

/**
 * Returns relevant subset from `architectureOptions`.
 */
export const architecturesForToolOS = (urls, tool, channel, OS) =>
  architectureOptions.filter(({ value: architecture }) =>
    has(urls, [tool, channel, architecture, OS]),
  );

export const operatingSystemDropdown = (urls, tool, channel, OS, setOS) => (
  <FormSelect
    value={OS}
    data-testid={`os-dropdown-${tool}`}
    onChange={setOS}
    aria-label="Select OS dropdown"
  >
    <FormSelectOption key="select" value="select" label="Select OS" isDisabled />
    {allOperatingSystemsForTool(urls, tool, channel).map(({ value, label }) => (
      <FormSelectOption key={value} value={value} label={label} />
    ))}
  </FormSelect>
);

export const architectureDropdown = (urls, tool, channel, OS, architecture, setArchitecture) => {
  const optionsForOS = architecturesForToolOS(urls, tool, channel, OS);
  return (
    <FormSelect
      aria-label="Select architecture dropdown"
      value={architecture}
      onChange={setArchitecture}
      isDisabled={optionsForOS.length <= 1}
      data-testid={`arch-dropdown-${tool}`}
    >
      <FormSelectOption key="select" value="select" label="Select architecture" isDisabled />
      {allArchitecturesForTool(urls, tool, channel).map(
        ({ value, label }) =>
          has(urls, [tool, channel, value, OS]) && (
            <FormSelectOption key={value} value={value} label={label} />
          ),
      )}
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
  const OSes = allOperatingSystemsForTool(urls, tool, channel).map((os) => os.value);
  const OS = detectedOS && OSes.includes(detectedOS) ? detectedOS : OSes?.[0];
  const architecture = architecturesForToolOS(urls, tool, channel, OS)?.[0]?.value;
  return { OS, architecture };
};

/**
 * Renders choice dropdowns + download button with linked behavior.
 * Does not keep state - expects state + callbacks to be passed in.
 * This allows reuse on different pages with different layouts.
 * @param selections - { [tool]: { OS, architecture } }
 * @param setSelections - callback to replace whole `selections` map
 * @param urls - either static `installLinks.urls` or result of urlsSelector() with github links.
 * @param tool - one of `tools`
 * @param channel - one of `channels`
 * @param downloadButtonProps - extra props for download button
 * @returns { osDropdown, archDropdown, downloadButton }
 */
export const downloadChoice = (
  selections,
  setSelections,
  urls,
  tool,
  channel,
  downloadButtonProps,
) => {
  const { OS, architecture } =
    selections[tool] || initialSelection(urls, tool, channel, detectOS());
  // Callbacks for dropdowns:
  const onChangeOS = (_event, newOS) => {
    let newArchitecture = architecture;
    // Invalidate arch selection if not compatible
    if (!has(urls, [tool, channel, architecture, newOS])) {
      const optionsForOS = architecturesForToolOS(urls, tool, channel, newOS);
      newArchitecture = optionsForOS.length > 1 ? 'select' : optionsForOS[0].value;
    }
    setSelections({ ...selections, [tool]: { OS: newOS, architecture: newArchitecture } });
  };
  const onChangeArchitecture = (_event, newArchitecture) => {
    setSelections({ ...selections, [tool]: { OS, architecture: newArchitecture } });
  };

  // If Github API fetching of last release fails, we can't link to direct download,
  // fallback to navigating to last release page in new tab, where user will pick OS/arch.
  if (allOperatingSystemsForTool(urls, tool, channel).length === 0) {
    const fallback = get(urls, [tool, channel, 'fallbackNavigateURL']);
    return {
      osDropdown: '', // hide dropdowns
      archDropdown: '',
      downloadButton: (
        <DownloadButton url={fallback} download={false} tool={tool} {...downloadButtonProps} />
      ),
    };
  }

  const url = get(urls, [tool, channel, architecture, OS]);
  return {
    osDropdown: operatingSystemDropdown(urls, tool, channel, OS, onChangeOS),
    archDropdown: architectureDropdown(urls, tool, channel, OS, architecture, onChangeArchitecture),
    downloadButton: <DownloadButton url={url} tool={tool} {...downloadButtonProps} />,
  };
};

const rowId = (expandKey) => `tool-${expandKey}`;

/** Row pair for a tool. */
const ToolAndDescriptionRows = ({
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
  tool,
  channel,
  name,
  description,
}) => {
  const chooser = downloadChoice(selections, setSelections, urls, tool, channel, {
    text: 'Download',
  });

  return (
    <ExpandableRowPair
      expanded={expanded}
      setExpanded={setExpanded}
      toolRefs={toolRefs}
      expandKey={tool}
      cells={[
        <Td dataLabel="Name" key={`${tool}-name`}>
          <span>{name}</span>
        </Td>,
        <Td dataLabel="OS" key={`${tool}-os`}>
          {chooser.osDropdown}
        </Td>,
        <Td dataLabel="Architecture" key={`${tool}-arch`}>
          {chooser.archDropdown}
        </Td>,
        <Td dataLabel="" key={`${tool}-download`}>
          <AlignRight>{chooser.downloadButton} </AlignRight>
        </Td>,
      ]}
      description={description}
    />
  );
};
ToolAndDescriptionRows.propTypes = {
  // { [expandKey]: boolean }
  expanded: PropTypes.object,
  // callback to replace whole `expanded` map
  setExpanded: PropTypes.func,
  // { [tool]: { OS, architecture } }
  selections: PropTypes.object,
  // callback to replace whole `selections` map
  setSelections: PropTypes.func,
  // { [tool]: ref } - to allow referring to specific tool rows
  toolRefs: PropTypes.object,
  // either static `installLinks.urls` or result of urlsSelector() with github links.
  urls: PropTypes.object,
  // one of `tools`
  tool: PropTypes.oneOf(Object.values(tools)),
  // one of `channels`
  channel: PropTypes.oneOf(Object.values(channels)),
  // text for Name column
  name: PropTypes.node,
  // content for full-width description cell
  description: PropTypes.node,
};

// TODO: changes in following functions have to be kept in sync with `downloadsCategories`.
//   Can we stop encoding order here, e.g. return mapping from expandKeys to single rows,
//   and use `downloadsCategories` as source of truth for what to show in what order?

const cliToolRows = (expanded, setExpanded, selections, setSelections, toolRefs, urls) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OC}
        channel={channels.STABLE}
        name={
          <>
            OpenShift command-line interface (<code>oc</code>)
          </>
        }
        description={
          <Text>
            Create applications and manage OpenShift projects from the command line using the
            OpenShift client <code>oc</code>.{' '}
            <ExternalLink ExternalLink href={links.CLI_TOOLS_OCP_GETTING_STARTED}>
              Get started
            </ExternalLink>
          </Text>
        }
      />

      {!isRestrictedEnv() && (
        <ToolAndDescriptionRows
          {...commonProps}
          tool={tools.OCM}
          channel={channels.STABLE}
          name={
            <>
              OpenShift Cluster Manager API command-line interface (<code>ocm</code>){' '}
              <SupportLevelBadge {...DEV_PREVIEW} />
            </>
          }
          description={
            <TextContent>
              <Text>
                Manage your OpenShift clusters from the command line using the OpenShift Cluster
                Manager API client <code>ocm</code>.{' '}
                <ExternalLink href={links.OCM_CLI_DOCS}>Get started</ExternalLink>
              </Text>
            </TextContent>
          }
        />
      )}

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.ROSA}
        channel={channels.STABLE}
        name={
          <>
            Red Hat OpenShift Service on AWS command-line interface (<code>rosa</code>)
          </>
        }
        description={
          <Text>
            Manage your Red Hat OpenShift Service on AWS (ROSA) clusters from the command line using
            the ROSA client for OCM and AWS APIs.{' '}
            <ExternalLink href={links.ROSA_CLI_DOCS}>Get started</ExternalLink>
          </Text>
        }
      />

      {!isRestrictedEnv() && (
        <>
          <ToolAndDescriptionRows
            {...commonProps}
            tool={tools.KN}
            channel={channels.STABLE}
            name={
              <>
                Knative command-line interface for OpenShift Serverless (<code>kn</code>)
              </>
            }
            description={
              <Text>
                Interact with Knative components on OpenShift Container Platform with the Knative
                client for OpenShift Serverless <code>kn</code>.{' '}
                <ExternalLink href={links.KN_DOCS}>Learn more</ExternalLink>
              </Text>
            }
          />

          <ToolAndDescriptionRows
            {...commonProps}
            tool={tools.TKN}
            channel={channels.STABLE}
            name={
              <>
                Tekton command-line interface for OpenShift Pipelines (<code>tkn</code>)
              </>
            }
            description={
              <Text>
                Manage and interact with CI pipelines on OpenShift Container Platform with the
                Tekton CLI for OpenShift Pipelines.{' '}
                <ExternalLink href={links.TKN_DOCS}>Get started</ExternalLink>
              </Text>
            }
          />
        </>
      )}
    </>
  );
};

const devToolRows = (expanded, setExpanded, selections, setSelections, toolRefs, urls) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.ODO}
        channel={channels.STABLE}
        name={
          <>
            Developer-focused CLI for OpenShift (<code>odo</code>)
            <SupportLevelBadge {...COOPERATIVE_COMMUNITY} />
          </>
        }
        description={
          <Text>
            Write, build, and deploy applications on OpenShift with <code>odo</code>, a fast,
            iterative, and straightforward CLI tool for developers.{' '}
            <ExternalLink href={links.ODO_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.HELM}
        channel={channels.STABLE}
        name={
          <>
            Helm 3 CLI (<code>helm</code>)
          </>
        }
        description={
          <Text>
            Define, install, and upgrade application packages as Helm charts using Helm 3, a package
            manager for Kubernetes. <ExternalLink href={links.HELM_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OPM}
        channel={channels.STABLE}
        name={
          <>
            Operator Package Manager (<code>opm</code>)
          </>
        }
        description={
          <Text>
            Create and maintain catalogs of Operators from a list of bundles with the Operator
            Package Manager. <ExternalLink href={links.OPM_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OPERATOR_SDK}
        channel={channels.STABLE}
        name={
          <>
            Operator SDK CLI (<code>operator-sdk</code>)
          </>
        }
        description={
          <Text>
            Build, test, and deploy Operators with the Operator SDK CLI.{' '}
            <ExternalLink href={links.OSDK_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.RHOAS}
        channel={channels.STABLE}
        name={
          <>
            Red Hat OpenShift Application Services CLI (<code>rhoas</code>){' '}
            <SupportLevelBadge {...DEV_PREVIEW} />
          </>
        }
        description={
          <TextContent>
            <Text>
              Create and manage Kafka instances and topics, service accounts, and more using{' '}
              <code>rhoas</code>.
            </Text>
            <Text>
              <ExternalLink href={links.RHOAS_CLI_DOCS}>Get started</ExternalLink>
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

const installationRows = (expanded, setExpanded, selections, setSelections, toolRefs, urls) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.X86INSTALLER}
        channel={channels.STABLE}
        name="OpenShift for x86_64 Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported x86_64 infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in the <Link to="/create">cloud</Link>, or in your{' '}
              <Link to="/create/datacenter">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.ARMINSTALLER}
        channel={channels.STABLE}
        name="OpenShift for ARM Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported ARM infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in <Link to="/install/aws/arm">AWS</Link>,{' '}
              <Link to="/install/azure/arm/installer-provisioned">Azure</Link>, or in your{' '}
              <Link to="/install/arm">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.IBMZINSTALLER}
        channel={channels.STABLE}
        name="OpenShift for IBM Z (s390x) Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported IBM Z (s390x) infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in your{' '}
              <Link to="/install/ibmz/user-provisioned">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.PPCINSTALLER}
        channel={channels.STABLE}
        name="OpenShift for Power Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported Power infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in your{' '}
              <Link to="/install/power/user-provisioned">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.MULTIINSTALLER}
        channel={channels.STABLE}
        name={
          <>
            OpenShift Installer with multi-architecture compute machines{' '}
            <TechnologyPreview className="pf-v5-u-ml-md pf-v5-u-display-inline" />
          </>
        }
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in{' '}
              <Link to="/install/azure/multi/installer-provisioned">Azure</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.CRC}
        channel={channels.STABLE}
        name={
          <>
            OpenShift Local (<code>crc</code>)
          </>
        }
        description={
          <TextContent>
            <Text>
              Download and open the OpenShift Local file to automatically start a step-by-step
              installation guide.
            </Text>
            <Text>
              <Link to="/create/local">Create a minimal cluster on your desktop</Link> for local
              development and testing.
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

const disconnectedInstallationRows = (
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.MIRROR_REGISTRY}
        channel={channels.STABLE}
        name="mirror registry for Red Hat OpenShift"
        description={
          <TextContent>
            <Text>
              Download and install a local, minimal single instance deployment of Red Hat Quay to
              aid bootstrapping the first disconnected cluster.{' '}
              <ExternalLink href={links.INSTALL_MIRROR_REGISTRY_LEARN_MORE}>
                Learn more
              </ExternalLink>
            </Text>
          </TextContent>
        }
      />
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OC_MIRROR_PLUGIN}
        channel={channels.STABLE}
        name="OpenShift Client (oc) mirror plugin"
        description={
          <TextContent>
            <Text>
              The &quot;mirror&quot; plugin for the OpenShift CLI client (oc) controls the process{' '}
              of mirroring all relevant container image for a full disconnected OpenShift{' '}
              installation in a central, declarative tool.{' '}
              <ExternalLink href={links.INSTALL_OC_MIRROR_PLUGIN_LEARN_MORE}>
                Learn more
              </ExternalLink>
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

const customInstallationRows = (
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.BUTANE}
        channel={channels.STABLE}
        name="Butane config transpiler CLI"
        description={
          <TextContent>
            <Text>
              Write and validate machine configs in a convenient short-hand syntax with the Butane
              config transpiler CLI tool.{' '}
              <ExternalLink href={links.BUTANE_DOCS}>Learn more</ExternalLink>
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.COREOS_INSTALLER}
        channel={channels.STABLE}
        name="CoreOS Installer CLI"
        description={
          <TextContent>
            <Text>
              Download and install RHCOS disk images with the coreos-installer CLI tool.{' '}
              <ExternalLink href={links.COREOS_INSTALLER_DOCS}>Learn more</ExternalLink>
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.CCOCTL}
        channel={channels.STABLE}
        name={
          <>
            Cloud Credential Operator CLI utility (<code>ccoctl</code>)
          </>
        }
        description={
          <TextContent>
            <Text>
              The ccoctl tool provides various commands to assist with the creating and maintenance
              of cloud credentials from outside the cluster (necessary when Cloud Credential
              Operator is put in Manual mode).{' '}
              <ExternalLink href={links.CCO_MANUAL_MODE}>Learn more</ExternalLink>
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

// TODO: is this useful?
const TokensHeadings = () => (
  <Thead>
    <Tr>
      <Th width={10} />
      <Th width={90} />
      <Th width={10} />
    </Tr>
  </Thead>
);

const DownloadsPage = ({ token, githubReleases, getLatestRelease, getAuthToken }) => {
  const restrictedEnv = isRestrictedEnv();
  const location = useLocation();
  const navigate = useNavigate();
  const { organization, isLoading, error } = useOrganization();
  const [restrictTokens, setRestrictTokens] = React.useState();

  const initialExpanded = () => {
    const initial = {};
    Object.values(expandKeys).forEach((key) => {
      initial[key] = false;
    });
    return initial;
  };

  const makeRefs = () => {
    const toolRefs = {};
    Object.values(expandKeys).forEach((key) => {
      toolRefs[key] = React.createRef();
    });
    return toolRefs;
  };

  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [expanded, setExpanded] = React.useState(initialExpanded());
  const [selections, setSelections] = React.useState({});

  /** "Advertise" link targets by setting #tool-foo URL.
   *
   * Takes new state as params because state is unreliable after useState().
   * @param selectedCategory string - current/new category.
   * @param expanded - { key: bool } current/new expanded.
   */
  const updateURL = (selectedCategory, expanded) => {
    let lastExpanded = null;
    const shownKeys = downloadsCategories().find((c) => c.key === selectedCategory)?.tools;
    shownKeys.forEach((key) => {
      if (expanded[key]) {
        lastExpanded = key;
      }
    });

    const hash = lastExpanded ? `#${rowId(lastExpanded)}` : '';
    if (hash !== location.hash) {
      navigate({ ...location, hash });
    }
  };

  const setExpandedState = (expanded) => {
    setExpanded(expanded);
    updateURL(selectedCategory, expanded);
  };

  const toolRefs = makeRefs();

  const focusRowByHash = () => {
    const hash = location.hash.replace('#', '');
    const key = Object.values(expandKeys).find((k) => rowId(k) === hash);
    if (key) {
      // Expand to draw attention.  setState() directly to bypass updateHash().
      setExpandedState({ ...expanded, [key]: true });

      const row = toolRefs[key]?.current;
      if (row) {
        row.scrollIntoView({ block: 'start', behavior: 'smooth' });

        // Goal: Bring keyboard focus somewhere in the chosen row.
        // .focus() only works on focusable elements - input, select, button, etc.
        // The row expand toggle happens to be a button.
        const elem = row.querySelector('button, select');
        if (elem) {
          elem.focus({ preventScroll: true });
        }
      }
    }
  };

  React.useEffect(() => {
    // check if using offline tokens is restricted
    if (
      !restrictedEnv &&
      !isLoading &&
      !error &&
      !!organization &&
      hasRestrictTokensCapability(organization.capabilities)
    ) {
      setRestrictTokens(true);
    }
  }, [organization, isLoading, error, restrictedEnv]);

  React.useEffect(() => {
    getAuthToken();
    githubReleasesToFetch.forEach((repo) => {
      if (!githubReleases[repo].fulfilled) {
        getLatestRelease(repo);
      }
    });
    focusRowByHash();

    window.addEventListener('hashchange', focusRowByHash);

    return () => {
      window.removeEventListener('hashchange', focusRowByHash);
    };
    // should be disabled -> causes infinite loop (former componentDidMount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCategory = (_event, selectedCategory) => {
    setSelectedCategory(selectedCategory);
    updateURL(selectedCategory, expanded);
  };

  const setSelectionsState = (selections) => {
    setSelections(selections);
  };

  const urls = urlsSelector(githubReleases);

  const shownKeys = downloadsCategories().find((c) => c.key === selectedCategory)?.tools;
  const allExpanded = shownKeys?.every((key) => expanded[key]);
  const willExpandAll = !allExpanded;

  const expandCollapseAll = () => {
    setExpandedState(
      produce(expanded, (draft) => {
        shownKeys.forEach((key) => {
          draft[key] = willExpandAll;
        });
      }),
    );
  };

  return (
    <AppPage title="Downloads | Red Hat OpenShift Cluster Manager">
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
              setCategory={setCategory}
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

      <PageSection className="downloads-page-body">
        <PageSection
          variant="light"
          padding={{ default: 'noPadding' }}
          className="downloads-page-body"
        >
          <DownloadsSection
            selectedCategory={selectedCategory}
            category="CLI"
            description={
              <Text>
                Download command line tools to manage and work with OpenShift from your terminal.
              </Text>
            }
          >
            <TableDeprecated aria-label="CLI tools table">
              <ColumnHeadings />
              {cliToolRows(
                expanded,
                setExpandedState,
                selections,
                setSelectionsState,
                toolRefs,
                urls,
              )}
            </TableDeprecated>
          </DownloadsSection>

          {!restrictedEnv && (
            <>
              <DownloadsSection
                selectedCategory={selectedCategory}
                category="DEV"
                description={
                  <Text>
                    Access all the powers of Kubernetes through a simplified workflow with Red Hat’s
                    developer tools.{' '}
                    <ExternalLink href="https://developers.redhat.com/topics/developer-tools">
                      Learn more
                    </ExternalLink>
                  </Text>
                }
              >
                <TableDeprecated aria-label="Developer tools table">
                  <ColumnHeadings />
                  {devToolRows(
                    expanded,
                    setExpandedState,
                    selections,
                    setSelectionsState,
                    toolRefs,
                    urls,
                  )}
                </TableDeprecated>
              </DownloadsSection>
              <DownloadsSection
                selectedCategory={selectedCategory}
                category="INSTALLATION"
                description={
                  <Text>
                    Install OpenShift based on your infrastructure. For the installer matching your
                    infrastructure type, select the operating system and architecture on which you
                    wish to run the installer. Then follow the steps provided within your
                    infrastructure&apos;s tab on the <Link to="/create">create cluster</Link> page
                    to install an OpenShift cluster.
                  </Text>
                }
              >
                <TableDeprecated aria-label="OpenShift installation table">
                  <ColumnHeadings />
                  {installationRows(
                    expanded,
                    setExpandedState,
                    selections,
                    setSelectionsState,
                    toolRefs,
                    urls,
                  )}
                </TableDeprecated>
              </DownloadsSection>

              <DownloadsSection
                selectedCategory={selectedCategory}
                category="DISCONNECTED_INSTALLATION"
                description={
                  <Text>
                    Utilities to simplify preparation of disconnected cluster installations.
                  </Text>
                }
              >
                <TableDeprecated aria-label="OpenShift disconnected installation tools table">
                  <ColumnHeadings />
                  {disconnectedInstallationRows(
                    expanded,
                    setExpandedState,
                    selections,
                    setSelectionsState,
                    toolRefs,
                    urls,
                  )}
                </TableDeprecated>
              </DownloadsSection>

              <DownloadsSection
                selectedCategory={selectedCategory}
                category="CUSTOM_INSTALLATION"
                description={
                  <Text>
                    Customize OpenShift and Red Hat Enterprise Linux CoreOS (RHCOS) installation
                    with these tools.
                  </Text>
                }
              >
                <TableDeprecated aria-label="OpenShift installation customization downloads table">
                  <ColumnHeadings />
                  {customInstallationRows(
                    expanded,
                    setExpandedState,
                    selections,
                    setSelectionsState,
                    toolRefs,
                    urls,
                  )}
                </TableDeprecated>
              </DownloadsSection>
            </>
          )}
          <DownloadsSection category="TOKENS" selectedCategory={selectedCategory}>
            <TableDeprecated aria-label="Tokens table">
              <TokensHeadings />
              <TokenRows
                expanded={expanded}
                setExpanded={setExpandedState}
                toolRefs={toolRefs}
                token={token}
                restrictTokens={restrictTokens}
                orgRequest={{ isLoading, error }}
                restrictedEnv={restrictedEnv}
              />
            </TableDeprecated>
          </DownloadsSection>
        </PageSection>
      </PageSection>
    </AppPage>
  );
};

DownloadsPage.propTypes = {
  token: PropTypes.object.isRequired,
  getAuthToken: PropTypes.func.isRequired,
  githubReleases: PropTypes.object.isRequired,
  getLatestRelease: PropTypes.func.isRequired,
};

export default DownloadsPage;
