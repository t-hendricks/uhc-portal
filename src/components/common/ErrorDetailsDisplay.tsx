import React, { FunctionComponent } from 'react';

import { formatErrorDetails } from '~/common/errors';
import { ErrorState } from '~/types/types';

type Props = {
  response: Pick<ErrorState, 'errorDetails' | 'errorMessage' | 'operationID' | 'errorCode'>;
  itemWrapper?: FunctionComponent | keyof HTMLElementTagNameMap;
  showErrorCode?: boolean;
};

const ErrorDetailsDisplay = ({
  response,
  itemWrapper: ItemWrapper = 'p',
  showErrorCode,
}: Props) => {
  const errorDetails = formatErrorDetails(response.errorDetails);
  return (
    <>
      {showErrorCode && <ItemWrapper>{`Error code: ${response.errorCode}`}</ItemWrapper>}
      {response.errorMessage && <ItemWrapper>{response.errorMessage}</ItemWrapper>}
      {errorDetails && <ItemWrapper>{errorDetails}</ItemWrapper>}
      <ItemWrapper>{`Operation ID: ${response.operationID || 'N/A'}`}</ItemWrapper>
    </>
  );
};

export default ErrorDetailsDisplay;
