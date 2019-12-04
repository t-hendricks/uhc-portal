import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';

function InstructionsBareMetal({ token }) {
  return (
    <React.Fragment>
      <Title headingLevel="h3" size="2xl">
        Install on Bare Metal with User-Provisioned Infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <TelemetryAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform you can install a cluster on bare metal using
              infrastructure that you provide.
            </p>

            <GetStarted docURL={links.INSTALL_BAREMETAL_GETTING_STARTED} />
          </div>
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_BAREMETAL_INSTALLER_LATEST}
        rhcosLearnMoreURL={links.INSTALL_BAREMETAL_RHCOS_LEARN_MORE}
        cliURL={links.INSTALL_BAREMETAL_CLI_LATEST}
      />
    </React.Fragment>
  );
}

InstructionsBareMetal.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsBareMetal;
