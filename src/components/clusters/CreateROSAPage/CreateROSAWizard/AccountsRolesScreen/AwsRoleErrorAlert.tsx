import React, { MouseEventHandler, useCallback } from 'react';
import { Alert, Text, TextContent, TextVariants, Button, AlertProps } from '@patternfly/react-core';
import { AWSAccountRole } from './AssociateAWSAccountDrawer/common/AssociateAWSAccountStep';
import { useAssociateAWSAccountDrawer } from './AssociateAWSAccountDrawer/AssociateAWSAccountDrawer';

type AwsRoleErrorAlertProps = Pick<AlertProps, 'title'> & {
  targetRole?: AWSAccountRole;
};

export const AwsRoleErrorAlert = ({ title, targetRole }: AwsRoleErrorAlertProps) => {
  const { openDrawer } = useAssociateAWSAccountDrawer();
  const onClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      openDrawer({ focusOnClose: event.target as HTMLElement, targetRole });
    },
    [openDrawer, targetRole],
  );
  return (
    <Alert variant="danger" isInline title={title}>
      <TextContent className="pf-u-font-size-sm">
        <Text component={TextVariants.p}>
          To continue,{' '}
          <Button variant="link" isInline onClick={onClick}>
            create the required role
          </Button>{' '}
          with the ROSA CLI.
        </Text>
      </TextContent>
    </Alert>
  );
};
