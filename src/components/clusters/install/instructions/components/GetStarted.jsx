import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  StackItem,
  Text,
  TextContent,
  Button, ClipboardCopy,
} from '@patternfly/react-core';
import { get } from 'lodash';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import ExternalLink from '../../../../common/ExternalLink';
import TelemetryDisclaimer from './TelemetryDisclaimer';
import instructionsMapping from '../instructionsMapping';
import { getTrackEvent, trackEvents } from '~/common/analytics';

const GetStarted = ({
  docURL, pendoID, cloudProviderID, customizations, isBMIPI, isUPI,
}) => {
  const { analytics } = useChrome();
  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component="p">
              {!isBMIPI && (
                <>
                  The installer will take about 45 minutes to run.
                  {' '}
                </>
              )}
              {
                get(instructionsMapping, `${cloudProviderID}.getStartedAdditional`, null) || ''
              }
              {
                isBMIPI && (
                  <Text component="p">
                    When the installer is complete you will see the console URL and credentials for
                    accessing your new cluster. A
                      {' '}
                    <code>kubeconfig</code>
                      {' '}
                    file will also be generated for you to use with the
                      {' '}
                    <code>oc</code>
                      {' '}
                    CLI tools you downloaded.
                  </Text>
                )
              }
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <Button
            component="a"
            href={docURL}
            rel="noreferrer noopener"
            target="_blank"
            variant="secondary"
            onClick={() => {
              const eventObj = getTrackEvent(
                trackEvents.OCPInstallDocumentation,
                docURL,
                pendoID,
              );
              analytics.track(eventObj.event, eventObj.properties);
            }}
          >
            Get started
          </Button>
        </StackItem>
        { !isBMIPI && !isUPI && (
          <>
            <StackItem>
              <Text component="p">
                To quickly create a cluster with the default options, run the following command:
              </Text>
              <ClipboardCopy
                id="copy-command"
                isReadOnly
                isCode
              >
                ./openshift-install create cluster
              </ClipboardCopy>
            </StackItem>
          </>
        )}
        {customizations
          && (
            <StackItem>
              <TextContent>
                <Text component="p">
                  Refer to the documentation to
                  {' '}
                  <ExternalLink href={customizations}>
                    install with customizations
                  </ExternalLink>
                  .
                </Text>
              </TextContent>
            </StackItem>
          )}
        <StackItem>
          <TelemetryDisclaimer />
        </StackItem>
      </Stack>
    </>
  );
};

GetStarted.defaultProps = {
  isBMIPI: false,
  isUPI: false,
};

GetStarted.propTypes = {
  docURL: PropTypes.string.isRequired,
  pendoID: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  customizations: PropTypes.string,
  isBMIPI: PropTypes.bool,
  isUPI: PropTypes.bool,
};

export default GetStarted;
