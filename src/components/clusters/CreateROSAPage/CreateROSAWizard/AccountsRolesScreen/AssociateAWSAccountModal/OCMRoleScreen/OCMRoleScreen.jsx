import React from 'react';
import PropTypes from 'prop-types';

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
import MultipleAccountsInfoBox from '../MultipleAccountsInfoBox';
import PopoverHint from '../../../../../../common/PopoverHint';
import ExternalLink from '../../../../../../common/ExternalLink';
import InstructionCommand from '../../../../../../common/InstructionCommand';
import links from '../../../../../../../common/installLinks.mjs';

const rosaCLICommand = {
  ocmRole: 'rosa create ocm-role',
  adminOcmRole: 'rosa create ocm-role --admin',
  linkOcmRole: 'rosa link ocm-role <arn>',
};

const OCMRoleScreen = ({ hasAWSAccounts }) => (
  <Card isCompact isPlain>
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
      <Title headingLevel="h2">
        Create OpenShift Cluster Manager role
      </Title>
      {hasAWSAccounts && (
        <MultipleAccountsInfoBox />
      )}
      <Title headingLevel="h3">
        Create OCM role
      </Title>
      <TextContent>
        <Text component={TextVariants.p}>
          Run one of the following two commands to create an OCM role.
          {' '}
          View required AWS policy permissions for the
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
        <div className="ocm-instruction-block">
          <Grid>
            <GridItem sm={12} md={5}>
              <strong>
                Basic OCM role
                {' '}
                <PopoverHint
                  bodyContent="The basic OCM role is necessary (one per Red Hat organization) to allow this interface to detect the presence of ROSA necessary AWS roles and policies."
                />
              </strong>
              <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role">
                {rosaCLICommand.ocmRole}
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
                  bodyContent="The admin OCM role enables a fully automated deployment, otherwise, you will be notified to create additional objects manually during deployment"
                />
              </strong>
              <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role --admin">
                {rosaCLICommand.adminOcmRole}
              </InstructionCommand>
            </GridItem>
          </Grid>
        </div>
        <Title headingLevel="h3">
          Make sure to associate the OCM role with your Red Hat organization
        </Title>
        <Text component={TextVariants.p}>
          If not yet linked, run the following command to associate the OCM role
          {' '}
          with your AWS account.
        </Text>
        <div className="ocm-instruction-block">
          <InstructionCommand textAriaLabel="Copyable ROSA create ocm-role --arn">
            {rosaCLICommand.linkOcmRole}
          </InstructionCommand>
          <Alert
            variant="info"
            isInline
            isPlain
            title="You must have Organization Administrator privileges to run this command. After you link the OCM role with your AWS account, it is visible for all users in the organization."
          />
        </div>
      </TextContent>
    </CardBody>
  </Card>
);

OCMRoleScreen.propTypes = {
  hasAWSAccounts: PropTypes.bool,
};

export default OCMRoleScreen;
