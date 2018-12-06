import React from 'react';
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
    };
  }

  render() {
    const { copied } = this.state;
    const { token } = this.props;
    const tokenView = token.error ? '' : JSON.stringify(token);

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
                    If the problem persists, please report the issue in the
                    {' '}
                    <a href="https://groups.google.com/forum/#!forum/openshift-4-dev-preview" target="_blank">developer preview forum</a>
                    .
                  </p>
                </Alert>
              )
            }

            <div className="jumbotron" style={{ marginTop: '20px' }}>
              <h1 style={{ fontSize: '32px' }}>Developer Preview</h1>
              <p>
                This is a very early preview of OpenShift 4. There are still some rough edges,
                but what we want more than anything is
                {' '}
                <a href="https://groups.google.com/forum/#!forum/openshift-4-dev-preview" target="_blank">your feedback</a>
                {' '}
                on our direction and how we can be better.
              </p>
              <p className="text-right">
                <span role="img" aria-label="heart">❤️</span>
                {' '}
                The OpenShift Development Team
              </p>
            </div>

            <h1>Install OpenShift 4 on AWS</h1>
            <p>
              Use this guide to install a new OpenShift 4 preview cluster on your Amazon Web
              Services (AWS) account. We’ll get you up and running in a few quick steps:
            </p>
            <ol>
              <li>Configure your DNS</li>
              <li>Configure your AWS credentials</li>
              <li>Download the OpenShift installer</li>
              <li>Deploy the cluster</li>
              <li>Access your new cluster!</li>
            </ol>

            <h3 className="cluster-install-step">Step 1: Configure DNS</h3>
            <p>
              A DNS zone must be created and available in Route 53 for your AWS account
              before installation. Register a domain for your cluster in
              {' '}
              <a href="https://console.aws.amazon.com/route53/" target="_blank">AWS Route53</a>
              .
            </p>
            <p>
              Entries created in the Route 53 zone are expected to be resolvable from the
              nodes. In most cases this means that the zone that you are configuring must
              be a publicly resolvable zone. Verify by using
              {' '}
              <code>dig</code>
              {' '}
              to determine the nameserver of this zone.
            </p>
            <pre>
              <span className="noselect">$ </span>
              dig NS openshift.example.com @8.8.8.8
            </pre>
            <h3 className="cluster-install-step">Step 2: Configure your AWS Credentials</h3>
            <p>
              Configure your AWS credentials. See the
              {' '}
              <a href="http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-environment" target="_blank">
                AWS docs
              </a>
              {' '}
              for details.
            </p>

            <Alert
              type="warning"
            >
              <p>
                Today we require highly priviledged credentials. We recommend using a dedicated
                account to try this out. We are working to reduce and improve how we use your
                credentials.
              </p>
            </Alert>

            <h3 className="cluster-install-step">Step 3: Download the Installer</h3>
            <p>
              Download the latest version of the OpenShift installer for your operating system
              from the link below.
            </p>
            <p>
              <a href={config.configData.installerURL} target="_blank">
                <Button
                  className="install--download-installer"
                  disabled={!!token.error}
                >
                  <span className="fa fa-download" aria-hidden="true" />
                  &nbsp;
                  Download Installer
                </Button>
              </a>
            </p>

            <p>
              Once the download is complete, rename the installer and make it executable.
              For example:
            </p>
            <pre>
              <span className="noselect">$ </span>
              mv openshift-install-darwin-amd64 openshift-install
              {'\n'}
              <span className="noselect">$ </span>
              chmod +x openshift-install
            </pre>

            <h3 className="cluster-install-step" id="pull-secret">Step 4: Deploy the Cluster</h3>
            <p>
              Next, deploy the cluster following the installer’s interactive prompt. Enter your
              pull secret, provided below, when prompted:
            </p>
            <pre>
              <span className="noselect">$ </span>
              ./openshift-install create cluster
            </pre>
            <p>
              <Download file="pull-secret" content={tokenView} style={{ display: 'inline' }}>
                <Button
                  tabIndex="0"
                  disabled={!!token.error}
                >
                  <span className="fa fa-download" aria-hidden="true" />
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
                    <span className="fa fa-paste" aria-hidden="true" />
                    &nbsp;
                    Copy Pull Secret
                  </button>
                  { copied && ' Copied!' }
                </span>
              </CopyToClipboard>
            </p>

            <Alert
              type="warning"
            >
              <p>
                This preview sends telemetry data to Red Hat by default. We don&apos;t have an
                option to disable this yet. If collecting a limited amount of data about your
                cluster is a concern, please wait a few weeks till we make this optional.
              </p>
            </Alert>

            <h3 className="cluster-install-step">Step 5: Access your new cluster!</h3>
            <p>
              You have taken the first steps to create your cluster. While your cluster
              finishes installing, take a moment to download the OpenShift command-line
              tools and add them to your
              {' '}
              <code>PATH</code>
              .
            </p>
            <p>
              <a href={config.configData.commandLineToolsURL} target="_blank">
                <Button
                  className="install--download-cli"
                >
                  <span className="fa fa-download" aria-hidden="true" />
                  &nbsp;
                  Download Command-line Tools
                </Button>
              </a>
            </p>
            <p>
              When the installer is complete you will see the console URL and credentials
              for accessing your new cluster. A
              {' '}
              <code>kubeconfig</code>
              {' '}
              file will also be generated for you to use with the
              {' '}
              <code>oc</code>
              {' '}
              CLI tools you downloaded.
            </p>

            <hr />
            <h4>Help and Documentation</h4>
            <p>
              <a href={config.configData.documentationURL} target="_blank">
                View Installation Instructions
                &nbsp;
                <span className="fa fa-external-link" aria-hidden="true" />
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
