import axios from 'axios';

import { RQApiErrorType } from './types';

export const formatErrorData = (
  isLoading: boolean,
  isError: boolean,
  error: Error | (Error | null)[],
) => {
  if (isError && axios.isAxiosError(error)) {
    const errorData: RQApiErrorType = {};
    errorData.pending = isLoading;
    errorData.error = isError;
    errorData.fulfilled = false;
    errorData.errorCode = error?.response?.status;
    errorData.errorDetails = error?.response?.data?.details;
    errorData.errorMessage = `${error?.response?.data.code}: ${error?.response?.data.reason}`;
    errorData.internalErrorCode = error?.response?.data.code;
    errorData.operationID = error?.response?.data.operation_id;
    return {
      isLoading,
      isError,
      error: errorData,
    };
  }
  return {
    isLoading,
    isError,
    error,
  };
};
