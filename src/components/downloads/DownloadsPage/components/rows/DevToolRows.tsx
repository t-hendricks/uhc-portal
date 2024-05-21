import React from 'react';

import { Text, TextContent } from '@patternfly/react-core';

import links, { channels, tools } from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import SupportLevelBadge, {
  COOPERATIVE_COMMUNITY,
  DEV_PREVIEW,
} from '~/components/common/SupportLevelBadge';

import { DownloadsPageRowsType } from './DownloadsPageRowsType';
import ToolAndDescriptionRows from './ToolAndDescriptionRows';

type DevToolRowsProps = DownloadsPageRowsType;

const DevToolRows = ({
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
}: DevToolRowsProps) => {
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

export default DevToolRows;
