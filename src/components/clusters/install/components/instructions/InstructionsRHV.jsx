import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';

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
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform
              you can install a cluster on Red Hat Virtualization using infrastructure that
              the installation program provisions and the cluster maintains.
            </p>
            <p>
            Because these are developer preview builds:
            </p>
            <ul className="dev-preview-warnings">
              <li>
              Production use is not permitted.
              </li>
              <li>
              Installation and use is not eligible for Red Hat production support.
              </li>
              <li>
              Clusters installed at pre-release versions cannot be upgraded.
              As we approach a GA milestone with these nightly builds, we will
              allow upgrades from a nightly to a nightly; however, we will not
              support an upgrade from a nightly to the final GA build of OCP.
              </li>
            </ul>

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
