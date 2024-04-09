import React from 'react';

import {
  Card,
  CardBody,
  CardTitle,
  List,
  ListItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';

import links, { channels } from '../../common/installLinks.mjs';
import DownloadAndOSSelection from '../clusters/install/instructions/components/DownloadAndOSSelection';
import ExternalLink from '../common/ExternalLink';
import InstructionCommand from '../common/InstructionCommand';
import PopoverHint from '../common/PopoverHint';

import LeadingInfo from './LeadingInfo';

import './Instructions.scss';

const SSOLogin = ({
  isRosa,
  commandName,
  commandTool,
}: {
  isRosa: boolean;
  commandName: string;
  commandTool: string;
}) => (
  <Stack hasGutter>
    <StackItem>
      <Card className="ocm-c-api-token__card">
        <CardTitle>
          <Title headingLevel="h2">SSO Login</Title>
        </CardTitle>
        <CardBody className="ocm-c-api-token__card--body">
          <TextContent>
            <LeadingInfo isRosa={isRosa} SSOLogin />
          </TextContent>
          <TextContent className="pf-v5-u-mt-lg">
            <List component="ol">
              <ListItem>
                Download and install the <code>{commandName}</code> command-line tool:{' '}
                <Text component="p" />
                <DownloadAndOSSelection tool={commandTool} channel={channels.STABLE} />
                <Text component="p" />
              </ListItem>
              <ListItem>
                {`Make sure your ${commandTool.toUpperCase()} CLI version is ${commandTool === 'ocm' ? '0.1.73' : '1.2.37'} or higher `}
                <PopoverHint
                  hint={
                    <>
                      {`To check your ${commandTool.toUpperCase()} CLI version, run this command: `}
                      <code>{`${commandTool} version`}</code>
                    </>
                  }
                />
                . To authenticate, run this command:
                <Text component="p" />
                <InstructionCommand
                  className="ocm-c-api-token-limit-width"
                  outerClassName="pf-v5-u-mt-md"
                >
                  {`${commandName} login --use-auth-code`}
                </InstructionCommand>
              </ListItem>
              <ListItem>
                Enter your Red Hat login credentials via SSO in the browser window.
              </ListItem>
            </List>
          </TextContent>
        </CardBody>
      </Card>
    </StackItem>
    <StackItem>
      <Card>
        <CardTitle>
          <Title headingLevel="h2">Additional resources:</Title>
        </CardTitle>
        <CardBody>
          <TextContent>
            You can find documentation for these related products and services here:
            <List>
              <ListItem>
                <ExternalLink href={links.OCM_CLI_DOCS} noIcon>
                  OpenShift Cluster Manager documentation
                </ExternalLink>
              </ListItem>
            </List>
          </TextContent>
        </CardBody>
      </Card>
    </StackItem>
  </Stack>
);

export default SSOLogin;
