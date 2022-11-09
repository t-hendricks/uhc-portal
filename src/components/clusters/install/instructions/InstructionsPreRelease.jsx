/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Text,
  TextContent,
  Title,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';

import links, { tools, channels } from '../../../../common/installLinks.mjs';
import TelemetryDisclaimer from './components/TelemetryDisclaimer';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import DeveloperPreviewStatements from './components/DeveloperPreviewStatements';
import './InstructionsPreRelease.scss';

function InstructionsPreRelease({ token, installer }) {
  return (
    <>
      <Title headingLevel="h3" size="2xl">
        Experimental Developer Preview Builds
      </Title>
      <Stack hasGutter>
        <StackItem>
          <Card className="ocm-c-pre-release__card">
            <CardTitle className="ocm-c-pre-release__card--header">
              <CodeIcon /> <span>Developer Preview</span>
            </CardTitle>
            <CardBody className="ocm-c-pre-release__card--body">
              {token.error && <TokenErrorAlert token={token} />}
              <TextContent>
                <TelemetryDisclaimer />
                <Text component="p">
                  As Red Hat OpenShift Container Platform (OCP) has moved to become a more agile and
                  rapidly deployable Kubernetes offering, we want to allow existing and evaluation
                  customers and partners access to the latest pre-release builds to see a real-time
                  view into the next version of OpenShift.
                </Text>
                <DeveloperPreviewStatements />
                <Text component="p">
                  These builds are useful for anyone who would like to stay up to date on features
                  being developed in the next release of OpenShift. Such builds are advantageous for
                  planning future deployments, ISV integrations, or other educational, test, and
                  explorational purposes.
                </Text>
                <Text component="h3">Feature Completion in Developer Preview Versions</Text>
                <Text component="p">
                  Each OpenShift minor release will target initiatives or focus areas. Because
                  pre-release versions are published before all features have been implemented and
                  tested, some features may be absent, incomplete, or buggy. This is the beauty of
                  the development process, allowing early access, so customers and partners can
                  experiment and provide early feedback.
                </Text>
              </TextContent>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Card className="ocm-c-pre-release-instructions__card">
            <CardBody className="ocm-c-pre-release-instructions__card--body">
              <DownloadsAndPullSecretSection
                token={token}
                showPreReleaseDocs
                showPreReleasePageLink={false}
                tool={installer}
                channel={channels.PRE_RELEASE}
              />
            </CardBody>
            <CardFooter className="ocm-c-pre-release-instructions__card--footer">
              <TextContent>
                <Text component="h3">Feedback and Support</Text>
                <Text component="p">
                  If you are a Red Hat customer or partner and have feedback about these developer
                  preview versions, file an issue via{' '}
                  <Text component="a" href={links.INSTALL_PRE_RELEASE_FEEDBACK}>
                    the OpenShift Bugs tracker
                  </Text>
                  . Do not use the formal Red Hat support service ticket process. You can read more
                  about support handling in the following{' '}
                  <Text
                    component="a"
                    href={links.INSTALL_PRE_RELEASE_SUPPORT_KCS}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    knowledge article
                  </Text>
                  .
                </Text>
              </TextContent>
            </CardFooter>
          </Card>
        </StackItem>
      </Stack>
    </>
  );
}

InstructionsPreRelease.propTypes = {
  token: PropTypes.object.isRequired,
  installer: PropTypes.oneOf(Object.values(tools)).isRequired,
};

export default InstructionsPreRelease;
