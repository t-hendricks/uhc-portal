import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import {
  Alert, Button, Col, Grid, Row,
} from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';
import config from '../../../../config';

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      alertVisible: true,
    };
  }

  componentDidMount() {
    $('.react-download-container button').focus();
  }

  dismissAlert = () => {
    this.setState({ alertVisible: false });
  };

  render() {
    const { copied, alertVisible } = this.state;
    const { token } = this.props;
    const tokenView = token.error ? '' : JSON.stringify(token, null, 2);

    return (
      <Grid>
        <Row>
          <Col xs={12} sm={12} md={9} lg={9}>
            {
              token.error && (
                <Alert
                  type="error"
                  style={{ marginTop: '20px' }}
                  className="install--errors"
                >
                  <p>
                    {token.error.msg}
                  </p>
                  <p>
                    Please try again by refreshing the page.
                    If the problem persists, please contact Red Hat support.
                  </p>
                </Alert>
              )
            }

            {
              alertVisible && (
                <Alert
                  type="info"
                  onDismiss={this.dismissAlert}
                  className="cluster-install-alert"
                >
                  <h3>Welcome to OpenShift 4.0</h3>
                  <p>
                    First you must create a cluster by following the steps
                    below. Once you have followed the installation process and
                    your cluster has been created, you will see the cluster
                    details.
                  </p>
                </Alert>
              )}
            <h1>Create Self-Managed Cluster (OCP)</h1>
            <p>
              To create a self-managed OpenShift Container Platform cluster,
              follow the installation instructions below.
            </p>
            <a href={config.configData.documentationURL} target="_blank">
              View Installation Instructions
              &nbsp;
              <span className="fa fa-external-link" />
            </a>
            <h3 className="cluster-install-step">Step 1: Download Pull Secret</h3>
            <p>
              Download or copy this JSON file for use during the installation process
            </p>
            <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
              <Button
                tabIndex="0"
                disabled={!!token.error}
                autoFocus
              >
                <span className="fa fa-download" />
                &nbsp;
                Download Pull Secret
              </Button>
            </Download>
            <CopyToClipboard
              text={tokenView}
              onCopy={() => this.setState({ copied: true })}
            >
              <span style={{ margin: '10px' }}>
                <button
                  className="btn-text-link"
                  type="button"
                  tabIndex="-1"
                  disabled={!!token.error}
                >
                  <span className="fa fa-paste" />
                  &nbsp;
                  Copy Pull Secret
                </button>
                { copied && ' Copied!' }
              </span>
            </CopyToClipboard>

            <h3 className="cluster-install-step">Step 2: Run the OpenShift Container Platform Installer</h3>
            <p>
              Download the OCP Installer to a directory of your
              choosing. Also install
              <a href={config.config.Data.terraformInstallURL} target="_blank">Terraform</a>
              in your
              <code>PATH</code>
              . Run the installer and follow the installation prompts. The
              authorization token provided above is required to complete the
              installation. The installation may take some time to complete.
              The installer will notify you of its results upon completion.
              Please note the new cluster will not appear among your clusters
              until the external installation process is complete.
            </p>
            <a href={config.configData.installerURL} target="_blank">
              <Button
                className="install--download-installer"
                disabled={!!token.error}
              >
                <span className="fa fa-download" />
                &nbsp;
                Download Installer
              </Button>
            </a>

            <h3 className="cluster-install-step">Step 3: Wait for Installation</h3>
            <p>
              If steps 1 and 2 are complete, the cluster is in the process of
              installing. Wait for the cluster to appear. Some data may take
              longer to load, but you can monitor as individual nodes are
              installed.
            </p>
            <hr />
            <h4>Help and Documentation</h4>
            <p>
              <a href={config.configData.documentationURL} target="_blank">
                View Installation Instructions
                &nbsp;
                <span className="fa fa-external-link" />
              </a>
            </p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Instructions.propTypes = {
  token: PropTypes.object.isRequired,
};

export default Instructions;
