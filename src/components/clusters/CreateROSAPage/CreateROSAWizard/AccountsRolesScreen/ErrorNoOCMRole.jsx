import React from 'react';
import PropTypes from 'prop-types';
import {
  AlertActionLink,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import { trackEvents } from '~/common/analytics';
import PopoverHint from '../../../../common/PopoverHint';
import InstructionCommand from '../../../../common/InstructionCommand';
import { RosaCliCommand } from './constants/cliCommands';
import PopoverHintWithTitle from '../../../../common/PopoverHintWithTitle';

const ErrorNoOCMRole = ({ openOcmRoleInstructionsModal }) => (
  <TextContent className="ocm-alert-text">
    <Text component={TextVariants.p} className="pf-u-mb-sm">
      Create and link an OCM role with your Red Hat organization to proceed.
    </Text>
    <Text component={TextVariants.p} className="pf-u-mb-sm">
      <strong>To create an OCM role, run the following command:</strong>
    </Text>
    <Grid>
      <GridItem sm={12} md={5}>
        <strong>Basic OCM role</strong>
        <InstructionCommand
          textAriaLabel="Copyable ROSA create ocm-role"
          trackEvent={trackEvents.CopyOCMRoleCreateBasic}
        >
          {RosaCliCommand.OcmRole}
        </InstructionCommand>
      </GridItem>
      <GridItem sm={12} md={1} className="ocm-wizard-or-container">
        <p>OR</p>
      </GridItem>
      <GridItem sm={12} md={6}>
        <strong>Admin OCM role</strong>
        <InstructionCommand
          textAriaLabel="Copyable ROSA create ocm-role --admin"
          trackEvent={trackEvents.CopyOCMRoleCreateAdmin}
        >
          {RosaCliCommand.AdminOcmRole}
        </InstructionCommand>
      </GridItem>
      <PopoverHintWithTitle />
    </Grid>
    <br />
    <Text component={TextVariants.p}>If a role exists but is not linked, link it with:</Text>
    <Grid>
      <GridItem sm={7} md={5}>
        <InstructionCommand
          textAriaLabel="Copyable ROSA create ocm-role --arn"
          trackEvent={trackEvents.CopyOCMRoleLink}
        >
          {RosaCliCommand.LinkOcmRole}
        </InstructionCommand>
      </GridItem>
      <GridItem sm={1} md={1}>
        <PopoverHint
          iconClassName="ocm-instructions__command-help-icon"
          hint="Check if the role is linked to your Red Hat organization by running the following command:"
          footer={
            <InstructionCommand textAriaLabel="Copyable ROSA rosa list ocm-role">
              rosa list ocm-role
            </InstructionCommand>
          }
        />
      </GridItem>
    </Grid>
    <Text component={TextVariants.h6}>
      After creating and linking your OCM role, click <strong>Refresh ARNs</strong> to populate the
      ARN fields and continue creating your cluster.
    </Text>
    <AlertActionLink onClick={() => openOcmRoleInstructionsModal()}>
      See more information about configuring OCM roles
    </AlertActionLink>
  </TextContent>
);

ErrorNoOCMRole.propTypes = {
  openOcmRoleInstructionsModal: PropTypes.func.isRequired,
};

export default ErrorNoOCMRole;
