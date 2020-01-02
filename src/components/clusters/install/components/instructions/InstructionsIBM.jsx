import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import GetStarted from './components/GetStarted';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';


function InstructionsIBM({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Install on IBM Z with User-Provisioned Infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <TelemetryAlert />
          <div className="pf-c-content">
            <p>
              With OpenShift Container Platform you can install a cluster on IBM Z
              infrastructure that you provide.
            </p>

            <GetStarted docURL={links.INSTALL_IBMZ_GETTING_STARTED} />
          </div>
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        installerURL={links.INSTALL_IBMZ_INSTALLER_LATEST}
        rhcosDownloadURL={links.DOWNLOAD_RHCOS_LATEST_IBMZ}
        rhcosLearnMoreURL={links.INSTALL_IBMZ_RHCOS_LEARN_MORE}
        cliURL={links.INSTALL_IBMZ_CLI_LATEST}
        showPreReleasePageLink={false}
      />
    </>
  );
}

InstructionsIBM.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsIBM;
