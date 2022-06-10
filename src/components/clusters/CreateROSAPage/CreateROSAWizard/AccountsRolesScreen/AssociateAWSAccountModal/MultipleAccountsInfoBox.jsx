import React from 'react';
import PropTypes from 'prop-types';

import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import ExternalLink from '../../../../../common/ExternalLink';
import links from '../../../../../../common/installLinks.mjs';

const MultipleAccountsInfoBox = ({ setIsAlertShown, ocmRole, userRole }) => {
  const associateMultRoles = 'You can associate multiple AWS accounts to create ROSA clusters on any of the associated AWS accounts from your organization.';
  let specifyProfile = '';
  if (ocmRole || userRole) {
    specifyProfile = `When creating the ${ocmRole ? 'OCM' : 'user'} role, you may specify an AWS account profile.`;
  }
  return (
    <Alert
      variant="info"
      className="pf-u-mt-sm pf-u-mb-md"
      actionClose={<AlertActionCloseButton onClose={() => setIsAlertShown(false)} />}
      title={`${associateMultRoles} ${specifyProfile}`}
      actionLinks={(
        <ExternalLink href={links.ROSA_AWS_MULTIPLE_ACCOUNT_ASSOCIATION}>
          Learn more about associating multiple AWS accounts
        </ExternalLink>
    )}
      isInline
    />
  );
};

MultipleAccountsInfoBox.propTypes = {
  setIsAlertShown: PropTypes.func,
  ocmRole: PropTypes.bool,
  userRole: PropTypes.bool,
};

export default MultipleAccountsInfoBox;
