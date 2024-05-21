import React from 'react';

import { Text, TextContent } from '@patternfly/react-core';

import links, { channels, tools } from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

import { DownloadsPageRowsType } from './DownloadsPageRowsType';
import ToolAndDescriptionRows from './ToolAndDescriptionRows';

type CustomInstallationRowsProps = DownloadsPageRowsType;

const CustomInstallationRows = ({
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
}: CustomInstallationRowsProps) => {
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

export default CustomInstallationRows;
