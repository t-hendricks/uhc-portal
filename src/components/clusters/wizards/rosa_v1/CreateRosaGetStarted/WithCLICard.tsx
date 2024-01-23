import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Title,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons/dist/esm/icons/code-icon';
import InstructionCommand from '~/components/common/InstructionCommand';
import { trackEvents } from '~/common/analytics';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { RosaCliCommand } from '../AccountsRolesScreen/constants/cliCommands';

const WithCLICard = () => (
  <Card isFlat isFullHeight>
    <CardTitle>
      <Title headingLevel="h3" size="lg">
        <CodeIcon className="ocm-c-wizard-get-started--card-icon" />
        Deploy with CLI
      </Title>
    </CardTitle>
    <CardBody>
      <Text component={TextVariants.p} className="pf-v5-u-mb-sm">
        Run the create command in your terminal to begin setup in interactive mode.
      </Text>
      <InstructionCommand
        textAriaLabel="Copyable ROSA create cluster command"
        trackEvent={trackEvents.CopyRosaCreateCluster}
      >
        {RosaCliCommand.CreateCluster}
      </InstructionCommand>
    </CardBody>
    <CardFooter>
      <ExternalLink href={links.AWS_CLI_INSTRUCTIONS}>
        More information on CLI instruction
      </ExternalLink>
    </CardFooter>
  </Card>
);

export default WithCLICard;
