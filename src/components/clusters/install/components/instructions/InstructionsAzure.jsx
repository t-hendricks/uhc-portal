import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import EvaluationAlert from './components/EvaluationAlert';

function InstructionsAzure({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Azure with Installer-Provisioned Infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Microsoft Azure using infrastructure that the
              installation program provisions and the cluster maintains.
            </p>

            <GetStarted docURL={links.INSTALL_AZURE_GETTING_STARTED} />

          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_AZURE_INSTALLER_LATEST}
        cliURL={links.INSTALL_AZURE_CLI_LATEST}
      />
    </>
  );
}

InstructionsAzure.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAzure;
