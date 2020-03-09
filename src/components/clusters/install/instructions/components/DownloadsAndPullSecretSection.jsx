import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import PullSecretSection from './PullSecretSection';
import DownloadButton from './DownloadButton';
import CLISection from './CLISection';
import RHCOSSection from './RHCOSSection';
import DeveloperPreviewSection from './DeveloperPreviewSection';
import links from '../../../../../common/installLinks';

function DownloadsAndPullSecretSection({
  installerURL,
  cliURL,
  rhcosLearnMoreURL,
  token,
  rhcosDownloadURL,
  showPreReleaseDocs = false,
  showPreReleasePageLink = true,
  children,
  cloudProviderID,
}) {
  return (
    <Card>
      <div className="pf-l-grid pf-m-gutter ocm-page">
        <div className="pf-c-content">
          <h3>
            Downloads
          </h3>
          {children}
          <Title headingLevel="h3" size="md" className="downloads-subtitle">
            OpenShift installer
          </Title>
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
          <p>
            <DownloadButton
              installerURL={installerURL}
              token={token}
              cloudProviderID={cloudProviderID}
            />
          </p>
          {showPreReleasePageLink && <DeveloperPreviewSection />}

          <Title headingLevel="h3" size="md" className="downloads-subtitle">Pull secret</Title>
          <PullSecretSection token={token} cloudProviderID={cloudProviderID} />

          <p />

          {(rhcosLearnMoreURL || rhcosDownloadURL) && (
            <>
              <h3 className="pf-c-title pf-m-md downloads-subtitle">
                Red Hat Enterprise Linux CoreOS (RHCOS)
              </h3>
              <RHCOSSection
                downloadURL={rhcosDownloadURL || links.DOWNLOAD_RHCOS_LATEST}
                learnMoreURL={rhcosLearnMoreURL}
                token={token}
              />
            </>
          )}

          <Title headingLevel="h3" size="md" className="downloads-subtitle">Command-line interface</Title>
          <CLISection toolsURL={cliURL} cloudProviderID={cloudProviderID} />

        </div>
      </div>
    </Card>
  );
}

DownloadsAndPullSecretSection.propTypes = {
  installerURL: PropTypes.string.isRequired,
  cliURL: PropTypes.string.isRequired,
  rhcosLearnMoreURL: PropTypes.string,
  rhcosDownloadURL: PropTypes.string,
  showPreReleasePageLink: PropTypes.bool,
  showPreReleaseDocs: PropTypes.bool,
  token: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  cloudProviderID: PropTypes.string,
};

export default DownloadsAndPullSecretSection;
