import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  Text,
} from '@patternfly/react-core';
import DownloadsAndPullSecretSection from './components/DownloadsAndPullSecretSection';
import SubscriptionAndSupport from './components/SubscriptionAndSupport';
import GetStarted from './components/GetStarted';
import Instruction from '../../../common/Instruction';
import Instructions from '../../../common/Instructions';
import TokenErrorAlert from './components/TokenErrorAlert';
import instructionsMapping from './instructionsMapping';
import { tools, channels } from '../../../../common/installLinks.mjs';

const OCPInstructions = (props) => {
  const {
    token,
    cloudProviderID,
    rhcos,
    installer = tools.X86INSTALLER,
    channel,
    docURL,
    customizations = '',
    showPreReleaseDocs,
    preReleasePageLink,
    isBMIPI,
    isUPI,
    showPreReleasePageLink,
  } = props;
  const pendoID = window.location.pathname;
  const getStartedTitleText = instructionsMapping[cloudProviderID]?.publicCloud
    ? `Follow the documentation to configure your ${instructionsMapping[cloudProviderID].cloudProvider} account and run the installer`
    : 'Follow the instructions to configure your environment and install your cluster';
  return (
    <>
      <Card>
        <CardBody>
          {token.error && (
            <>
              <TokenErrorAlert token={token} />
              <div className="pf-u-mb-lg" />
            </>
          )}
          <Instructions>
            <Instruction>
              <DownloadsAndPullSecretSection
                showPreReleaseDocs={showPreReleaseDocs}
                preReleasePageLink={preReleasePageLink}
                token={token}
                pendoID={pendoID}
                cloudProviderID={cloudProviderID}
                rhcos={rhcos}
                tool={installer}
                channel={channel}
                isBMIPI={isBMIPI}
                showPreReleasePageLink={showPreReleasePageLink}
              />
            </Instruction>
            <Instruction>
              <Text component="h2">{getStartedTitleText}</Text>
              <GetStarted
                docURL={docURL}
                pendoID={pendoID}
                cloudProviderID={cloudProviderID}
                customizations={customizations}
                isBMIPI={isBMIPI}
                isUPI={isUPI}
              />
            </Instruction>
            <Instruction>
              <SubscriptionAndSupport />
            </Instruction>
          </Instructions>
        </CardBody>
      </Card>
    </>
  );
};

OCPInstructions.propTypes = {
  token: PropTypes.object.isRequired,
  cloudProviderID: PropTypes.string.isRequired,
  rhcos: PropTypes.object,
  installer: PropTypes.oneOf(Object.values(tools)),
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
  docURL: PropTypes.string.isRequired,
  showPreReleaseDocs: PropTypes.bool,
  preReleasePageLink: PropTypes.string,
  customizations: PropTypes.string,
  isBMIPI: PropTypes.bool,
  isUPI: PropTypes.bool,
  showPreReleasePageLink: PropTypes.bool,
};

OCPInstructions.defaultProps = {
  isBMIPI: false,
  isUPI: false,
};

export default OCPInstructions;
