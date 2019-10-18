import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
} from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
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
            agile and rapidly deployable kubernetes offering, we want to allow
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
            The following features have passed automated testing in the current OCP 4.2
            dev preview nightly builds:
          </p>

          <ul>
            <li>
              Microsoft Azure IPI installation method
            </li>
            <li>
              Google Cloud Platform IPI and UPI installation method
            </li>
            <li>
              <a href="https://docs.google.com/document/d/1cCnER-IMDCfinO7DiSvATt8WE4-YBngKrSb2aeBToZA/edit?usp=sharing" target="_blank">
                Disconnect (air gapped or otherwise blackbox location) UPI installation
                {' '}
                <span className="fa fa-external-link" aria-hidden="true" />
              </a>
            </li>
            <li>
              Kubernetes 1.14
            </li>
          </ul>

          <p>
            The following features have not passed automated testing in the
            OCP 4.2 dev preview nightly builds, but will be completed in a
            future nightly build:
          </p>
          <ul>
            <li>
              Red Hat OpenStack IPI installation method
            </li>
            <li>
              Proxy (reaching the Red Hat container registry from within
              your organization’s internet proxy)
            </li>
          </ul>

          <p>
            Find out more about test blockers for the OCP 4.2 dev previews by viewing the
            {' '}
            <a href="https://red.ht/31U3YhX" target="_blank">
              test blockers bug list
              {' '}
              <span className="fa fa-external-link" aria-hidden="true" />
            </a>
            .
          </p>

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

          <p />
          For pre-release documentation, refer to the
          {' '}
          <a href="https://github.com/openshift/installer/tree/master/docs/user" target="_blank">
            latest installer documentation
            {' '}
            <span className="fa fa-external-link" aria-hidden="true" />
          </a>
          .
          <p />
          <p>
            <DownloadButton installerURL="https://mirror.openshift.com/pub/openshift-v4/clients/ocp-dev-preview/latest/" token={token} />
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
          <a href="https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/pre-release/latest" target="_blank">
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
          <CLISection toolsURL="https://mirror.openshift.com/pub/openshift-v4/clients/ocp-dev-preview/latest" />

          <h3 className="pf-c-title pf-m-md downloads-subtitle">Feedback and Support</h3>
          <p />
          <p>
            If you are a Red Hat customer or partner and have feedback about these nightly builds,
            email
            {' '}
            <a href="mailto:***REMOVED***?subject=[dev preview build]">
              ***REMOVED***
            </a>
            . Do not use the formal Red Hat support service ticket process.
            You can read more about support handling in the following
            {' '}
            <a href="https://access.redhat.com/articles/4307871" target="_blank">
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
