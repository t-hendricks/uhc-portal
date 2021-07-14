import React from 'react';
import PropTypes from 'prop-types';
import {
  PageSection,
  Stack,
  StackItem,
  Title,
  Split,
  SplitItem,
  Text,
  TextContent,
  Divider,
  Label,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import TokenErrorAlert from '../install/instructions/components/TokenErrorAlert';
import DownloadAndOSSelection from '../install/instructions/components/DownloadAndOSSelection';
import links, { tools, channels, architectures } from '../../../common/installLinks';
import PullSecretSection from '../install/instructions/components/PullSecretSection';
import { trackPendo } from '../../../common/helpers';
import '../install/instructions/Instructions.scss';

const pendoID = window.location.pathname;
const docURL = links.INSTALL_CRC_GETTING_STARTED;

const LocalTab = ({ token }) => (
  <>
    <PageSection className="ocm-instructions-crc__card">
      <Stack hasGutter className="download-instructions header">
        <StackItem>
          <Title headingLevel="h2" className="ocm-ocp-sandbox-title">
            Red Hat CodeReady Containers
          </Title>
          <Label variant="outline">
            local sandbox
          </Label>
        </StackItem>
        <StackItem>
          Create a minimal cluster on your desktop/laptop for local development and testing.
        </StackItem>
        <StackItem>
          <Text component="p" className="ocm-sandbox-graytext">
            <b>Note: </b>
            Your CodeReady installation won&apos;t appear in the OpenShift Cluster Manager
            unless you enable cluster monitoring and telemetry.
          </Text>
        </StackItem>
      </Stack>
      <Divider />
      <Stack>
        {token.error
          && (
            <StackItem>
              <Split>
                <SplitItem className="step-number alert">
                  <Title headingLevel="h1" />
                </SplitItem>
                <SplitItem className="download-instructions alert" isFilled>
                  <TokenErrorAlert token={token} />
                </SplitItem>
              </Split>
            </StackItem>
          )}
        <StackItem>
          <Split>
            <SplitItem className="step-number">
              <Title headingLevel="h1">1</Title>
            </SplitItem>
            <SplitItem className="download-instructions" isFilled>
              <TextContent>
                <Text component="h2">Download what you need to get started</Text>
                <Text component="h3">CodeReady Containers</Text>
                <DownloadAndOSSelection
                  token={token}
                  tool={tools.CRC}
                  channel={channels.STABLE}
                  architecture={architectures.x86}
                  pendoID={pendoID}
                />
                <Text component="h3">Pull secret</Text>
                <PullSecretSection token={token} pendoID={pendoID} />
              </TextContent>
            </SplitItem>
          </Split>
        </StackItem>
        <Divider />
        <StackItem>
          <Split>
            <SplitItem className="step-number">
              <Title headingLevel="h1">2</Title>
            </SplitItem>
            <SplitItem className="download-instructions" isFilled>
              <TextContent>
                <Text component="h2">
                  Follow the documentation to install CodeReady containers
                </Text>
                <Text component="p">
                  Run
                  {' '}
                  <code>crc setup</code>
                  {' '}
                  to set up your host operating system for the CodeReady
                  Containers virtual machine.
                </Text>
                <Text component="p">
                  Then, run
                  {' '}
                  <code>crc start</code>
                  {' '}
                  to create a minimal OpenShift 4 cluster on your computer.
                </Text>
              </TextContent>
              <a
                href={docURL}
                rel="noreferrer noopener"
                target="_blank"
                variant="link"
                onClick={() => trackPendo('OCP-Download-OfficialDocumentation', pendoID)}
              >
                View the CodeReady Containers Getting started guide
                {' '}
                <ExternalLinkAltIcon color="#0066cc" size="sm" />
              </a>
            </SplitItem>
          </Split>
        </StackItem>
      </Stack>
    </PageSection>
  </>
);

LocalTab.propTypes = {
  token: PropTypes.object.isRequired,
};

export default LocalTab;
