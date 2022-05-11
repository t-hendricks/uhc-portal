/* eslint-disable max-len */
import React from 'react';

import {
  Card,
  CardBody,
  Grid,
  GridItem,
  PageSection,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  Alert,
} from '@patternfly/react-core';
import InstructionCommand from '../../../../../../common/InstructionCommand';
import ExternalLink from '../../../../../../common/ExternalLink';
import PopoverHint from '../../../../../../common/PopoverHint';
import links from '../../../../../../../common/installLinks.mjs';

import './OCMRoleScreen.scss';

function OCMRoleScreen() {
  return (
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <TextContent>
                <Title headingLevel="h2">
                  AWS account association
                </Title>
                <Text component={TextVariants.p}>
                  ROSA cluster deployment uses the AWS Secure Token service for added security.
                  {' '}
                  Run the following required steps from a CLI authenticated with both AWS and ROSA.
                  {' '}
                  <ExternalLink href={links.ROSA_AWS_ACCOUNT_ASSOCIATION}>
                    Learn more about account association
                  </ExternalLink>
                </Text>
              </TextContent>
            </CardBody>
            <CardBody>
              <TextContent>
                <Title headingLevel="h2">
                  Create OpenShift Cluster Manager role
                </Title>
                <Title headingLevel="h3">
                  Create OCM role
                </Title>
                <Text component={TextVariants.p}>
                  Run one of the following two commands to create an OCM role. View required AWS policy permissions for the
                  {' '}
                  <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>
                    basic OCM role
                    {' '}
                  </ExternalLink>
                  and the
                  {' '}
                  <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>
                    admin OCM role
                  </ExternalLink>
                  .
                </Text>
              </TextContent>
              <br />
              <TextContent>
                <Grid className="ocm-role-indented-container">
                  <GridItem sm={12} md={5}>
                    <strong>
                      Basic OCM role
                      {' '}
                      <PopoverHint
                        bodyContent="The basic OCM role is necessary (one per Red Hat organization) to allow this interface to detect the presence of ROSA necessary AWS roles and policies."
                        footerContent={(<ExternalLink href={links.ROSA_AWS_ACCOUNT_ROLES}>View AWS policy permissions required by the basic OCM role</ExternalLink>)}
                      />
                    </strong>
                    <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role">
                      rosa create ocm-role
                    </InstructionCommand>
                  </GridItem>
                  <GridItem sm={12} md={1} className="ocm-wizard-or-container">
                    <p>
                      OR
                    </p>
                  </GridItem>
                  <GridItem sm={12} md={6}>
                    <strong>
                      Admin OCM role
                      {' '}
                      <PopoverHint
                        bodyContent="The admin OCM role enables a fully automated deployment, otherwise, you will be notified to create additional objects manually, during deployment."
                        footerContent={(<ExternalLink href={links.ROSA_AWS_ACCOUNT_ROLES}>View the AWS policy permissions required by the admin OCM role.</ExternalLink>)}
                      />
                    </strong>
                    <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role --admin">
                      rosa create ocm-role --admin
                    </InstructionCommand>
                  </GridItem>
                </Grid>
                <Title headingLevel="h3">
                  Make sure to associate the OCM role with your red hat organization
                </Title>
                <Text component={TextVariants.p}>
                  If not yet linked, run the following command to associate the OCM role with your AWS account.
                </Text>
                <Grid className="ocm-role-indented-container">
                  <GridItem>
                    <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role --arn">
                      rosa link ocm-role &#x3c;arn&#x3e;
                    </InstructionCommand>
                    <Alert
                      variant="info"
                      isInline
                      isPlain
                      className="ocm-role-screen__link-role-alert"
                      title="You must have organization administrator privileges to run this command. After you link the OCM role with your AWS account, it is visible for all users in the organization."
                    />
                  </GridItem>
                </Grid>
              </TextContent>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </PageSection>
  );
}

export default OCMRoleScreen;
