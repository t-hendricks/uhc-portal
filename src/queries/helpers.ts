import axios from 'axios';

import { ErrorState } from '~/types/types';

import { RQApiErrorType } from './types';

export const formatErrorData = (
  isLoading: boolean,
  isError: boolean,
  error: (Error | null) | (Error | null)[],
) => {
  if (isError && axios.isAxiosError(error)) {
    const errorData: ErrorState = {
      pending: isLoading,
      error: isError,
      fulfilled: false,
      errorCode: error?.response?.status,
      errorDetails: error?.response?.data?.details,
      errorMessage: `${error?.response?.data.code}: ${error?.response?.data.reason}`,
      internalErrorCode: error?.response?.data.code,
      operationID: error?.response?.data.operation_id,
    };
    return {
      isLoading,
      isError,
      error: errorData,
    };
  }

  return {
    isLoading,
    isError,
    error: error as any as Pick<ErrorState, 'errorMessage' | 'errorDetails' | 'operationID'>,
  };
};

export const addNotificationErrorFormat = (
  isLoading: boolean,
  isError: boolean,
  error: (Error | null) | (Error | null)[],
) => {
  if (isError && axios.isAxiosError(error)) {
    const errorData: RQApiErrorType = {};
    errorData.pending = isLoading;
    errorData.error = isError;
    errorData.fulfilled = false;
    errorData.errorCode = error?.response?.status;
    errorData.errorDetails = error?.response?.data?.details;
    errorData.errorMessage = `${error?.response?.data.reason}`;
    errorData.internalErrorCode = error?.response?.data.code;
    errorData.operationID = error?.response?.data.operation_id;
    return {
      isLoading,
      isError,
      error: errorData,
    };
  }
  return undefined;
};
