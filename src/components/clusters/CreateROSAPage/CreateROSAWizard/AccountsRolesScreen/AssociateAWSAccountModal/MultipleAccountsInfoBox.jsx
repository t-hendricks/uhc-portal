import React from 'react';
import PropTypes from 'prop-types';

import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import ExternalLink from '../../../../../common/ExternalLink';
import links from '../../../../../../common/installLinks.mjs';

const MultipleAccountsInfoBox = ({ setIsAlertShown }) => (
  <Alert
    variant="info"
    className="pf-u-mt-sm pf-u-mb-md"
    actionClose={<AlertActionCloseButton onClose={() => setIsAlertShown(false)} />}
    title="By associating multiple AWS accounts, you can create ROSA clusters on any of the associated AWS accounts from your organization."
    actionLinks={(
      <ExternalLink href={links.ROSA_AWS_MULTIPLE_ACCOUNT_ASSOCIATION}>
        Learn more about associating multiple AWS accounts
      </ExternalLink>
    )}
    isInline
  />
);

MultipleAccountsInfoBox.propTypes = {
  setIsAlertShown: PropTypes.func,
};

export default MultipleAccountsInfoBox;
