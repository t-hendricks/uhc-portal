import React from 'react';

import { Alert } from '@patternfly/react-core';
import ExternalLink from '../../../../../common/ExternalLink';
import links from '../../../../../../common/installLinks.mjs';

const MultipleAccountsInfoBox = () => (
  <Alert
    variant="info"
    className="pf-u-mt-sm pf-u-mb-md"
    title="By associating multiple AWS accounts, you can create ROSA clusters on any of the associated AWS accounts from your organization."
    actionLinks={(
      <ExternalLink href={links.ROSA_AWS_MULTIPLE_ACCOUNT_ASSOCIATION}>
        Learn more about associating multiple AWS accounts
      </ExternalLink>
    )}
    isInline
  />
);

export default MultipleAccountsInfoBox;
