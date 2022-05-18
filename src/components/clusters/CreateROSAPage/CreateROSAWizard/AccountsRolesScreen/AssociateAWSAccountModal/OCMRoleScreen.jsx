/* eslint-disable max-len */
import React from 'react';

import {
  Card,
  CardBody, Grid, GridItem,
  PageSection, Stack, StackItem,
  Text, TextContent, TextVariants, Title,
} from '@patternfly/react-core';
import InstructionCommand from '../../../../../common/InstructionCommand';
import ExternalLink from '../../../../../common/ExternalLink';
import PopoverHint from '../../../../../common/PopoverHint';

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
                  Your ROSA cluster deployment from this interface uses AWS Secure Token Service for added security. As such, please prepare the following before proceeding. These steps are required and must be executed from a CLI, authenticated with both AWS and ROSA.
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
                  <ExternalLink noIcon href="">
                    basic OCM role
                    {' '}
                  </ExternalLink>
                  and the
                  {' '}
                  <ExternalLink noIcon href="">
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
                        footerContent={(<ExternalLink href="">View AWS policy permissions required by the basic OCM role</ExternalLink>)}
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
                        footerContent={(<ExternalLink href="">View the AWS policy permissions required by the admin OCM role.</ExternalLink>)}
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
