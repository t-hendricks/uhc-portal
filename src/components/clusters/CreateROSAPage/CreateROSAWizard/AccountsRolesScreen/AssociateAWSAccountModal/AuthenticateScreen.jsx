/* eslint-disable max-len */
import React from 'react';

import {
  Card,
  CardBody,
  PageSection, Stack, StackItem,
  Text, TextContent, TextVariants, Title,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ExternalLink from '../../../../../common/ExternalLink';
import DownloadAndOSSelection
  from '../../../../install/instructions/components/DownloadAndOSSelection';
import { channels, tools } from '../../../../../../common/installLinks';
import InstructionCommand from '../../../../../common/InstructionCommand';

function AuthenticateScreen({ token }) {
  const loginCommand = `rosa login --token="${token}"`;
  return (
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <TextContent>
                <Title headingLevel="h2">
                  Download and install the ROSA command line tool
                </Title>
                <Text component="p">
                  Download the ROSA command line (CLI) tools and add them to your
                  {' '}
                  <strong>PATH</strong>
                  .
                  {' '}
                  <ExternalLink
                    href="https://docs.openshift.com/rosa/rosa_getting_started/rosa-installing-rosa.html"
                  >
                    Help
                  </ExternalLink>
                </Text>
                <Text component="p">
                  <DownloadAndOSSelection
                    token={{}}
                    tool={tools.ROSA}
                    channel={channels.STABLE}
                    pendoID={{}}
                  />
                </Text>
                <Text component={TextVariants.p} className="ocm-secondary-text">
                  Note: If you haven’t done so already, also
                  {' '}
                  <ExternalLink href="https://aws.amazon.com/cli/">
                    install the AWS CLI
                  </ExternalLink>
                  {' '}
                  as per your operating system.
                </Text>
              </TextContent>
            </CardBody>
            <CardBody>
              <TextContent>
                <Title headingLevel="h2">
                  Authenticate using API token
                </Title>
                <Text component={TextVariants.p}>
                  Run the authentication command in your terminal. and use your API token to authenticate against your Red Hat OpenShift Service on AWS account.
                  {' '}
                </Text>
              </TextContent>
              <br />
              <InstructionCommand textAriaLabel="Copyable ROSA login command">
                {loginCommand}
              </InstructionCommand>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </PageSection>
  );
}

AuthenticateScreen.propTypes = {
  token: PropTypes.string,
};

export default AuthenticateScreen;
