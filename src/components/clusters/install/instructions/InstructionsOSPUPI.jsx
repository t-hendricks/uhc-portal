import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links, { channels } from '../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import EvaluationAlert from './components/EvaluationAlert';

function InstructionsOSPUPI({ token }) {
  const cloudProviderID = window.location.pathname;
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Red Hat OpenStack Platform with user-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Red Hat OpenStack Platform using infrastructure that
              you provide.
            </p>
            <GetStarted
              docURL={links.INSTALL_OSPUPI_GETTING_STARTED}
              cloudProviderID={cloudProviderID}
            />
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        rhcosLearnMoreURL={links.INSTALL_OSPUPI_RHCOS_LEARN_MORE}
        rhcosDownloadURL={links.DOWNLOAD_RHCOS_LATEST}
        cloudProviderID={cloudProviderID}
        channel={channels.STABLE}
      />
    </>
  );
}

InstructionsOSPUPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsOSPUPI;
