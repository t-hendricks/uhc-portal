import React, { MouseEventHandler, useCallback } from 'react';

import { Alert, AlertProps, Button, Text, TextContent, TextVariants } from '@patternfly/react-core';

// Re-use this hook's logic
// Send to the hook the title, and by that the hook will create and return the correct openDrawer function for that specific Card
import { useAssociateAWSAccountDrawer } from './AssociateAWSAccountDrawer/AssociateAWSAccountDrawer';
import { AWSAccountRole } from './AssociateAWSAccountDrawer/common/AssociateAWSAccountStep';

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
      <TextContent className="pf-v5-u-font-size-sm">
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
