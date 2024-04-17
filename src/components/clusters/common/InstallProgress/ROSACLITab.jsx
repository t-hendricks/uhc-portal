import React from 'react';
import PropTypes from 'prop-types';

import { ClipboardCopy, Flex, FlexItem } from '@patternfly/react-core';

function ROSACLITab({ cluster }) {
  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
      <p>Copy and run the following commands:</p>
      <FlexItem>
        <ClipboardCopy isReadOnly>
          {`rosa create operator-roles --interactive -c ${cluster.name}`}
        </ClipboardCopy>
      </FlexItem>
      <FlexItem>
        <ClipboardCopy isReadOnly>
          {`rosa create oidc-provider --interactive -c ${cluster.name}`}
        </ClipboardCopy>
      </FlexItem>
    </Flex>
  );
}

ROSACLITab.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ROSACLITab;
