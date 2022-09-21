import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
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
  const [expanded, setExpanded] = useState('');

  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

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
        </TextContent>
        <br />
        <Accordion displaySize="large">
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('associate-user-role');
              }}
              isExpanded={expanded === 'associate-user-role'}
              id="associate-user-role"
            >
              <Title headingLevel="h3">Check if the User role is linked</Title>
            </AccordionToggle>
            <AccordionContent
              id="associate-user-role-expand"
              isHidden={expanded !== 'associate-user-role'}
            >
              <Grid hasGutter>
                <GridItem>
                  <Text component={TextVariants.p}>
                    If not yet linked, run the following command to associate the user role with
                    your Red Hat user account.
                  </Text>
                </GridItem>

                <GridItem sm={7} md={7}>
                  <Text component={TextVariants.p}>Check if the role is linked with:</Text>
                  <InstructionCommand
                    textAriaLabel="Copyable ROSA rosa list user-role"
                    trackEvent={trackEvents.CopyUserRoleList}
                  >
                    rosa list user-role
                  </InstructionCommand>
                </GridItem>

                <GridItem sm={7} md={7}>
                  <Text component={TextVariants.p}>
                    If a role exists but is not linked, link it with:
                  </Text>
                  <InstructionCommand
                    textAriaLabel="Copyable ROSA link user-role --arn"
                    trackEvent={trackEvents.CopyUserRoleLink}
                  >
                    {RosaCliCommand.LinkUserRole}
                  </InstructionCommand>
                </GridItem>
              </Grid>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
};
