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
          <Col xs={12} sm={12} md={12} lg={12}>
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
                <a href="https://groups.google.com/forum/#!forum/openshift-4-dev-preview" target="_blank">your&nbsp;feedback</a>
                {' '}
                on our direction and how we can be better.
              </p>
              <p className="text-right">
                <span
                  className="fa fa-heart"
                  role="img"
                  aria-label="heart"
                  style={{ color: '#cc0000' }}
                />
                {' '}
                The OpenShift Development Team
              </p>
            </div>
            <h1>Install OpenShift 4 on AWS</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
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
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
            <div className="cluster-install-callout">
              <h4>What is the OpenShift installer?</h4>
              <p>
                The OpenShift Installer is a command-line installation wizard, prompting the user
                for values that it cannot determine on its own and providing reasonable defaults
                for everything else. For more advanced users, the installer provides facilities
                for varying levels of customization.
                {' '}
                <a href="https://github.com/openshift/installer/blob/master/docs/user/overview.md#installer-overview" target="_blank">Learn more</a>
                .
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
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
          </Col>
          <Col xs={12} sm={4} md={4} lg={4} className="cluster-install-step-callout-col" />
        </Row>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
            <h3 className="cluster-install-step">Step 2: Configure your AWS Credentials</h3>
            <p>
              The installer creates a number of resources in AWS that are necessary to run
              your cluster, such as instances, VPCs, security groups, and IAM roles. To
              configure your credentials see the
              {' '}
              <a href="http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-environment" target="_blank">
                AWS docs
              </a>
              {' '}
              for details.
            </p>
            <p>
              If the installer is unable to detect your AWS access key ID and secret
              access key it will prompt for them directly.
            </p>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4} className="cluster-install-step-callout-col">
            <Alert
              type="warning"
            >
              <p>
                Today we require highly priviledged credentials. We recommend using a dedicated
                account to try this out. We are working to reduce and improve how we use your
                credentials.
              </p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
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
          </Col>
          <Col xs={12} sm={4} md={4} lg={4} className="cluster-install-step-callout-col">
            <Alert
              type="warning"
            >
              <p>
                  As part of the preview Red Hat collects a limited amount of telemetry data.
                  By participating in the preview you accept our data collection policy.
                {' '}
                <a href="https://github.com/openshift/telemeter/blob/master/docs/data-collection.md" target="_blank">Learn&nbsp;more</a>
                {' '}
                  about the data we collect.
              </p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
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
                    className="btn-text-link install--copy-pull-secret"
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
          </Col>
          <Col xs={12} sm={4} md={4} lg={4} className="cluster-install-step-callout-col">
            <div className="cluster-install-callout">
              <h4>Customizing your deployment</h4>
              <p>
                The installer allows many aspects of the clusters it creates to be customized
                by creating and editing targets.
                {' '}
                <a href="https://github.com/openshift/installer/blob/master/docs/user/overview.md#key-concepts" target="_blank">Learn more</a>
                .
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
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
          </Col>
          <Col xs={12} sm={4} md={4} lg={4} className="cluster-install-step-callout-col">
            <div className="cluster-install-callout">
              <h4>Installer troubleshooting</h4>
              <p>
                Unfortunately, there will always be some cases where OpenShift fails to install
                properly. In these events, it is helpful to understand the likely
                {' '}
                <a href="https://github.com/openshift/installer/blob/master/docs/user/troubleshooting.md#common-failures" target="_blank">failure modes</a>
                {' '}
                as well as
                {' '}
                <a href="https://github.com/openshift/installer/blob/master/docs/user/troubleshooting.md#generic-troubleshooting" target="_blank">how to troubleshoot</a>
                {' '}
                the failure.
              </p>
            </div>
          </Col>
        </Row>
        <Row className="footer">
          <Col xs={12} sm={8} md={8} lg={8} className="left-col">
            <h3 className="cluster-install-step">
              <a href="https://groups.google.com/forum/#!forum/openshift-4-dev-preview" target="_blank">
                <span
                  className="fa fa-bullhorn"
                  role="img"
                  aria-hidden="true"
                  style={{ marginRight: '10px' }}
                />
                Give us feedback
              </a>
            </h3>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4} className="cluster-install-step-callout-col" />
        </Row>
      </Grid>
    );
  }
}

Instructions.propTypes = {
  token: PropTypes.object.isRequired,
};

export default Instructions;
