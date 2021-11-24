import React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';

const AlertToast = () => (
  <>
    <Alert
      variant="success"
      title="Recommendation succesfully enabled"
      timeout={3000}
      tooltipPosition="top"
      isOpen="false"
      actionClose={<AlertActionCloseButton />}
    />
  </>

);

export default AlertToast;
