import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Label,
  PageSection,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import TokenErrorAlert from '../install/instructions/components/TokenErrorAlert';
import DownloadAndOSSelection from '../install/instructions/components/DownloadAndOSSelection';
import links, { tools, channels } from '../../../common/installLinks.mjs';
import Instruction from '../../common/Instruction';
import Instructions from '../../common/Instructions';
import PullSecretSection from '../install/instructions/components/PullSecretSection';

const pendoID = window.location.pathname;
const docURL = links.INSTALL_CRC_GETTING_STARTED;

const LocalTab = ({ token }) => {
  const track = useAnalytics();
  return (
    <>
      <PageSection>
        <Split hasGutter>
          <Title headingLevel="h2">Red Hat OpenShift Local</Title>
          <SplitItem>
            <Label variant="outline">local sandbox</Label>
          </SplitItem>
        </Split>
        <TextContent>
          <Text component="p">
            Create a minimal cluster on your desktop/laptop for local development and testing.
          </Text>
          <Text component="p" className="ocm-secondary-text">
            <b>Note: </b>
            Your OpenShift Local installation won&apos;t appear in the OpenShift Cluster Manager
            unless you enable cluster monitoring and telemetry.
          </Text>
        </TextContent>
        <Divider className="pf-u-mt-lg pf-u-mb-xl" />
        {token.error && (
          <>
            <TokenErrorAlert token={token} />
            <div className="pf-u-mb-lg" />
          </>
        )}
        <Instructions>
          <Instruction>
            <Text component="h3">Download what you need to get started</Text>
            <Text component="h4">OpenShift Local</Text>
            <DownloadAndOSSelection tool={tools.CRC} channel={channels.STABLE} pendoID={pendoID} />
            <Text component="h3">Pull secret</Text>
            <PullSecretSection token={token} pendoID={pendoID} />
          </Instruction>
          <Instruction>
            <Text component="h3">Follow the documentation to install OpenShift Local</Text>
            <Text component="p">
              Run <code>crc setup</code> to set up your host operating system for the OpenShift
              Local virtual machine.
            </Text>
            <Text component="p">
              Then, run <code>crc start</code> to create a minimal OpenShift 4 cluster on your
              computer.
            </Text>
            <Text component="p">
              <a
                href={docURL}
                rel="noreferrer noopener"
                target="_blank"
                onClick={() => {
                  track(trackEvents.CRCInstallDocumentation, {
                    url: docURL,
                    path: pendoID,
                  });
                }}
              >
                View the OpenShift Local Getting started guide{' '}
                <ExternalLinkAltIcon color="#0066cc" size="sm" />
              </a>
            </Text>
          </Instruction>
        </Instructions>
      </PageSection>
    </>
  );
};

LocalTab.propTypes = {
  token: PropTypes.object.isRequired,
};

export default LocalTab;
