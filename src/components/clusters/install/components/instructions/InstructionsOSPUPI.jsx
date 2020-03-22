import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import DeveloperPreviewStatements from './components/DeveloperPreviewStatements';

function InstructionsOSPUPI({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Red Hat OpenStack Platform with user-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="developer-preview">
            <CodeIcon />
            {' '}
            Developer Preview
          </div>
          {token.error && <TokenErrorAlert token={token} />}
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Red Hat OpenStack Platform using infrastructure that
              you provide.
            </p>
            <DeveloperPreviewStatements />

            <GetStarted docURL={links.INSTALL_OSPUPI_GETTING_STARTED} />
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_OSPUPI_INSTALLER_LATEST}
        cliURL={links.INSTALL_OSPUPI_CLI_LATEST}
        rhcosLearnMoreURL={links.INSTALL_OSPUPI_RHCOS_LEARN_MORE}
        rhcosDownloadURL={links.INSTALL_OSPUPI_DOWNLOAD_RHCOS_LATEST}
      />
    </>
  );
}

InstructionsOSPUPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsOSPUPI;
