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
  Text,
  TextContent,
} from '@patternfly/react-core';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import SubscriptionAndSupport from './components/SubscriptionAndSupport';
import GetStarted from './components/GetStarted';
import TokenErrorAlert from './components/TokenErrorAlert';
import instructionsMapping from './instructionsMapping';
import './Instructions.scss';
import { tools, channels } from '../../../../common/installLinks';

const OCPInstructions = (props) => {
  const {
    token,
    cloudProviderID,
    displayRHCOSSection,
    installer = tools.X86INSTALLER,
    channel,
    docURL,
    customizations = '',
    showPreReleaseDocs,
    preReleasePageLink,
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
      <Card className="ocm-ocp-instructions__card">
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
                <DownloadsAndPullSecretSection
                  showPreReleaseDocs={showPreReleaseDocs}
                  preReleasePageLink={preReleasePageLink}
                  token={token}
                  pendoID={pendoID}
                  cloudProviderID={cloudProviderID}
                  displayRHCOSSection={displayRHCOSSection}
                  tool={installer}
                  channel={channel}
                  isBMIPI={isBMIPI}
                />
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
                  <Text component="h2">{getStartedTitleText}</Text>
                  <GetStarted
                    docURL={docURL}
                    pendoID={pendoID}
                    cloudProviderID={cloudProviderID}
                    customizations={customizations}
                    isBMIPI={isBMIPI}
                  />
                </TextContent>
              </SplitItem>
            </Split>
          </StackItem>
          <Divider />
          <StackItem>
            <Split>
              <SplitItem className="step-number">
                <Title headingLevel="h1">3</Title>
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
  displayRHCOSSection: PropTypes.bool,
  installer: PropTypes.oneOf(Object.values(tools)),
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
  docURL: PropTypes.string.isRequired,
  showPreReleaseDocs: PropTypes.bool,
  preReleasePageLink: PropTypes.string,
  customizations: PropTypes.string,
  isBMIPI: PropTypes.bool,
};

OCPInstructions.defaultProps = {
  isBMIPI: false,
};

export default OCPInstructions;
