import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Title,
  Split,
  SplitItem,
  Divider,
  Stack,
  StackItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadAndOSSelection from './components/DownloadAndOSSelection';
import { downloadButtonModes } from './components/DownloadButton';
import { channels } from '../../../../common/installLinks';
import PullSecretSection from './components/PullSecretSection';
import { trackPendo } from '../../../../common/helpers';
import './Instructions.scss';

function InstructionsCRC({ token }) {
  const cloudProviderID = window.location.pathname;
  const docURL = 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers/';
  return (
    <>
      <Card className="ocm-instructions-crc__card">
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
                  <Text component="h2">What you need to get started</Text>
                  <Text component="h3">CodeReady Containers archive</Text>
                  <Text component="p">
                    Download and extract the CodeReady Containers archive for your
                    operating system and place the executable in your
                    {' '}
                    <code>$PATH</code>
                    {' '}
                    .
                  </Text>
                  <DownloadAndOSSelection
                    token={token}
                    channel={channels.CRC}
                    mode={downloadButtonModes.CRC}
                    cloudProviderID={cloudProviderID}
                  />
                  <Text component="h3">Pull secret</Text>
                  <PullSecretSection token={token} cloudProviderID={cloudProviderID} />
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
                    Run the
                    {' '}
                    <code>crc setup</code>
                    {' '}
                    command to set up your host operating system for the CodeReady
                    Containers virtual machine.
                  </Text>
                  <Text component="p">
                    Then, the
                    {' '}
                    <code>crc start</code>
                    {' '}
                    will create a minimal OpenShift 4 cluster on your laptop or desktop computer.
                  </Text>
                  <Button
                    className="pf-u-mb-md"
                    component="a"
                    href={docURL}
                    rel="noreferrer noopener"
                    target="_blank"
                    variant="secondary"
                    onClick={() => trackPendo('OCP-Download-OfficialDocumentation', cloudProviderID)}
                  >
                    Get started
                  </Button>
                  <Text component="small">
                    Note: Your CodeReady Container cluster will not show in your list of clusters in
                    OpenShift Cluster Manager since it is short-lived and occasionally running.
                    OpenShift Cluster Manager currently shows only production-level clusters.
                  </Text>
                </TextContent>
              </SplitItem>
            </Split>
          </StackItem>
        </Stack>
      </Card>
    </>
  );
}

InstructionsCRC.propTypes = {
  token: PropTypes.object.isRequired,
};

export default InstructionsCRC;
