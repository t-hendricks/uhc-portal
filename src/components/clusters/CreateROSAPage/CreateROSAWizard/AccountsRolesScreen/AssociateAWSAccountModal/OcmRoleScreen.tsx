import React, { useState } from 'react';
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
import { trackEvents } from '~/common/analytics';
import links from '~/common/installLinks.mjs';
import PopoverHintWithTitle from '~/components/common/PopoverHintWithTitle';
import ExternalLink from '~/components/common/ExternalLink';
import InstructionCommand from '~/components/common/InstructionCommand';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { RosaCliCommand } from '../constants/cliCommands';
import MultipleAccountsInfoBox from './MultipleAccountsInfoBox';

export const OcmRoleScreen = () => {
  const hasAwsAccounts = useGlobalState(
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

        <TextContent>
          <Text component={TextVariants.p}>
            Run one of the following two commands to create an OCM role and link it to your Red Hat
            organization. The link creates a trust policy between the role and the cluster
            installer.{' '}
            <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>
              Review the AWS policy permissions for the basic and admin OCM roles
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
                <Text component={TextVariants.p} className="pf-u-color-200">
                  Using basic will require additional actions after cluster creation.
                </Text>
              </GridItem>
              <GridItem sm={12} md={1} className="pf-u-text-align-center pf-u-pt-xl">
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
                <Text component={TextVariants.p} className="pf-u-color-200">
                  Use admin OCM role for automated deployment and additional role privileges.
                </Text>
              </GridItem>
              <PopoverHintWithTitle
                title="Understand the OCM role types"
                bodyContent={
                  <Text component={TextVariants.p}>
                    The <strong>basic role</strong> enables OpenShift Cluster Manager to detect the
                    AWS IAM roles and policies required by ROSA.
                  </Text>
                }
                footer={
                  <Text component={TextVariants.p}>
                    The <strong>admin role</strong> also enables the detection of the roles and
                    policies. In addition, the admin role enables automatic deployment of the
                    cluster specific Operator roles and the OpenID Connect (OIDC) provider by using
                    OpenShift Cluster Manager.
                  </Text>
                }
              />
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
