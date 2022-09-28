import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import { GlobalState } from '~/redux/store';
import PopoverHint from '~/components/common/PopoverHint';
import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';
import links from '~/common/installLinks.mjs';
import { trackEvents } from '~/common/analytics';
import { RosaCliCommand } from '../constants/cliCommands';
import MultipleAccountsInfoBox from './MultipleAccountsInfoBox';

interface UserRoleScreenProps {
  hideTitle?: boolean;
}

export const UserRoleScreen = ({ hideTitle = false }: UserRoleScreenProps) => {
  const hasAwsAccounts = useSelector<GlobalState>(
    (state) => !!state.rosaReducer.getAWSAccountIDsResponse?.data?.length,
  );
  const [isAlertShown, setIsAlertShown] = useState(true);

  return (
    <Card isCompact isPlain>
      <CardBody>
        <TextContent>
          {!hideTitle && <Title headingLevel="h2">Create and link a user role</Title>}
          <Text component={TextVariants.p}>
            The user role combined with the OCM role are required to deploy a ROSA cluster.
          </Text>
        </TextContent>
      </CardBody>
      <CardBody>
        <Title headingLevel="h2">Create a user role</Title>
        {hasAwsAccounts && isAlertShown && (
          <MultipleAccountsInfoBox setIsAlertShown={setIsAlertShown} userRole />
        )}
        <TextContent>
          <Text component={TextVariants.p}>
            Run the following command to create a user role. View the required AWS policy{' '}
            permissions for the{' '}
            <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>
              user role
            </ExternalLink>
            .
          </Text>
          <div className="ocm-instruction-block">
            <strong>User role </strong>
            <PopoverHint bodyContent="The user role is necessary to validate that your Red Hat user account has permissions to install a cluster in the AWS account." />
            <InstructionCommand
              textAriaLabel="Copyable ROSA create user-role"
              trackEvent={trackEvents.CopyUserRoleCreate}
            >
              {RosaCliCommand.UserRole}
            </InstructionCommand>
          </div>
          <Title headingLevel="h3">
            Ensure that you associate the user role with your Red Hat user account
          </Title>
          <Text component={TextVariants.p}>
            If not yet linked, run the following command to associate the user role with your Red
            Hat user account.
          </Text>
          <Grid className="ocm-instruction-block">
            <GridItem sm={7} md={6}>
              <InstructionCommand
                textAriaLabel="Copyable ROSA link user-role --arn"
                trackEvent={trackEvents.CopyUserRoleLink}
              >
                {RosaCliCommand.LinkUserRole}
              </InstructionCommand>
            </GridItem>
            <GridItem sm={1} md={1}>
              <PopoverHint
                iconClassName="ocm-instructions__command-help-icon"
                hint="Check if the role is linked to your
                      Red Hat user account by running the following command:"
                footer={
                  <InstructionCommand
                    textAriaLabel="Copyable ROSA rosa list user-role"
                    trackEvent={trackEvents.CopyUserRoleList}
                  >
                    rosa list user-role
                  </InstructionCommand>
                }
              />
            </GridItem>
          </Grid>
        </TextContent>
      </CardBody>
    </Card>
  );
};
