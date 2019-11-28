import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import PullSecretSection from './PullSecretSection';
import DownloadButton from './DownloadButton';
import CLISection from './CLISection';
import RHCOSSection from './RHCOSSection';
import DeveloperPreviewSection from './DeveloperPreviewSection';
import links from '../../../../../../common/installLinks';

function DownloadsAndPullSecretSection({
  installerURL,
  cliURL,
  rhcosLearnMoreURL,
  token,
  rhcosDownloadURL,
  showPreReleaseDocs = false,
  showPreReleasePageLink = true,
  children,
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
            OpenShift Installer
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
              <a href={links.INSTALL_PRE_RELEASE_INSTALLER_DOC} target="_blank">
                latest installer documentation
                {' '}
                <span className="fa fa-external-link" aria-hidden="true" />
              </a>
              .
            </p>
          )}
          <p>
            <DownloadButton
              installerURL={installerURL}
              token={token}
            />
          </p>
          {showPreReleasePageLink && <DeveloperPreviewSection />}

          <Title headingLevel="h3" size="md" className="downloads-subtitle">Pull Secret</Title>
          <PullSecretSection token={token} />

          <p />

          {(rhcosLearnMoreURL || rhcosDownloadURL) && (
            <React.Fragment>
              <h3 className="pf-c-title pf-m-md downloads-subtitle">
                Red Hat Enterprise Linux CoreOS (RHCOS)
              </h3>
              <RHCOSSection
                downloadURL={rhcosDownloadURL || links.DOWNLOAD_RHCOS_LATEST}
                learnMoreURL={rhcosLearnMoreURL}
                token={token}
              />
            </React.Fragment>
          )}

          <Title headingLevel="h3" size="md" className="downloads-subtitle">Command-Line Interface</Title>
          <CLISection toolsURL={cliURL} />

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
};

export default DownloadsAndPullSecretSection;
