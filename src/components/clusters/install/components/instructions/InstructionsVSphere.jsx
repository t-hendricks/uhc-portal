import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import EvaluationAlert from './components/EvaluationAlert';

function InstructionsVSphere({ token }) {
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

            <GetStarted docURL={links.INSTALL_VSPHERE_GETTING_STARTED} />
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_VSPHERE_INSTALLER_LATEST}
        rhcosLearnMoreURL={links.INSTALL_VSPHERE_RHCOS_LEARN_MORE}
        cliURL={links.INSTALL_VSPHERE_CLI_LATEST}
      />
    </>
  );
}

InstructionsVSphere.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsVSphere;
