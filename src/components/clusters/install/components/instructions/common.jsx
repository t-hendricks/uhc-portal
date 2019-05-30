import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
} from 'patternfly-react';
import {
  Button,
  Popover,
} from '@patternfly/react-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';
import config from '../../../../../config';

const DownloadButton = ({ token }) => (
  <Button
    component="a"
    href={config.configData.installerURL}
    target="_blank"
    variant="primary"
    className="install--download-installer"
    disabled={!!token.error}
    tabIndex="-1"
  >
    Download Installer
  </Button>
);
DownloadButton.propTypes = {
  token: PropTypes.object.isRequired,
};

const TelemetryAlert = () => (
  <div className="alert alert-warning">
    <span className="pficon pficon-warning-triangle-o" />
    Red Hat collects a limited amount of telemetry data. By installing OpenShift Container
    Platform 4, you accept our data collection policy.
    {' '}
    <a href="https://github.com/openshift/telemeter/blob/master/docs/data-collection.md" target="_blank">
      Learn more
      {' '}
      <span className="fa fa-external-link" aria-hidden="true" />
    </a>
    {' '}
    about the data we collect.
  </div>
);

const TokenErrorAlert = ({ token }) => (
  <Alert
    variant="danger"
    className="install--errors"
    title={token.error.msg}
  >
    Please try again by refreshing the page.
    If the problem persists, please report the issue to
    {' '}
    <a href="mailto:***REMOVED***" target="_blank">
      ***REMOVED***
      {' '}
      <span className="fa fa-external-link" aria-hidden="true" />
    </a>
    .
  </Alert>
);
TokenErrorAlert.propTypes = {
  token: PropTypes.object.isRequired,
};

const GetStarted = ({ docURL }) => (
  <React.Fragment>
    <p>
      Follow the
      {' '}
      <a href={docURL} target="_blank">
        official documentation
        {' '}
        <span className="fa fa-external-link" aria-hidden="true" />
      </a>
      {' '}
      for detailed installation instructions.
    </p>
    <Button component="a" href={docURL} target="_blank" variant="primary">
      Get Started
    </Button>
    <p />
    <p>
      Relevant downloads are provided below.
    </p>
  </React.Fragment>
);
GetStarted.propTypes = {
  docURL: PropTypes.string.isRequired,
};

const CLISection = () => (
  <React.Fragment>
    <p>
      Download the OpenShift command-line tools and add them to your
      {' '}
      <code>PATH</code>
      .
    </p>
    <div>
      <a href={config.configData.commandLineToolsURL} target="_blank">
        <Button
          variant="secondary"
          className="install--download-cli"
          tabIndex="-1"
        >
          Download Command-Line Tools
        </Button>
      </a>
    </div>
    <p />
    <p>
      When the installer is complete you will see the console URL and credentials for
      accessing your new cluster. A
      {' '}
      <code>kubeconfig</code>
      {' '}
      file will also be generated for you to use with the
      {' '}
      <code>oc</code>
      {' '}
      CLI tools you downloaded.
    </p>
  </React.Fragment>
);

const PullSecretSection = ({
  tokenView, token, onCopy, copied,
}) => (
  <React.Fragment>
    <p>
      Download or copy your pull secret. The install program will prompt you for your pull
      secret during installation.
    </p>
    <div>
      <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
        <Button
          variant="secondary"
          disabled={!token || !!token.error}
        >
          Download Pull Secret
        </Button>
      </Download>
      <CopyToClipboard
        text={tokenView}
        onCopy={onCopy}
      >
        <span style={{ margin: '10px' }}>
          <button
            id="copyPullSecret"
            className="pf-c-button pf-m-link pf-m-inline install--copy-pull-secret"
            type="button"
            tabIndex="0"
            disabled={!token || !!token.error}
          >
            <span className="fa fa-paste" aria-hidden="true" />
            &nbsp;
            Copy Pull Secret
          </button>
          { copied && ' Copied!' }
        </span>
      </CopyToClipboard>
    </div>
  </React.Fragment>
);
PullSecretSection.propTypes = {
  tokenView: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired,
  copied: PropTypes.bool.isRequired,
};

const RHCOSSection = ({ learnMoreURL, token }) => (
  <React.Fragment>
    <p>
      Download RHCOS to create machines for your cluster to use during installation.
      {' '}
      <a href={learnMoreURL} target="_blank">
        Learn more
        {' '}
        <span className="fa fa-external-link" aria-hidden="true" />
        .
      </a>
    </p>
    <p>
      <a href="https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.1/latest/" target="_blank">
        <Button
          variant="secondary"
          className="install--download-installer"
          disabled={!!token.error}
          tabIndex="-1"
        >
          Download RHCOS
        </Button>
      </a>
    </p>
  </React.Fragment>
);
RHCOSSection.propTypes = {
  learnMoreURL: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
};

const WhatIsInstallerSection = ({ isIPI }) => (
  <React.Fragment>
    <Popover
      position="top"
      aria-label="What is the OpenShift installer?"
      bodyContent={(
        <div>
          The OpenShift Installer is a command-line installation wizard, prompting the user
          for values that it cannot determine on its own and providing reasonable defaults
          for everything else.
          { isIPI && (
            <React.Fragment>
              For more advanced users, the installer provides facilities
              for varying levels of customization.
              {' '}
              <a href="https://docs.openshift.com/container-platform/4.1/installing/installing_aws/installing-aws-customizations.html" target="_blank">
                Learn more
                {' '}
                <span className="fa fa-external-link" aria-hidden="true" />
              </a>
              .
            </React.Fragment>
          )}
        </div>
      )}
    >
      <a href="#" onClick={e => e.preventDefault()} className="popover-hover">
        <span className="pficon pficon-info" />
        {' '}
        What is the OpenShift installer?
      </a>
    </Popover>
  </React.Fragment>
);
WhatIsInstallerSection.propTypes = {
  isIPI: PropTypes.bool.isRequired,
};

export {
  CLISection,
  DownloadButton,
  GetStarted,
  PullSecretSection,
  RHCOSSection,
  TelemetryAlert,
  TokenErrorAlert,
  WhatIsInstallerSection,
};
