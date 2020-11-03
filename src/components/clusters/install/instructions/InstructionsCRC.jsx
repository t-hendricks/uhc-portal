import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Title,
  Split,
  SplitItem,
  Divider,
  Stack,
  StackItem,
  Button,
} from '@patternfly/react-core';
import TokenErrorAlert from './components/TokenErrorAlert';
import DownloadAndOSSelection from './components/DownloadAndOSSelection';
import { downloadButtonModes } from './components/DownloadButton';
import { channels } from '../../../../common/installLinks';
import PullSecretSection from './components/PullSecretSection';
import { trackPendo } from '../../../../common/helpers';

function InstructionsCRC({ token }) {
  const cloudProviderID = window.location.pathname;
  const docURL = 'https://access.redhat.com/documentation/en-us/red_hat_codeready_containers/';
  return (
    <>
      <Card className="ocp-downloads">
        <Stack>
          {token.error
            && (
            <StackItem>
              <Split>
                <SplitItem>
                  <Title headingLevel="h1" className="step-number alert" />
                </SplitItem>
                <SplitItem className="download-instructions alert" isFilled>
                  <TokenErrorAlert token={token} />
                </SplitItem>
              </Split>
            </StackItem>
            )}
          <StackItem>
            <Split>
              <SplitItem>
                <Title headingLevel="h1" className="step-number">1</Title>
              </SplitItem>
              <SplitItem className="download-instructions" isFilled>
                <div className="ocp-downloads">
                  <div className="instructions-section">
                    <Title headingLevel="h2">What you need to get started</Title>
                    <Title headingLevel="h3">CodeReady Containers archive</Title>
                    <p>
                      Download and extract the CodeReady Containers archive for your
                      operating system and place the executable in your
                      {' '}
                      <code>$PATH</code>
                      {' '}
                      .
                    </p>
                  </div>
                  <div className="instructions-section">
                    <DownloadAndOSSelection
                      token={token}
                      channel={channels.CRC}
                      mode={downloadButtonModes.CRC}
                      cloudProviderID={cloudProviderID}
                    />
                  </div>
                  <div className="instructions-section">
                    <Title headingLevel="h3">Pull secret</Title>
                    <PullSecretSection token={token} cloudProviderID={cloudProviderID} />
                  </div>
                </div>
              </SplitItem>
            </Split>
          </StackItem>
          <Divider className="steps-divider" />
          <StackItem>
            <Split>
              <SplitItem>
                <Title headingLevel="h1" className="step-number">2</Title>
              </SplitItem>
              <SplitItem className="download-instructions" isFilled>
                <div className="instructions-section">
                  <Title headingLevel="h2">Follow the documentation to install CodeReady containers</Title>
                  <p>
                    Run the
                    {' '}
                    <code>crc setup</code>
                    {' '}
                    command to set up your host operating system for the CodeReady
                    Containers virtual machine.
                  </p>
                  <p>
                    Then, the
                    {' '}
                    <code>crc start</code>
                    {' '}
                    will create a minimal OpenShift 4 cluster on your laptop or desktop computer.
                  </p>
                  <Button
                    component="a"
                    href={docURL}
                    rel="noreferrer noopener"
                    target="_blank"
                    variant="secondary"
                    onClick={() => trackPendo('OCP-Download-OfficialDocumentation', cloudProviderID)}
                  >
                  Get started
                  </Button>
                  <p className="small-text">
                  Note: Your CodeReady Container cluster will not show in your list of clusters in
                  OpenShift Cluster Manager since it is short-lived and occasionally running.
                  OpenShift Cluster Manager currently shows only production-level clusters.
                  </p>
                </div>
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
