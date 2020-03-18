import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import EvaluationAlert from './components/EvaluationAlert';
import DeveloperPreviewStatements from './components/DeveloperPreviewStatements';

function InstructionsAzureUPI({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Microsoft Azure with user-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="developer-preview">
            <CodeIcon />
            {' '}
            Developer Preview
          </div>
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Microsoft Azure using
              infrastructure that you provide.
            </p>
            <DeveloperPreviewStatements />

            <GetStarted docURL={links.INSTALL_AZUREUPI_GETTING_STARTED} />

          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_AZUREUPI_INSTALLER_LATEST}
        cliURL={links.INSTALL_AZUREUPI_CLI_LATEST}
      />
    </>
  );
}

InstructionsAzureUPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAzureUPI;
