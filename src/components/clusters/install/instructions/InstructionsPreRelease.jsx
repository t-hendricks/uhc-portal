/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Title,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { CodeIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

import links, { channels } from '../../../../common/installLinks';
import TelemetryDisclaimer from './components/TelemetryDisclaimer';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import DeveloperPreviewStatements from './components/DeveloperPreviewStatements';

function InstructionsPreRelease({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Experimental Developer Preview Builds
      </Title>
      <Stack gutter="md">
        <StackItem>
          <Card className="pre-release-card">
            <div className="pf-l-grid pf-m-gutter ocm-page instructions-section">
              <div className="developer-preview">
                <CodeIcon />
                {' '}
            Developer Preview
              </div>
              {token.error && <TokenErrorAlert token={token} />}
              <TelemetryDisclaimer />
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
            The following features are being targeted for the OpenShift 4.5 release and will
            eventually be working in the nightly builds as they approach production readiness:
                </p>

                <h4>Install experience</h4>
                <ul>
                  <li>
              VMware vSphere support for installer-provisioned infrastructure
              (IPI) deployment method
                    <ul>
                      <li>
                  Compact 3-node clusters for bare metal (only); aligns with Edge push
                      </li>
                    </ul>
                  </li>
                  <li>GCP UPI support for shared VPC in a host project (cross-project networking)</li>
                  <li>
                OpenShift on OpenStack brings new capabilities:
                    <ul>
                      <li>
                    OpenStack IPI install: Admin can choose two network interfaces on OpenShift
                    worker nodes (using Multus)
                      </li>
                      <li>
                    OpenStack IPI install: Distribute OpenShift Masters on OpenStack nodes for best
                    possible HA using anti-affinity rules
                      </li>
                      <li>OpenStack IPI installer allows for Customer-Provisioned Network & Subnets</li>
                      <li>
                    OpenShift can use OpenStack Manila (OpenStack File Service)
                    for Read-Write-Many PVs.
                      </li>
                    </ul>
                  </li>
                </ul>


                <h4>Core Platform</h4>
                <ul>
                  <li>
                Compute
                    <ul>
                      <li>Kube 1.18 and crio 1.18 with RHCOS 4.5</li>
                      <li>Vertical Pod Autoscaler  </li>
                    </ul>
                  </li>
                  <li>
                Networking and Ingress/Router
                    <ul>
                      <li>SR-IOV Usability and Debugging Improvement</li>
                      <li>Router now supports HTTP/2 and gRPC </li>
                      <li>
                    Capabilities to enable ingress logging for the
                    Router for security and audit
                      </li>
                      <li>
                  Scale testing saw improvements in connection pooling and improved threading vs 4.3
                      </li>
                    </ul>
                  </li>
                  <li>
                Storage
                    <ul>
                      <li>CSI Operator for AWS EBS </li>
                      <li>CSI Cloning GA</li>
                      <li>CSI OpenStack Manila</li>
                    </ul>
                  </li>
                </ul>

                <h4>Observability: Monitoring and Logging </h4>
                <ul>
                  <li>
                OpenShift Logging is updated with Elasticsearch 6
                    <ul>
                      <li>Change to index scheme should improve scale</li>
                    </ul>
                  </li>
                </ul>

                <h4>Operators, Operator Framework, SDK and OLM</h4>
                <ul>
                  <li>
              Operators, Operator Framework and OLM supports apiextensions.k8s.io/v1 CRDs
                  </li>
                  <li>
              A single API that streamlines the discovery of operators for admins and users
                  </li>
                  <li>
              Operator developers can use validating and mutating admission webhooks
                  </li>
                </ul>


                <h4>Developer Experience and Console</h4>
                <ul>
                  <li>
                Ability to pull images from either the Red Hat registry or users’ specific
                registries that require credentials
                  </li>
                  <li>
              Console will provide native console integration for Operator managed services
                  </li>
                  <li>
              Ability to filter operators by badges on embedded Marketplace and OpertaorHub
                  </li>
                  <li>
              Ability to customize the console URL of OpenShift Console
                  </li>
                  <li>
              Ability for admins/users to BYO custom certificates for OpenShift Console
                  </li>
                  <li>
              Ability to use Event Sources for Serverless Applications in Topology View
                  </li>
                  <li>
              Upgrade and rollback Helm releases
                  </li>
                  <li>
              Pipelines
                    <ul>
                      <li> Add webhooks to pipelines to trigger them on Git events</li>
                      <li>Manage Git and registry credentials used in pipelines</li>
                      <li>Configure pipeline workspace for sharing volumes between tasks</li>
                      <li>
                  Improved user experience in Tekton CLI, VS Code Tekton extension
                  and Tekton IntellJ plugin
                      </li>
                    </ul>
                  </li>
                </ul>

                <p>
            Find out more about test blockers for the OCP 4.5 dev previews by viewing the
                  {' '}
                  <a href={links.INSTALL_PRE_RELEASE_BUG_LIST_45} rel="noreferrer noopener" target="_blank">
              test blocker bug list
                    {' '}
                    <ExternalLinkAltIcon color="#0066cc" size="sm" />
                  </a>
            .
                </p>
              </div>
            </div>
          </Card>
        </StackItem>
        <StackItem>
          <Card className="download-instructions">
            <div className="instructions-section pf-c-content">
              <DownloadsAndPullSecretSection
                rhcosDownloadURL={links.INSTALL_PRE_RELEASE_DOWNLOAD_RHCOS_LATEST}
                token={token}
                showPreReleaseDocs
                showPreReleasePageLink={false}
                channel={channels.PRE_RELEASE}
              />
              <p>
        As these are nightly builds, you will see multiple versions available at any one time
        inside the mirror URLs. We strongly advise using the 4.5 nightlies until OpenShift 4.5
        is released.
              </p>
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
        </StackItem>
      </Stack>
    </>
  );
}


InstructionsPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsPreRelease;
