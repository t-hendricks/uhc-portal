import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
} from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import links from '../../../../../common/installLinks';
import DownloadButton from './components/DownloadButton';
import TelemetryAlert from './components/TelemetryAlert';
import PullSecretSection from './components/PullSecretSection';
import PageTitle from '../../../../common/PageTitle';
import CLISection from './components/CLISection';

class InstructionsPreRelease extends React.Component {
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
        <div className="pf-c-content ocm-page">
          <div className="developer-preview">
            <CodeIcon />
            {' '}
            Developer Preview
          </div>

          <PageTitle title="Experimental Developer Preview Builds" />

          <TelemetryAlert />

          <p>
            As Red Hat OpenShift Container Platform (OCP) has moved to become a more
            agile and rapidly deployable Kubernetes offering, we want to allow
            existing and evaluation customers and partners access to the latest
            pre-release nightly builds to see a real-time view into the next version
            of OpenShift.
          </p>

          <p />

          <p>
            Because these are developer preview builds:
          </p>
          <ul className="dev-preview-warnings">
            <li>
              Production use is not permitted.
            </li>
            <li>
              Installation and use is not eligible for Red Hat production support.
            </li>
            <li>
              Clusters installed at pre-release versions cannot be upgraded.
              As we approach a GA milestone with these nightly builds, we will
              allow upgrades from a nightly to a nightly; however, we will not
              support an upgrade from a nightly to the final GA build of OCP.
            </li>
          </ul>

          <p>
            These nightly builds are useful for those who would like to stay up
            to date on features being developed in the next release of OpenShift.
            Such builds are advantageous for planning future deployments,
            ISV integrations, or other educational purposes.
          </p>

          <h3>
            Feature Completion in Nightly Builds
          </h3>

          <p>
            Each OpenShift minor release will target initiatives or focus areas.
            These features will not be the same in every nightly build.
            Because these are experimental nightly builds, some features
            may be incomplete or have bugs. This is the beauty of the development process.
          </p>

          <p>
            The following features are being targeted for the OpenShift 4.3 release and will
            eventually be working in the nightly builds as they approach production readiness:
          </p>

          <h4>Core Enhancements</h4>
          <ul>
            <li>
              Rebase to Kubernetes 1.16
            </li>
            <li>
              Promotion of OVN from Tech Preview to GA
            </li>
            <li>
              Storage: Tech preview for re-size of Persistent Volumes with CSI, Promoting Storage
              iSCSI raw block from TP to GA, Tech Preview of Cinder Raw Block
            </li>
            <li>
              Etcd encryption
            </li>
            <li>
              A new configuration API that allows admins to select the cipher suites used by the
              Kubernetes serverAPI, HAproxy, and OAuth operator
            </li>
            <li>
              Tech Preview of Node Topology Manager that allows for policy defined and topology
              aware allocation of pod resources on a OpenShift node
            </li>
          </ul>

          <h4>Operational Enhancements</h4>
          <ul>
            <li>
              RHEL CoreOS 4.3, RHEL 7.6 and RHEL 7.7 support
            </li>
            <li>
              Ability to change the arguments to the Linux Kernel via MachineConfigs.
            </li>
            <li>
              Openshift now uses FIPS 140-2 Level 1 validated cryptography when running on RHEL
              CoreOS or RHEL in FIPS mode
            </li>
            <li>
              RHEL CoreOS disk encryption
            </li>
            <li>
              Automated machine health checking and remediation (when there is drift in state
              between machines and nodes)
            </li>
            <li>
              More observability with Machine Configuration Operator (MCO) now reporting metrics
              for telemetry
            </li>
          </ul>

          <h4>Installation Enhancements</h4>
          <ul>
            <li>
              IPI installer support for deploying OpenShift clusters to customer managed,
              pre-existing VPC (Virtual Private Cloud)/ & subnets on AWS, Azure and GCP
            </li>
            <li>
              Ability to install OpenShift clusters with only private facing load balancer
              endpoints (not publically accessible from the Internet) on AWS, Azure and GCP
            </li>
          </ul>

          <h4>Advanced Networking Enhancements</h4>
          <ul>
            <li>
              Promotion of SR-IOV from TP to GA
            </li>
            <li>
              Enhancements to Multus: IP and MAC Address Management (IPAM), Logging and Metrics
            </li>
            <li>
              High Performance Multicast: high-performance multicast data stream capability from
              OpenShift pods to clients outside the cluster
            </li>
            <li>
              Support for Precision Time Protocol (PTP)
            </li>
          </ul>

          <h4>Monitoring Enhancements</h4>
          <ul>
            <li>
              Tech Preview on the ability for customers to monitor their own workloads on
              OpenShift
            </li>
            <li>
              Tech Preview on the ability for customers to forward logs into another external
              Elasticsearch based on the log type (audit, platform/infrastructure, app/container)
            </li>
          </ul>

          <p>
            Find out more about test blockers for the OCP 4.3 dev previews by viewing the
            {' '}
            <a href={links.INSTALL_PRE_RELEASE_BUG_LIST_43} target="_blank">
              test blocker bug list
              {' '}
              <span className="fa fa-external-link" aria-hidden="true" />
            </a>
            .
          </p>

          <h3>
            Downloads
          </h3>

          <p>
            As these are nightly builds, you will see multiple versions available at any one time
            inside the mirror URLs. We strongly advise using the 4.3 nightlies until OpenShift 4.3
            is released.
          </p>

          <h3 className="pf-c-title pf-m-md downloads-subtitle">
            OpenShift Installer
          </h3>

          <p>
            Download and extract the install program for your operating system and place the file
            in the directory where you will store the installation configuration files.
            Note: The OpenShift install program is only available for Linux and macOS at this
            time.
          </p>

          <p />
          For pre-release documentation, refer to the
          {' '}
          <a href={links.INSTALL_PRE_RELEASE_INSTALLER_DOC} target="_blank">
            latest installer documentation
            {' '}
            <span className="fa fa-external-link" aria-hidden="true" />
          </a>
          .
          <p />
          <p>
            <DownloadButton
              installerURL={links.INSTALL_PRE_RELEASE_INSTALLER_LATEST_43}
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

          <h3 className="pf-c-title pf-m-md downloads-subtitle">
            Red Hat Enterprise Linux CoreOS (RHCOS)
          </h3>
          <p />
          <a href={links.INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_43} target="_blank">
            <Button
              variant="secondary"
              className="install--download-installer"
              disabled={!!token.error}
              tabIndex="-1"
            >
              Download RHCOS
            </Button>
          </a>

          <h3 className="pf-c-title pf-m-md downloads-subtitle">Command-Line Interface</h3>

          <CLISection toolsURL={links.INSTALL_PRE_RELEASE_CLI_LATEST_43} />

          <h3 className="pf-c-title pf-m-md downloads-subtitle">Feedback and Support</h3>
          <p />
          <p>
            If you are a Red Hat customer or partner and have feedback about these nightly builds,
            email
            {' '}
            <a href={links.INSTALL_PRE_RELEASE_FEEDBACK_MAILTO}>
              ***REMOVED***
            </a>
            . Do not use the formal Red Hat support service ticket process.
            You can read more about support handling in the following
            {' '}
            <a href={links.INSTALL_PRE_RELEASE_SUPPORT_KCS} target="_blank">
              knowledge article
            </a>
            .
          </p>
        </div>
      </Card>
    );
  }
}


InstructionsPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPreRelease;
