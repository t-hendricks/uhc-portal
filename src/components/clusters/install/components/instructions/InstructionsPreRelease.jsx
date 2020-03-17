import React from 'react';
import PropTypes from 'prop-types';
import { Card, Title } from '@patternfly/react-core';
import { CodeIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

import links from '../../../../../common/installLinks';
import TelemetryAlert from './components/TelemetryAlert';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import DeveloperPreviewStatements from './components/DeveloperPreviewStatements';

function InstructionsPreRelease({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Experimental Developer Preview Builds
      </Title>
      <Card>
        <div className="pf-l-grid pf-m-gutter ocm-page">
          <div className="developer-preview">
            <CodeIcon />
            {' '}
            Developer Preview
          </div>
          {token.error && <TokenErrorAlert token={token} />}
          <TelemetryAlert />
          <div className="pf-c-content">

            <p>
            As Red Hat OpenShift Container Platform (OCP) has moved to become a more
            agile and rapidly deployable Kubernetes offering, we want to allow
            existing and evaluation customers and partners access to the latest
            pre-release nightly builds to see a real-time view into the next version
            of OpenShift.
            </p>

            <p />

            <DeveloperPreviewStatements />

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
            The following features are being targeted for the OpenShift 4.4 release and will
            eventually be working in the nightly builds as they approach production readiness:
            </p>

            <h4>Core Enhancements</h4>
            <ul>
              <li>
              Rebase to Kubernetes 1.17
              </li>
              <li>
              Tech preview of CSI volume snapshot, restore, and clone
              </li>
              <li>
                Kubernetes
                {' '}
                <a href="https://kubernetes-csi.github.io/docs/topology.html">CSI topology</a>
                {' '}
                support enables granular storage segmentation
              </li>
              <li>
                Tech preview of descheduler providing policy-based pod eviction to
                remove pods from undesirable nodes (pods are then replaced by the default scheduler)
              </li>
            </ul>

            <h4>Telco/5G/Edge Enhancements</h4>
            <ul>
              <li>Support for single stack IPv6</li>
              <li>
                RHCOS Real Time Kernel brings deterministic workloads, which allow users to
                rely on consistent response times and low and predictable latency
              </li>
              <li>
                Added support for Stream Control Transmission Protocol (SCTP) enabling
                simultaneous transmission of multiple streams between two endpoints
              </li>
              <li>HAProxy 2.0 support</li>
            </ul>

            <h4>Operator Enhancements</h4>
            <ul>
              <li>
              Developers support for operator catalogs hosted on a container registry
              </li>
              <li>
              Openshift monitoring integration for Red Hat operators
              </li>
            </ul>

            <h4>Installation Enhancements</h4>
            <ul>
              <li>
              Installer support for cluster deployment with user provided infrastructure
              on Red Hat OpenStack Platform (RHOSP) and Microsoft Azure
              </li>
              <li>
              IPI installer support for cluster deployment on Red Hat Virtualization (RHV)
              </li>
              <li>
              DNS forwarding allowing OpenShift DNS to resolve name queries for
              your other internal devices using the DNS servers in your data center
              </li>
            </ul>

            <h4>Registry Enhancements</h4>
            <ul>
              <li>
              Support for iSCSI persistent volumes for internal registry
              </li>
              <li>
              Automated image pruning in internal registry
              </li>
            </ul>

            <h4>Developer Experience Enhancements</h4>
            <ul>
              <li>
              Promotion of Helm from Tech Preview to GA
              </li>
              <li>
              Helm added to the OpenShift Console developer perspective
              (charts in catalog, releases, etc)
              </li>
              <li>
              Tech preview of OpenShift Pipelines - cloud-native CI/CD with Tekton pipelines
              </li>
              <li>
              Pipeline builder for authoring Tekton pipelines
              </li>
              <li>
              Understand the health of application via topology view in the web console
              </li>
              <li>
              Image Registry now allows Recreate rollouts
              </li>
              <li>
              Monitoring and metrics now available in the developer perspective
              </li>
              <li>
              Developer preview of OpenShift Builds allows developers to build images
              using Kubernetes build tools
              </li>
            </ul>

            <p>
            Find out more about test blockers for the OCP 4.4 dev previews by viewing the
              {' '}
              <a href={links.INSTALL_PRE_RELEASE_BUG_LIST_44} rel="noreferrer noopener" target="_blank">
              test blocker bug list
                {' '}
                <ExternalLinkAltIcon color="#0066cc" size="sm" />
              </a>
            .
            </p>
          </div>
        </div>
      </Card>
      <DownloadsAndPullSecretSection
        installerURL={links.INSTALL_PRE_RELEASE_INSTALLER_LATEST_44}
        rhcosDownloadURL={links.INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_44}
        cliURL={links.INSTALL_PRE_RELEASE_CLI_LATEST_44}
        token={token}
        showPreReleaseDocs
        showPreReleasePageLink={false}
      >
        <p>
        As these are nightly builds, you will see multiple versions available at any one time
        inside the mirror URLs. We strongly advise using the 4.4 nightlies until OpenShift 4.4
        is released.
        </p>
      </DownloadsAndPullSecretSection>
      <Card>
        <div className="pf-c-content pf-l-grid pf-m-gutter ocm-page">
          <h3 className="pf-c-title pf-m-md downloads-subtitle">Feedback and Support</h3>
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
            <a href={links.INSTALL_PRE_RELEASE_SUPPORT_KCS} rel="noreferrer noopener" target="_blank">
              knowledge article
            </a>
            .
          </p>
        </div>
      </Card>
    </>
  );
}


InstructionsPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPreRelease;
