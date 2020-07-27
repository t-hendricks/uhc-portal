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
} from '@patternfly/react-core';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import SubscriptionAndSupport from './components/SubscriptionAndSupport';
import GetStarted from './components/GetStarted';
import TokenErrorAlert from './components/TokenErrorAlert';
import instructionsMapping from './instructionsMapping';

const OCPInstructions = (props) => {
  const {
    token,
    cloudProvider,
    rhcosLearnMoreURL,
    channel,
    docURL,
    customizations = '',
    showPreReleaseDocs,
    rhcosDownloadURL,
  } = props;
  const cloudProviderID = window.location.pathname;
  const cloudProviders = [
    instructionsMapping.aws.cloudProvider,
    instructionsMapping.azure.cloudProvider,
    instructionsMapping.gcp.cloudProvider,
  ];
  const getStartedTitleText = cloudProviders.indexOf(cloudProvider) === -1
    ? 'Follow the instructions to configure your environment and install your cluster'
    : `Follow the documentation to configure your ${cloudProvider} account and run the installer`;
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
                <DownloadsAndPullSecretSection
                  showPreReleaseDocs={showPreReleaseDocs}
                  token={token}
                  cloudProviderID={cloudProviderID}
                  rhcosLearnMoreURL={rhcosLearnMoreURL}
                  channel={channel}
                  rhcosDownloadURL={rhcosDownloadURL}
                />
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
                  <Title headingLevel="h2">{getStartedTitleText}</Title>
                  <GetStarted
                    docURL={docURL}
                    cloudProviderID={cloudProviderID}
                    cloudProvider={cloudProvider}
                    customizations={customizations}
                  />
                </div>
              </SplitItem>
            </Split>
          </StackItem>
          <Divider className="steps-divider" />
          <StackItem>
            <Split>
              <SplitItem>
                <Title headingLevel="h1" className="step-number">3</Title>
              </SplitItem>
              <SplitItem className="download-instructions" isFilled>
                <SubscriptionAndSupport />
              </SplitItem>
            </Split>
          </StackItem>
        </Stack>
      </Card>
    </>
  );
};

OCPInstructions.propTypes = {
  token: PropTypes.object.isRequired,
  cloudProvider: PropTypes.string.isRequired,
  rhcosLearnMoreURL: PropTypes.string,
  rhcosDownloadURL: PropTypes.string,
  channel: PropTypes.string.isRequired,
  docURL: PropTypes.string.isRequired,
  showPreReleaseDocs: PropTypes.bool,
  customizations: PropTypes.string,
};

export default OCPInstructions;
