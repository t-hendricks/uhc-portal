import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import PullSecretSection from './PullSecretSection';
import DownloadAndOSSelection from './DownloadAndOSSelection';
import CLISection from './CLISection';
import RHCOSSection from './RHCOSSection/RHCOSSection';
import DeveloperPreviewSection from './DeveloperPreviewSection';
import links from '../../../../../common/installLinks';

function DownloadsAndPullSecretSection({
  rhcosLearnMoreURL,
  token,
  showPreReleaseDocs = false,
  showPreReleasePageLink = true,
  children,
  pendoID,
  channel,
  cloudProviderID,
}) {
  return (
    <div className="ocp-downloads">
      {children}
      <div key="install" className="instructions-section">
        <Title headingLevel="h2">What you need to get started</Title>
        <Title headingLevel="h3">OpenShift installer</Title>
        <p>
          Download and extract the install program for your operating system and place the file
          in the directory where you will store the installation configuration files.
          Note: The OpenShift install program is only available for Linux and macOS at this
          time.
        </p>

        {showPreReleaseDocs && (
          <p>
              For pre-release documentation, refer to the
            {' '}
            <a href={links.INSTALL_PRE_RELEASE_INSTALLER_DOC} rel="noreferrer noopener" target="_blank">
                latest installer documentation
              {' '}
              <ExternalLinkAltIcon color="#0066cc" size="sm" />
            </a>
              .
          </p>
        )}
        <div>
          <DownloadAndOSSelection
            token={token}
            channel={channel}
            pendoID={pendoID}
          />
        </div>

        {showPreReleasePageLink && <div><DeveloperPreviewSection /></div>}
      </div>
      <div key="pull-secret" className="instructions-section">
        <Title headingLevel="h3">Pull secret</Title>
        <PullSecretSection token={token} pendoID={pendoID} />
      </div>
      <div key="cli" className="instructions-section">
        <Title headingLevel="h3">Command line interface</Title>
        <CLISection token={token} pendoID={pendoID} channel={channel} />
      </div>
      {rhcosLearnMoreURL && (
        <div key="rhcos" className="instructions-section">
          <Title headingLevel="h3">Red Hat Enterprise Linux CoreOS (RHCOS)</Title>
          <RHCOSSection
            learnMoreURL={rhcosLearnMoreURL}
            token={token}
            pendoID={pendoID}
            cloudProviderID={cloudProviderID}
          />
        </div>
      )}
    </div>
  );
}

DownloadsAndPullSecretSection.propTypes = {
  rhcosLearnMoreURL: PropTypes.string,
  showPreReleasePageLink: PropTypes.bool,
  showPreReleaseDocs: PropTypes.bool,
  token: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  pendoID: PropTypes.string,
  channel: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
};

export default DownloadsAndPullSecretSection;
