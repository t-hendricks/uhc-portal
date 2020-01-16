import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import EvaluationAlert from './components/EvaluationAlert';

function InstructionsAWSUPI({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Install on AWS with an User-Provisioned Infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform you can install a cluster on Amazon Web Services
              (AWS) using infrastructure that you provide.
            </p>

            <GetStarted docURL={links.INSTALL_AWSUPI_GETTING_STARTED} />

          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_AWSUPI_INSTALLER_LATEST}
        cliURL={links.INSTALL_AWSUPI_CLI_LATEST}
      />
    </>
  );
}

InstructionsAWSUPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAWSUPI;
