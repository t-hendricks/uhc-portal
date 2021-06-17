import React from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  Flex,
  FlexItem,
} from '@patternfly/react-core';

import ExternalLink from '../../../../../common/ExternalLink';

function AddOnsFailedBox(props) {
  const {
    installedAddOn,
  } = props;

  if (installedAddOn?.state === 'failed') {
    return (
      <Alert variant="danger" isInline title="Add-on failed" className="ocm-addons-failed--error-box">
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            {installedAddOn?.state_description}
          </FlexItem>
          <FlexItem>
            <ExternalLink noIcon href="https://access.redhat.com/support/cases/#/case/new">
              Contact support
            </ExternalLink>
          </FlexItem>
        </Flex>
      </Alert>
    );
  }
  return (null);
}

AddOnsFailedBox.propTypes = {
  installedAddOn: PropTypes.object,
};

export default AddOnsFailedBox;
