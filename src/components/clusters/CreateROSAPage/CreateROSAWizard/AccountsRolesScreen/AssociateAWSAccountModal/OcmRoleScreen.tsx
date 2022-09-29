import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  Alert,
} from '@patternfly/react-core';

import { GlobalState } from '~/redux/store';
import { trackEvents } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import PopoverHint from '~/components/common/PopoverHint';
import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';
import { RosaCliCommand } from '../constants/cliCommands';
import MultipleAccountsInfoBox from './MultipleAccountsInfoBox';

export const OcmRoleScreen = () => {
  const hasAwsAccounts = useSelector<GlobalState>(
    (state) => !!state.rosaReducer.getAWSAccountIDsResponse?.data?.length,
  );
  const [isAlertShown, setIsAlertShown] = useState(true);

  return (
    <Card isCompact isPlain>
      <CardBody>
        <TextContent>
          <Title headingLevel="h2">AWS account association</Title>
          <Text component={TextVariants.p}>
            ROSA cluster deployments use the AWS Security Token Service for added security. Run the
            following required steps from a CLI authenticated with both AWS and ROSA.{' '}
            <ExternalLink href={links.ROSA_AWS_ACCOUNT_ASSOCIATION}>
              Learn more about account association
            </ExternalLink>
          </Text>
        </TextContent>
      </CardBody>
      <CardBody>
        <Title headingLevel="h2">Create an OpenShift Cluster Manager role</Title>
        {hasAwsAccounts && isAlertShown && (
          <MultipleAccountsInfoBox setIsAlertShown={setIsAlertShown} ocmRole />
        )}
        <Title headingLevel="h3">Create and link OCM role</Title>
        <TextContent>
          <Text component={TextVariants.p}>
            Run one of the following two commands to create an OCM role. View the required AWS
            policy permissions for the{' '}
            <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>
              basic OCM role{' '}
            </ExternalLink>
            and the{' '}
            <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>
              admin OCM role
            </ExternalLink>
            .
          </Text>
        </TextContent>
        <br />
        <TextContent>
          <div className="ocm-instruction-block">
            <Grid>
              <GridItem sm={12} md={5}>
                <strong>
                  Basic OCM role{' '}
                  <PopoverHint bodyContent="One basic OCM role is needed per Red Hat organization to allow OpenShift Cluster Manager to detect the presence of AWS roles and policies required for ROSA." />
                </strong>
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
                <strong>
                  Admin OCM role{' '}
                  <PopoverHint bodyContent="The admin OCM role enables a fully automated deployment, otherwise, you will be notified to create additional objects manually during deployment" />
                </strong>
                <InstructionCommand
                  textAriaLabel="Copyable ROSA create ocm-role --admin"
                  trackEvent={trackEvents.CopyOCMRoleCreateAdmin}
                >
                  {RosaCliCommand.AdminOcmRole}
                </InstructionCommand>
              </GridItem>
            </Grid>
          </div>
          <Title headingLevel="h3">
            Ensure that you associate the OCM role with your Red Hat organization
          </Title>
          <Text component={TextVariants.p}>
            If not yet linked, run the following command to associate the OCM role with your Red Hat
            organization.
          </Text>
          <Grid className="ocm-instruction-block">
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
                hint="Check if the role is linked to your
                      Red Hat organization by running the following command:"
                footer={
                  <InstructionCommand textAriaLabel="Copyable ROSA rosa list ocm-role">
                    rosa list ocm-role
                  </InstructionCommand>
                }
              />
            </GridItem>

            <Alert
              variant="info"
              isInline
              isPlain
              className="ocm-instruction-block_alert"
              title="You must have organization administrator privileges in your Red Hat account to run this command. After you link the OCM role with your Red Hat organization, it is visible for all users in the organization."
            />
          </Grid>
        </TextContent>
      </CardBody>
    </Card>
  );
};
