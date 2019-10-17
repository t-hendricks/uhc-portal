import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Popover,
} from '@patternfly/react-core';
import links from '../../../../../common/installLinks';
import CLISection from './components/CLISection';
import DownloadButton from './components/DownloadButton';
import PageTitle from '../../../../common/PageTitle';
import PullSecretSection from './components/PullSecretSection';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';

class InstructionsAWSIPI extends React.Component {
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

            <PageTitle title="Install on AWS: Installer-Provisioned Infrastructure" />

            {
              token.error && (
                <TokenErrorAlert token={token} />
              )
            }

            <TelemetryAlert />

            <p>
              With OpenShift Container Platform you can install a cluster on Amazon Web Services
              (AWS) using infrastructure that the installation program provisions and the cluster
              maintains. The basic steps are outlined below. For detailed instructions, see the
              {' '}
              <a href={links.INSTALL_AWSIPI_DOCS_LANDING} target="_blank">
                official documentation
                {' '}
                <span className="fa fa-external-link" aria-hidden="true" />
              </a>
              .
            </p>

            <h3 id="prerequisites-title">
              Pre-requisites:
            </h3>
            <ul aria-labelledby="prerequisites-title">
              <li>
                <a href={links.INSTALL_AWSIPI_CONFIGURE_ACCOUNT} target="_blank">
                  Configure an AWS account
                  {' '}
                  <span className="fa fa-external-link" aria-hidden="true" />
                </a>
                {' '}
                to host your cluster
              </li>
            </ul>

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
              <DownloadButton
                installerURL={links.INSTALL_AWSIPI_INSTALLER_LATEST}
                token={token}
              />
            </p>

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
            <CLISection toolsURL={links.INSTALL_AWSUPI_CLI_LATEST} />

            <h3>Optional: Customize your deployment</h3>
            <p>
              Create the
              {' '}
              <code>install-config.yaml</code>
              {' '}
              file, providing any necessary configuration details when prompted:
            </p>

            <pre>
              <span className="noselect">$ </span>
              ./openshift-install create install-config --dir=&lt;installation_directory&gt;
            </pre>

            <p>
              To customize your cluster, you can modify the
              {' '}
              <code>install-config.yaml</code>
              {' '}
              file to provide more details about the platform.
            </p>

            <ul>
              <li>
                <a href={links.INSTALL_AWSIPI_INSTALLATION_CONFIG} target="_blank">
                  Installation configuration parameters for AWS
                  {' '}
                  <span className="fa fa-external-link" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={links.INSTALL_AWSIPI_SAMPLE_YAML} target="_blank">
                  Sample customized install-config.yaml file for AWS
                  {' '}
                  <span className="fa fa-external-link" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={links.INSTALL_AWSIPI_CUSTOMIZING_NETWORK} target="_blank">
                  Customizing your network configuration
                  {' '}
                  <span className="fa fa-external-link" aria-hidden="true" />
                </a>
              </li>
            </ul>

            <h3>Deploy the cluster</h3>
            <p>
              Deploy the cluster following the installer’s interactive prompt:
            </p>
            <pre>
              <span className="noselect">$ </span>
              ./openshift-install create cluster --dir=&lt;installation_directory&gt;
            </pre>

            <Popover
              position="top"
              aria-label="Do you need to troubleshoot your installation?"
              bodyContent={(
                <div>
                  Unfortunately, there will always be some cases where OpenShift fails to install
                  properly. In these events, it is helpful to understand the
                  {' '}
                  <a href={links.INSTALL_AWSIPI_LIKELY_FAILURE_MODES} target="_blank">
                    likely failure modes
                    {' '}
                    <span className="fa fa-external-link" aria-hidden="true" />
                  </a>
                  {' '}
                  as well as
                  {' '}
                  <a href={links.INSTALL_AWSIPI_GENERIC_TROUBLESHOOTING} target="_blank">
                    how to troubleshoot
                    {' '}
                    <span className="fa fa-external-link" aria-hidden="true" />
                  </a>
                  {' '}
                  the failure.
                </div>
                )}
            >
              <button type="button" className="popover-hover buttonHref">
                <span className="pficon pficon-info" />
                {' '}
                Do you need to troubleshoot your installation?
              </button>
            </Popover>

            <h3>Access Your Cluster</h3>
            <p>
              You can log into your cluster as a default system user by exporting the cluster
              kubeconfig file:
            </p>
            <pre>
              <span className="noselect">$ </span>
              export KUBECONFIG=&lt;installation_directory&gt;/auth/kubeconfig
              <br />
              <br />
              <span className="noselect">$ </span>
              oc whoami
              <br />
              system:admin
            </pre>

            <h3>Next Steps</h3>
            <p>
              <a href={links.INSTALL_AWSIPI_DOCS_ENTRY} target="_blank">
                Learn more
                {' '}
                <span className="fa fa-external-link" aria-hidden="true" />
              </a>
              {' '}
              about the latest release of OpenShift Container Platform 4.
            </p>

          </div>
        </div>
      </Card>
    );
  }
}

InstructionsAWSIPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAWSIPI;
