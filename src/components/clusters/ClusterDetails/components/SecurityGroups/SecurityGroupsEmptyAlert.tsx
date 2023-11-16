import React from 'react';
import { Alert } from '@patternfly/react-core';

const SecurityGroupsEmptyAlert = () => (
  <Alert
    variant="info"
    isInline
    title="There are no security groups for this Virtual Private Cloud"
  >
    To add security groups, go to the Security section of your AWS console.
  </Alert>
);

export default SecurityGroupsEmptyAlert;
