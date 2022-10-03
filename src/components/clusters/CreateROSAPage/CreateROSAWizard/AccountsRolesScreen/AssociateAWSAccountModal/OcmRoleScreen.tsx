import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Alert,
  Card,
  CardBody,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';

import { GlobalState } from '~/redux/store';
import { trackEvents } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import PopoverHintWithTitle from '~/components/common/PopoverHintWithTitle';
import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';
import { RosaCliCommand } from '../constants/cliCommands';
import MultipleAccountsInfoBox from './MultipleAccountsInfoBox';

export const OcmRoleScreen = () => {
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
              basic OCM role and the admin OCM role
            </ExternalLink>
            .
          </Text>
        </TextContent>
        <br />
        <TextContent>
          <div className="ocm-instruction-block">
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
          </div>
        </TextContent>
        <br />
        <Accordion displaySize="large">
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle('associate-ocm-role');
              }}
              isExpanded={expanded === 'associate-ocm-role'}
              id="associate-ocm-role"
            >
              <Title headingLevel="h3">Check if the OCM role is linked</Title>
            </AccordionToggle>
            <AccordionContent
              id="associate-ocm-role-expand"
              isHidden={expanded !== 'associate-ocm-role'}
            >
              <Grid hasGutter>
                <GridItem>
                  <Text component={TextVariants.p}>
                    You must link OCM role with the Red Hat cluster installer to proceed. You can
                    link only one OCM role per Red Hat organization.
                  </Text>
                </GridItem>
                <GridItem sm={7} md={7}>
                  <Text component={TextVariants.p}>Check if a role exists and is linked with:</Text>
                  <InstructionCommand
                    textAriaLabel="Copyable ROSA create ocm-role"
                    trackEvent={trackEvents.CopyOCMRoleList}
                  >
                    rosa list ocm-role
                  </InstructionCommand>
                </GridItem>
                <GridItem sm={7} md={7}>
                  <Text component={TextVariants.p}>
                    If a role exists but is not linked, link it with:
                  </Text>
                  <InstructionCommand
                    textAriaLabel="Copyable ROSA create ocm-role --arn"
                    trackEvent={trackEvents.CopyOCMRoleLink}
                  >
                    {RosaCliCommand.LinkOcmRole}
                  </InstructionCommand>
                </GridItem>

                <Alert
                  variant="info"
                  isInline
                  isPlain
                  className="ocm-instruction-block_alert"
                  title="You must have organization administrator privileges in your Red Hat account to run this command. After you link the OCM role with your Red Hat organization, it is visible for all users in the organization."
                />
              </Grid>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
};
