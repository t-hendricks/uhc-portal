import React from 'react';
import { Alert } from '@patternfly/react-core';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';

const SecurityGroupsEmptyAlert = () => (
  <Alert
    variant="info"
    isInline
    title="There are no security groups for this Virtual Private Cloud"
  >
    To add security groups, go to the{' '}
    <ExternalLink href={links.AWS_CONSOLE_SECURITY_GROUPS}>Security groups section</ExternalLink> of
    your AWS console.{' '}
  </Alert>
);

export default SecurityGroupsEmptyAlert;
