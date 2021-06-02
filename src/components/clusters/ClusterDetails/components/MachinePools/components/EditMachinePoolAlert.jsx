import React from 'react';
import { Alert } from '@patternfly/react-core';

const EditMachinePoolAlert = () => (
  <Alert
    isInline
    variant="warning"
    className="error-box"
    title="Your edits will only apply to new nodes"
  >
    The edits you make in this dialog will only apply to new nodes.
    After saving, you can scale your nodes down briefly and then scale
    back up in order to replace the existing nodes with new nodes.
  </Alert>
);

export default EditMachinePoolAlert;
