import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Alert, Button, Col, Grid, Row,
} from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Download from '@axetroy/react-download';
import config from '../../../../config';

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copied: false };
  }

  render() {
    const { copied } = this.state;
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
            <h1>Create Self-Managed Cluster (OCP)</h1>
            <p>
              To create a self-managed OpenShift Container Platform cluster,
              follow the installation instructions below.
            </p>
            <h3>Step 1: Download Pull Secret</h3>
            <p>
              Download or copy this JSON file for use during the installation process
            </p>
            <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
              <Button disabled={!!token.error} autofocus="true">
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
                  type="button"
                  className="fa fa-paste btn-text-link"
                  tabIndex="-1"
                  disabled={!!token.error}
                >
                  &nbsp;
                  Copy Pull Secret
                </button>
                { copied && ' Copied!' }
              </span>
            </CopyToClipboard>

            <h3>Step 2: Run the OpenShift Container Platform Installer</h3>
            <Alert type="info">
              Download and extract the OCP Installer to a directory of your
              choosing. Run the installer and follow the installation prompts.
              The authorization token provided above is required to complete
              the installation. The installation may take some time to complete.
              The installer will notify you of its results upon completion.
              Please note the new cluster will not appear among your clusters
              until the external installation process is complete.
            </Alert>
            <a href={config.configData.installerURL} target="_blank">
              <Button
                className="install--download-installer"
                disabled={!!token.error}
              >
                <span className="fa fa-download" />
                &nbsp;
                Download OCP Installer
              </Button>
            </a>
            <p>
              <Link to="/clusters">
                <Button style={{ marginTop: '20px' }}>
                  Done
                </Button>
              </Link>
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
