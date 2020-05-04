import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links, { channels } from '../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';

function InstructionsRHV({ token }) {
  const cloudProviderID = window.location.pathname;
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Red Hat Virtualization with installer-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Red Hat Virtualization using infrastructure that
              the installation program provisions and the cluster maintains.
            </p>
            <GetStarted docURL={links.INSTALL_RHV_GETTING_STARTED} />
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        showPreReleasePageLink={false}
        cloudProviderID={cloudProviderID}
        channel={channels.STABLE}
      />
    </>
  );
}

InstructionsRHV.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsRHV;
