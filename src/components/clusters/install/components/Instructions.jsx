import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Alert, Button, Col, Grid, Row,
} from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
            <h2>Copy Your Authorization Token</h2>
            <pre>
              {tokenView}
            </pre>
            <CopyToClipboard
              text={tokenView}
              onCopy={() => this.setState({ copied: true })}
            >
              <p>
                <Button
                  bsSize="small"
                  className="install--copy-token"
                  disabled={!!token.error}
                >
                  Copy to Clipboard
                </Button>
                { copied && ' Copied!' }
              </p>
            </CopyToClipboard>
            <h2>Run the OpenShift Container Platform Installer</h2>
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
                block="true"
                bsSize="large"
                bsStyle="primary"
                className="install--download-installer"
                disabled={!!token.error}
              >
                Download OCP Installer
              </Button>
            </a>
            <Link to="/clusters">
              <Button style={{ marginTop: '20px' }}>
                Done
              </Button>
            </Link>
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
