import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import CLISection from './components/CLISection';
import DeveloperPreviewSection from './components/DeveloperPreviewSection';
import DownloadButton from './components/DownloadButton';
import GetStarted from './components/GetStarted';
import PageTitle from '../../../../common/PageTitle';
import PullSecretSection from './components/PullSecretSection';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';

class InstructionsGCP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  render() {
    const { copied } = this.state;
    const { token } = this.props;
    const tokenView = token.error ? '' : `${JSON.stringify(token)}\n`;

    return (
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">

            <PageTitle title="Install on GCP: Installer-Provisioned Infrastructure" />

            {
              token.error && (
                <TokenErrorAlert token={token} />
              )
            }

            <TelemetryAlert />

            <p>
              With OpenShift Container Platform
              you can install a cluster on GCP using infrastructure that the
              installation program provisions and the cluster maintains.
            </p>

            <GetStarted docURL={links.INSTALL_GCP_GETTING_STARTED} />

            <h3>
              Downloads
            </h3>

            <h3 className="pf-c-title pf-m-md downloads-subtitle">
              OpenShift Installer
            </h3>
            <p>
              Download and extract the install program for your operating system and place the file
              in the directory where you will store the installation configuration files.
              Note: The OpenShift install program is only available for Linux and macOS at this
              time.
            </p>

            <p>
              <DownloadButton installerURL={links.INSTALL_GCP_INSTALLER_LATEST} token={token} />
            </p>

            <DeveloperPreviewSection isDevPreview={false} />

            <h3 className="pf-c-title pf-m-md downloads-subtitle">Pull Secret</h3>
            <PullSecretSection
              copied={copied}
              onCopy={() => {
                this.setState({ copied: true });
                // fix for IE
                document.getElementById('copyPullSecret').focus();
              }}
              token={token}
              tokenView={tokenView}
            />

            <p />

            <h3 className="pf-c-title pf-m-md downloads-subtitle">Command-Line Interface</h3>
            <CLISection toolsURL={links.INSTALL_GCP_CLI_LATEST} />

          </div>
        </div>
      </Card>
    );
  }
}

InstructionsGCP.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsGCP;
