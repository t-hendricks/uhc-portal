/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Title,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';

import links, { channels } from '../../../../common/installLinks';
import TelemetryDisclaimer from './components/TelemetryDisclaimer';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import DeveloperPreviewStatements from './components/DeveloperPreviewStatements';
import './InstructionsPreRelease.scss';

function InstructionsPreRelease({ token }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
          Experimental Developer Preview Builds
      </Title>
      <Stack hasGutter>
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
