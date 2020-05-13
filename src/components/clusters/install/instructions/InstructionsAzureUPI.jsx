import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links, { channels } from '../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import EvaluationAlert from './components/EvaluationAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';

function InstructionsAzureUPI({ token }) {
  const cloudProviderID = window.location.pathname;
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Microsoft Azure with user-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Microsoft Azure using
              infrastructure that you provide.
            </p>
            <GetStarted
              docURL={links.INSTALL_AZUREUPI_GETTING_STARTED}
              cloudProviderID={cloudProviderID}
            />

          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        cloudProviderID={cloudProviderID}
        channel={channels.PRE_RELEASE}
      />
    </>
  );
}

InstructionsAzureUPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAzureUPI;
