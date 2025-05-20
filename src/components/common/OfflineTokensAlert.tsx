import React from 'react';

import { Alert } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';

const OfflineTokensAlert = () => (
  <Alert
    className="pf-v5-u-mt-md"
    variant="warning"
    isInline
    title="Logging in with offline tokens is being deprecated"
  >
    Logging in using tokens is being deprecated. You can now long in using your Red Hat SSO
    credentials.
    <ExternalLink href="https://access.redhat.com/articles/7074172" noIcon>
      Learn more about how to log in using your Red Hat SSO credentials and why we’re deprecating
      tokens.
    </ExternalLink>
  </Alert>
);

export default OfflineTokensAlert;
