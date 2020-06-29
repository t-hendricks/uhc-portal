import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import PullSecretSection from './PullSecretSection';
import DownloadAndOSSelection from './DownloadAndOSSelection';
import CLISection from './CLISection';
import RHCOSSection from './RHCOSSection';
import DeveloperPreviewSection from './DeveloperPreviewSection';
import links from '../../../../../common/installLinks';

function DownloadsAndPullSecretSection({
  rhcosLearnMoreURL,
  token,
  rhcosDownloadURL,
  showPreReleaseDocs = false,
  showPreReleasePageLink = true,
  children,
  cloudProviderID,
  channel,
}) {
  return (
    <div className="ocp-downloads">
      {children}
      <div className="instructions-section">
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
            cloudProviderID={cloudProviderID}
          />
        </div>

        {showPreReleasePageLink && <div><DeveloperPreviewSection /></div>}
      </div>
      <div className="instructions-section">
        <Title headingLevel="h3">Pull secret</Title>
        <PullSecretSection token={token} cloudProviderID={cloudProviderID} />
      </div>
      <div className="instructions-section">
        <Title headingLevel="h3">Command line interface</Title>
        <CLISection token={token} cloudProviderID={cloudProviderID} channel={channel} />
      </div>
      {(rhcosLearnMoreURL || rhcosDownloadURL) && (
        <div className="instructions-section">
          <Title headingLevel="h3">Red Hat Enterprise Linux CoreOS (RHCOS)</Title>
          <RHCOSSection
            downloadURL={rhcosDownloadURL || links.DOWNLOAD_RHCOS_LATEST}
            learnMoreURL={rhcosLearnMoreURL}
            token={token}
          />
        </div>
      )}
    </div>
  );
}

DownloadsAndPullSecretSection.propTypes = {
  rhcosLearnMoreURL: PropTypes.string,
  rhcosDownloadURL: PropTypes.string,
  showPreReleasePageLink: PropTypes.bool,
  showPreReleaseDocs: PropTypes.bool,
  token: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  cloudProviderID: PropTypes.string,
  channel: PropTypes.string.isRequired,
};

export default DownloadsAndPullSecretSection;
