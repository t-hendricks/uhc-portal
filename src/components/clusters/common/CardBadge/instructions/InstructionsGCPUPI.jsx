import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import EvaluationAlert from './components/EvaluationAlert';

function InstructionsGCPUPI({ token }) {
  const cloudProviderID = window.location.pathname;
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on GCP with an user-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Google Cloud Platform (GCP) using
              infrastructure that you provide.
            </p>
            <GetStarted
              docURL={links.INSTALL_GCPUPI_GETTING_STARTED}
              cloudProviderID={cloudProviderID}
            />
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_GCPUPI_INSTALLER_LATEST}
        cliURL={links.INSTALL_GCPUPI_CLI_LATEST}
        rhcosLearnMoreURL={links.INSTALL_GCPUPI_RHCOS_LEARN_MORE}
        cloudProviderID={cloudProviderID}
      />
    </>
  );
}

InstructionsGCPUPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsGCPUPI;
