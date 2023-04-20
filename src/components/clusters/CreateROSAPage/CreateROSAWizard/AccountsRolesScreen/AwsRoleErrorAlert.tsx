import React from 'react';
import { Alert, Text, TextContent, TextVariants, Button } from '@patternfly/react-core';

interface AwsRoleErrorAlertProps {
  title: React.ReactNode;
  openAssociateAwsAccountModal(): void;
}

export const AwsRoleErrorAlert = ({
  title,
  openAssociateAwsAccountModal,
}: AwsRoleErrorAlertProps) => (
  <Alert variant="danger" isInline title={title}>
    <TextContent className="pf-u-font-size-sm">
      <Text component={TextVariants.p}>
        To continue,{' '}
        <Button variant="link" isInline onClick={openAssociateAwsAccountModal}>
          create the required role
        </Button>{' '}
        with the Red Hat cluster installer.
      </Text>
    </TextContent>
  </Alert>
);
