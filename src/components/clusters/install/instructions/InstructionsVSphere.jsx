import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import EvaluationAlert from './components/EvaluationAlert';
import links, { channels } from '../../../../common/installLinks';

function InstructionsVSphere({ token }) {
  const cloudProviderID = window.location.pathname;
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on vSphere with user-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform you can install a cluster on vSphere using
              infrastructure that you provide.
            </p>

            <GetStarted
              docURL={links.INSTALL_VSPHERE_GETTING_STARTED}
              cloudProviderID={cloudProviderID}
            />
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        rhcosLearnMoreURL={links.INSTALL_VSPHERE_RHCOS_LEARN_MORE}
        cloudProviderID={cloudProviderID}
        channel={channels.STABLE}
      />
    </>
  );
}

InstructionsVSphere.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsVSphere;
