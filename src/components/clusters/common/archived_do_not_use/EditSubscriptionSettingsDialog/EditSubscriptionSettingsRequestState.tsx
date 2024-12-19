import React, { useEffect } from 'react';

import { ErrorState } from '~/types/types';

import ErrorBox from '../../../../common/ErrorBox';

type EditSubscriptionSettingsRequestStateProps = {
  requestState: ErrorState;
  onFulfilled: () => void;
};
const EditSubscriptionSettingsRequestState = ({
  requestState,
  onFulfilled,
}: EditSubscriptionSettingsRequestStateProps) => {
  useEffect(() => {
    if (requestState.fulfilled) {
      onFulfilled();
    }
  }, [onFulfilled, requestState.fulfilled, requestState.errorMessage]);

  return requestState.error ? (
    <ErrorBox message="Error updating subscription settings" response={requestState} />
  ) : null;
};

export default EditSubscriptionSettingsRequestState;
