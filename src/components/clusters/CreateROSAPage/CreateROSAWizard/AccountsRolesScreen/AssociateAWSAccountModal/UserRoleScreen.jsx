import React from 'react';

import {
  Card,
  CardBody, Grid, GridItem,
  PageSection, Stack, StackItem,
  Text, TextContent, TextVariants, Title,
} from '@patternfly/react-core';
import PopoverHint from '../../../../../common/PopoverHint';
import ExternalLink from '../../../../../common/ExternalLink';
import InstructionCommand from '../../../../../common/InstructionCommand';

function UserRoleScreen() {
  return (
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Card>
            <CardBody>
              <TextContent>
                <Title headingLevel="h2">
                  Create and link user role
                </Title>
                <Text component={TextVariants.p}>
                  The user role combined with the ocm role are required in order to deploy a ROSA
                  cluster.
                </Text>
              </TextContent>
            </CardBody>
            <CardBody>
              <TextContent>
                <Title headingLevel="h2">
                  Create user role
                </Title>
                <Text component={TextVariants.p}>
                  {/* eslint-disable-next-line max-len */}
                  Run the following command to create a user role. View required AWS policy permissions for the
                  {' '}
                  <ExternalLink noIcon href="">user role</ExternalLink>
                  .
                </Text>
                <Grid className="ocm-role-indented-container">
                  <GridItem>
                    <strong>
                      User role
                      {' '}
                    </strong>
                    <PopoverHint
                      bodyContent="The user role is necessary to allow this interface to validate your user account and enable a trust with the OCM role."
                      footerContent={(<ExternalLink href="">View the AWS policy permissions required by the user role.</ExternalLink>)}
                    />
                    <InstructionCommand textAriaLabel="Copyable ROSA create user-role">
                      rosa create user-role
                    </InstructionCommand>
                  </GridItem>
                </Grid>
                <Title headingLevel="h3">
                  Make sure to associate the OCM role with your red hat account
                </Title>
                <Text component={TextVariants.p}>
                  {/* eslint-disable-next-line max-len */}
                  If not yet linked, run the following command to associate the OCM role with your AWS account.
                </Text>
                <Grid className="ocm-role-indented-container">
                  <GridItem>
                    <strong>Associate AWS account</strong>
                    <InstructionCommand textAriaLabel="Copyable ROSA link user-role --arn">
                      rosa link user-role &#x3c;arn&#x3e;
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

export default UserRoleScreen;
