import React from 'react';

import {
  Label,
  List,
  ListComponent,
  ListItem,
  OrderType,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

import { trackEvents } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';

import { RosaCliCommand } from '../../AccountsRolesScreen/constants/cliCommands';

const StepCreateNetwork = () => (
  <>
    <Split hasGutter>
      <SplitItem>
        <Title headingLevel="h3">
          Create a Virtual Private Network (VPC) and necessary networking components.
        </Title>
      </SplitItem>
      <SplitItem>
        <Label
          variant="outline"
          color="red"
          icon={<ExclamationTriangleIcon color={warningColor.value} />}
        >
          Only for ROSA HCP clusters
        </Label>
      </SplitItem>
    </Split>
    <List component={ListComponent.ol} type={OrderType.number}>
      <ListItem>
        To create a Virtual Private Network (VPC) and all the neccesary components, run this
        command:
        <InstructionCommand
          trackEvent={trackEvents.CopyCreateAccountRoles}
          textAriaLabel="Copyable ROSA create account-roles command"
          className="pf-v5-u-mt-md"
        >
          {RosaCliCommand.CreateNetwork}
        </InstructionCommand>
      </ListItem>
    </List>

    <ExternalLink href={links.ROSA_CREATE_NETWORK}>
      Learn more about the create network command
    </ExternalLink>
  </>
);

export default StepCreateNetwork;
