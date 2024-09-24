import axios, { AxiosResponse } from 'axios';

import { Cluster, Group, User } from '~/types/clusters_mgmt.v1';
import { ErrorState } from '~/types/types';

import { RQApiErrorType, SearchRegionalClusterItems } from './types';

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
      reason: `${error?.response?.data.reason}`,
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
    error: error as any as Pick<
      ErrorState,
      'errorMessage' | 'errorDetails' | 'operationID' | 'errorCode' | 'reason'
    >,
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

export const formatRegionalInstanceUrl = (regionalInstanceUrl: string) => {
  if (regionalInstanceUrl) {
    return regionalInstanceUrl.replace('api.', '').replace('.openshift.com', '');
  }
  return '';
};

export const createResponseForSearchCluster = (responseItems: Cluster[] | undefined) => {
  const result: SearchRegionalClusterItems = { items: [] };
  if (responseItems) {
    responseItems?.forEach((entry: Cluster) => {
      const cluster = {
        name: entry.name,
        domain_prefix: entry.domain_prefix,
      };
      result.items.push(cluster);
    });
    return result;
  }
  return undefined;
};

export const getFormattedUserData = async (
  response: Promise<
    AxiosResponse<
      {
        items?: Array<Group>;
        page?: number;
        size?: number;
        total?: number;
      },
      any
    >
  >,
) => {
  const data = response.then((res) => {
    const items = res.data.items?.map((g: Group) => {
      const group: any = g;
      if (group.users) {
        group.users.items = group.users?.filter((user: User) => user.id !== 'cluster-admin');
      }
      return group;
    });
    return items || [];
  });
  return data || [];
};
