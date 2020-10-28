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
    cloudProviderID,
    rhcosLearnMoreURL,
    channel,
    docURL,
    customizations = '',
    showPreReleaseDocs,
    isBMIPI,
  } = props;
  const pendoID = window.location.pathname;
  const cloudProviders = [
    'aws',
    'azure',
    'gcp',
  ];
  const getStartedTitleText = cloudProviders.indexOf(cloudProviderID) === -1
    ? 'Follow the instructions to configure your environment and install your cluster'
    : `Follow the documentation to configure your ${instructionsMapping[cloudProviderID].cloudProvider} account and run the installer`;
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
                  pendoID={pendoID}
                  cloudProviderID={cloudProviderID}
                  rhcosLearnMoreURL={rhcosLearnMoreURL}
                  channel={channel}
                  isBMIPI={isBMIPI}
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
                    pendoID={pendoID}
                    cloudProviderID={cloudProviderID}
                    customizations={customizations}
                    isBMIPI={isBMIPI}
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
  cloudProviderID: PropTypes.string.isRequired,
  rhcosLearnMoreURL: PropTypes.string,
  channel: PropTypes.string.isRequired,
  docURL: PropTypes.string.isRequired,
  showPreReleaseDocs: PropTypes.bool,
  customizations: PropTypes.string,
  isBMIPI: PropTypes.bool,
};

OCPInstructions.defaultProps = {
  isBMIPI: false,
};

export default OCPInstructions;
