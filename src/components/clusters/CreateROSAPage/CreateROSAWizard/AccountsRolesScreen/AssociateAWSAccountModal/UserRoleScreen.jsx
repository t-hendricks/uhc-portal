import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  Title,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import MultipleAccountsInfoBox from './MultipleAccountsInfoBox';
import PopoverHint from '../../../../../common/PopoverHint';
import ExternalLink from '../../../../../common/ExternalLink';
import InstructionCommand from '../../../../../common/InstructionCommand';
import links from '../../../../../../common/installLinks.mjs';

const rosaCLICommand = {
  userRole: 'rosa create user-role',
  linkUserRole: 'rosa link user-role <arn>',
};

const UserRoleScreen = ({ hasAWSAccounts }) => {
  const [isAlertShown, setIsAlertShown] = useState(true);

  return (
    <Card isCompact isPlain>
      <CardBody>
        <TextContent>
          <Title headingLevel="h2">
            Create and link a user role
          </Title>
          <Text component={TextVariants.p}>
            The user role combined with the OCM role are required to deploy
            {' '}
            a ROSA cluster.
          </Text>
        </TextContent>
      </CardBody>
      <CardBody>
        <Title headingLevel="h2">
          Create a user role
        </Title>
        {hasAWSAccounts && isAlertShown && (
          <MultipleAccountsInfoBox setIsAlertShown={setIsAlertShown} />
        )}
        <TextContent>
          <Text component={TextVariants.p}>
            Run the following command to create a user role. View the required AWS policy
            {' '}
            permissions for the
            {' '}
            <ExternalLink noIcon href={links.ROSA_AWS_ACCOUNT_ROLES}>user role</ExternalLink>
            .
          </Text>
          <div className="ocm-instruction-block">
            <strong>
              User role
              {' '}
            </strong>
            <PopoverHint
              bodyContent="The user role is necessary to allow this interface to validate your user account and enable a trust with the OCM role"
            />
            <InstructionCommand textAriaLabel="Copyable ROSA create user-role">
              {rosaCLICommand.userRole}
            </InstructionCommand>
          </div>
          <Title headingLevel="h3">
            Ensure that you associate the user role with your Red Hat user account
          </Title>
          <Text component={TextVariants.p}>
            If not yet linked, run the following command to associate the user role
            {' '}
            with your Red Hat user account.
          </Text>
          <div className="ocm-instruction-block">
            <InstructionCommand textAriaLabel="Copyable ROSA link user-role --arn">
              {rosaCLICommand.linkUserRole}
            </InstructionCommand>
          </div>
        </TextContent>
      </CardBody>
    </Card>
  );
};

UserRoleScreen.propTypes = {
  hasAWSAccounts: PropTypes.bool,
};

export default UserRoleScreen;
