import React from 'react';
import PropTypes from 'prop-types';
import {
  CLISection,
  DownloadButton,
  GetStarted,
  PullSecretSection,
  TelemetryAlert,
  TokenErrorAlert,
  WhatIsInstallerSection,
} from './common';

class InstructionsAzure extends React.Component {
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

          <div className="developer-preview">
            &lt;/&gt; Developer Preview
          </div>

          {
            token.error && (
              <TokenErrorAlert token={token} />
            )
          }

          <h1>Install on Azure: User-Provisioned Infrastructure</h1>

          <TelemetryAlert />

          <p>
            With OpenShift Container Platform
            {' '}
            <strong>developer preview</strong>
            {' '}
            you can install a cluster on Microsoft Azure using infrastructure that you provide.
          </p>

          <GetStarted docURL="https://github.com/openshift/installer/tree/master/docs/user/azure" />

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
            <DownloadButton token={token} />
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

          <h3 className="pf-c-title pf-m-md downloads-subtitle">Command-Line Interface</h3>
          <CLISection />

        </div>
      </div>
    );
  }
}

InstructionsAzure.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAzure;
