import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearGlobalError } from '~/redux/actions/globalErrorActions';
import { useGlobalState } from '~/redux/hooks';

const GlobalErrorBox = () => {
  const dispatch = useDispatch();
  const { errorMessage, errorTitle } = useGlobalState((state) => state.globalError);

  return errorMessage || errorTitle ? (
    <Alert
      variant="danger"
      isInline
      title={errorTitle}
      actionClose={<AlertActionCloseButton onClose={() => dispatch(clearGlobalError())} />}
      role="alert"
    >
      {errorMessage}
    </Alert>
  ) : null;
};

export default GlobalErrorBox;
