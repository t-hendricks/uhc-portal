import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Grid, Row } from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createAuthToken } from '../../redux/actions';
import config from '../../config';

class InstallCluster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(createAuthToken());
  }

  render() {
    const { copied } = this.state;
    const { token } = this.props;
    const tokenView = typeof(token) === 'object'
      ? JSON.stringify(token, null, 2)
      : token

    return(
      <Grid>
        <Row>
          <Col xs={12} sm={12} md={9} lg={9}>
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
              onCopy={() => this.setState({copied: true})}
            >
              <p>
                <Button bsSize="small">
                  Copy to Clipboard
                </Button>
                { copied && " Copied!" }
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
            <Button block={true} bsSize="large" bsStyle="primary" onClick={()=> window.open(config.configData.installerURL, "_blank")}>
              Download OCP Installer
            </Button>
            <Link
              to={'/clusters'}
              className="btn btn-default"
              style={{ marginTop: '20px' }}
            >
              Return to Clusters
            </Link>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({ token: state.installCluster.token });

export default connect(
  mapStateToProps,
)(InstallCluster);
