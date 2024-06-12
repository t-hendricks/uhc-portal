import { ErrorDetail } from '~/types/types';

export type ClusterLogsErrorType = {
  pending?: boolean;
  fulfilled?: false;
  error?: true;
  errorCode?: number;
  internalErrorCode?: string;
  operationID?: string;
  errorMessage?: string | undefined;
  errorDetails?: ErrorDetail[];
};

export const initialParams = {
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  order: 'timestamp desc',
};
