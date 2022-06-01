import React from 'react';
import PropTypes from 'prop-types';

import { ClipboardCopy, TextContent } from '@patternfly/react-core';

function ROSACLITab({ cluster }) {
  return (
    <TextContent>
      <p>Copy and run the following commands:</p>
      <p>
        <ClipboardCopy isReadOnly>
          {`rosa create operator-roles --interactive -c ${cluster.name}`}
        </ClipboardCopy>
      </p>
      <p>
        <ClipboardCopy isReadOnly>
          {`rosa create oidc-provider --interactive -c ${cluster.name}`}
        </ClipboardCopy>
      </p>
    </TextContent>
  );
}

ROSACLITab.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default ROSACLITab;
