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

function InstructionsRHV({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Install on Red Hat Virtualization with installer-provisioned infrastructure
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
        installerURL={links.INSTALL_RHV_INSTALLER_LATEST}
        cliURL={links.INSTALL_RHV_CLI_LATEST}
        showPreReleasePageLink={false}
      />
    </>
  );
}

InstructionsRHV.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsRHV;
