import React from 'react';
import PropTypes from 'prop-types';
import { Card, Popover, Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import GetStarted from './components/GetStarted';
import links, { channels } from '../../../../common/installLinks';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import EvaluationAlert from './components/EvaluationAlert';

function InstructionsAWSIPI({ token }) {
  const cloudProviderID = window.location.pathname;
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Install on AWS with an installer-provisioned infrastructure
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          {token.error && <TokenErrorAlert token={token} />}
          <EvaluationAlert />
          <div className="pf-c-content">
            <p>
                With OpenShift Container Platform you can install a cluster on Amazon Web Services
                (AWS) using infrastructure that the installation program provisions and the cluster
                maintains. The basic steps are outlined below.
            </p>

            <GetStarted
              docURL={links.INSTALL_AWSIPI_DOCS_LANDING}
              cloudProviderID={cloudProviderID}
            />


            <h3 id="prerequisites-title">
                Pre-requisites:
            </h3>
            <ul aria-labelledby="prerequisites-title">
              <li>
                <a href={links.INSTALL_AWSIPI_CONFIGURE_ACCOUNT} rel="noreferrer noopener" target="_blank">
                    Configure an AWS account
                  {' '}
                  <ExternalLinkAltIcon color="#0066cc" size="sm" />
                </a>
                {' '}
                  to host your cluster
              </li>
            </ul>
          </div>
          <TelemetryAlert />
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        token={token}
        cloudProviderID={cloudProviderID}
        channel={channels.STABLE}
      />
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">
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
                <a href={links.INSTALL_AWSIPI_INSTALLATION_CONFIG} rel="noreferrer noopener" target="_blank">
                    Installation configuration parameters for AWS
                  {' '}
                  <ExternalLinkAltIcon color="#0066cc" size="sm" />
                </a>
              </li>
              <li>
                <a href={links.INSTALL_AWSIPI_SAMPLE_YAML} rel="noreferrer noopener" target="_blank">
                    Sample customized install-config.yaml file for AWS
                  {' '}
                  <ExternalLinkAltIcon color="#0066cc" size="sm" />
                </a>
              </li>
              <li>
                <a href={links.INSTALL_AWSIPI_CUSTOMIZING_NETWORK} rel="noreferrer noopener" target="_blank">
                    Customizing your network configuration
                  {' '}
                  <ExternalLinkAltIcon color="#0066cc" size="sm" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">
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
                  <a href={links.INSTALL_AWSIPI_LIKELY_FAILURE_MODES} rel="noreferrer noopener" target="_blank">
                      likely failure modes
                    {' '}
                    <ExternalLinkAltIcon color="#0066cc" size="sm" />
                  </a>
                  {' '}
                    as well as
                  {' '}
                  <a href={links.INSTALL_AWSIPI_GENERIC_TROUBLESHOOTING} rel="noreferrer noopener" target="_blank">
                      how to troubleshoot
                    {' '}
                    <ExternalLinkAltIcon color="#0066cc" size="sm" />
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
          </div>
        </div>
      </Card>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">

            <h3>Access your cluster</h3>
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
          </div>
        </div>
      </Card>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="pf-c-content">
            <h3>Next Steps</h3>
            <p>
              <a href={links.INSTALL_AWSIPI_DOCS_ENTRY} rel="noreferrer noopener" target="_blank">
                  Learn more
                {' '}
                <ExternalLinkAltIcon color="#0066cc" size="sm" />
              </a>
              {' '}
                about the latest release of OpenShift Container Platform 4.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

InstructionsAWSIPI.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsAWSIPI;
