import React from 'react';
import PropTypes from 'prop-types';
import { Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import PullSecretSection from './PullSecretSection';
import DownloadAndOSSelection from './DownloadAndOSSelection';
import CLISection from './CLISection';
import RHCOSSection from './RHCOSSection/RHCOSSection';
import DeveloperPreviewSection from './DeveloperPreviewSection';
import links, { tools, channels } from '../../../../../common/installLinks.mjs';

function DownloadsAndPullSecretSection({
  token,
  showPreReleaseDocs = false,
  preReleaseDocsLink = links.INSTALL_PRE_RELEASE_INSTALLER_DOC,
  showPreReleasePageLink = true,
  preReleasePageLink = '/install/pre-release',
  children,
  pendoID,
  tool,
  channel,
  rhcos,
  isBMIPI,
}) {
  return (
    <div>
      {children}
      <Stack hasGutter>
        <StackItem key="install">
          <TextContent>
            <Text component="h2">What you need to get started</Text>
            {!isBMIPI && (
              <>
                <Text component="h3">OpenShift installer</Text>
                <Text component="p">
                  Download and extract the install program for your operating system and place the
                  file in the directory where you will store the installation configuration files.
                  Note: The OpenShift install program is only available for Linux and macOS at this
                  time.
                </Text>
                {showPreReleaseDocs && (
                  <Text component="p">
                    For pre-release documentation, refer to the{' '}
                    <Text
                      component="a"
                      href={preReleaseDocsLink}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      latest installer documentation <ExternalLinkAltIcon size="sm" />
                    </Text>
                    .
                  </Text>
                )}
                <DownloadAndOSSelection tool={tool} channel={channel} pendoID={pendoID} />
                {showPreReleasePageLink && (
                  <div>
                    <DeveloperPreviewSection devPreviewLink={preReleasePageLink} />
                  </div>
                )}
              </>
            )}
          </TextContent>
        </StackItem>
        <StackItem key="pull-secret">
          <TextContent>
            <Text component="h3">Pull secret</Text>
            <PullSecretSection token={token} pendoID={pendoID} />
          </TextContent>
        </StackItem>
        <StackItem key="cli">
          <TextContent>
            <Text component="h3">Command line interface</Text>
            <CLISection pendoID={pendoID} channel={channel} isBMIPI={isBMIPI} />
          </TextContent>
        </StackItem>
        {rhcos && (
          <StackItem key="rhcos">
            <TextContent>
              <Text component="h3">Red Hat Enterprise Linux CoreOS (RHCOS)</Text>
              <RHCOSSection token={token} pendoID={pendoID} rhcos={rhcos} />
            </TextContent>
          </StackItem>
        )}
      </Stack>
    </div>
  );
}

DownloadsAndPullSecretSection.propTypes = {
  showPreReleasePageLink: PropTypes.bool,
  showPreReleaseDocs: PropTypes.bool,
  preReleaseDocsLink: PropTypes.string,
  preReleasePageLink: PropTypes.string,
  token: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  pendoID: PropTypes.string,
  tool: PropTypes.oneOf(Object.values(tools)).isRequired,
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
  isBMIPI: PropTypes.bool,
  rhcos: PropTypes.object,
};

DownloadsAndPullSecretSection.defaultProps = {
  isBMIPI: false,
};

export default DownloadsAndPullSecretSection;
