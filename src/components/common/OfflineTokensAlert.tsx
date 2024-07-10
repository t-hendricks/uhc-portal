import React from 'react';

import { Alert } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';

const OfflineTokensAlert = () => (
  <Alert
    className="pf-v5-u-mt-md"
    variant="warning"
    isInline
    title="Logging in with offline tokens is deprecated"
  >
    Logging in using offline tokens has been deprecated and is no longer getting maintained or
    enhanced. You can now log in using your Red Hat SSO credentials. Learn more about{' '}
    <ExternalLink href="https://access.redhat.com/articles/7074172" noIcon>
      how to log in using your Red Hat SSO credentials and why we’re deprecating tokens.
    </ExternalLink>
  </Alert>
);

export default OfflineTokensAlert;
