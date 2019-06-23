import React from 'react';
import PropTypes from 'prop-types';
import openshiftLogo from '../../../../../styles/images/Logo-Red_Hat-OpenShift-A-Standard-RGB.svg';
import {
  CLISection,
  DownloadButton,
  GetStarted,
  PullSecretSection,
  RHCOSSection,
  TelemetryAlert,
  TokenErrorAlert,
  WhatIsInstallerSection,
} from './common';

class InstructionsBareMetal extends React.Component {
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
      <div className="pf-l-grid pf-m-gutter">
        <div className="pf-c-content">

          {
            token.error && (
              <TokenErrorAlert token={token} />
            )
          }

          <img src={openshiftLogo} alt="OpenShift" className="openshift-logo-install" />
          <h1>Install on Bare Metal: User-Provisioned Infrastructure</h1>

          <TelemetryAlert />

          <p>
            With OpenShift Container Platform you can install a cluster on bare metal using
            infrastructure that you provide.
          </p>

          <GetStarted docURL="https://docs.openshift.com/container-platform/4.1/installing/installing_bare_metal/installing-bare-metal.html" />

          <h3>
            Downloads
          </h3>

          <h3 className="pf-c-title pf-m-md downloads-subtitle">
            OpenShift Installer
          </h3>
          <p>
            Download and extract the install program for your operating system and place the file
            in the directory where you will store the installation configuration files.
            Note: The OpenShift install program is only available for Linux and macOS at this time.
          </p>

          <p>
            <DownloadButton installerURL="https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/" token={token} />
          </p>

          <WhatIsInstallerSection isIPI={false} />

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

          <h3 className="pf-c-title pf-m-md downloads-subtitle">
            Red Hat Enterprise Linux CoreOS (RHCOS)
          </h3>
          <RHCOSSection
            learnMoreURL="https://docs.openshift.com/container-platform/4.1/installing/installing_bare_metal/installing-bare-metal.html#creating-machines-bare-metal"
            token={token}
          />

          <h3 className="pf-c-title pf-m-md downloads-subtitle">Command-Line Interface</h3>
          <CLISection toolsURL="https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/" />

        </div>
      </div>
    );
  }
}

InstructionsBareMetal.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsBareMetal;
