import React from 'react';

import { useQueries, UseQueryResult } from '@tanstack/react-query';

import { buildPermissionDict } from '~/redux/reduxHelpers';
import { SelfResourceReview, SelfResourceReviewRequest } from '~/types/accounts_mgmt.v1';

import { authorizationsService } from '../../services';

type CanEditDelete = {
  [clusterID: string]: boolean;
};

export const useFetchCanEditDelete = ({
  mainQueryKey = 'fetchCanEditDelete',
  staleTime = 30000,
  refetchInterval = Infinity,
}) => {
  const { isLoading, data, isError, isFetching, refetch } = useQueries({
    queries: [
      {
        queryKey: [
          mainQueryKey,
          'authorizationsService',
          'selfResourceReview',
          SelfResourceReviewRequest.action.DELETE,
        ],
        queryFn: async () => {
          const response = await authorizationsService.selfResourceReview({
            action: SelfResourceReviewRequest.action.DELETE,
            resource_type: SelfResourceReview.resource_type.CLUSTER,
          });

          return buildPermissionDict(response);
        },
        staleTime,
        refetchInterval,
      },
      {
        queryKey: [
          mainQueryKey,
          'authorizationsService',
          'selfResourceReview',
          SelfResourceReviewRequest.action.UPDATE,
        ],
        queryFn: async () => {
          const response = await authorizationsService.selfResourceReview({
            action: SelfResourceReviewRequest.action.UPDATE,
            resource_type: SelfResourceReview.resource_type.CLUSTER,
          });

          return buildPermissionDict(response);
        },
        staleTime,
        refetchInterval,
      },
    ],
    combine: React.useCallback((results: UseQueryResult[]) => {
      const [canDelete, canEdit] = results;

      return {
        isLoading: results.some((result) => result.isLoading),
        isFetching: results.some((result) => result.isFetching),
        data: {
          canEdit: canEdit.data as CanEditDelete,
          canDelete: canDelete.data as CanEditDelete,
        },
        isError: results.some((result) => result.isError),
        refetch: () => results.forEach((result) => result.refetch()),
      };
    }, []),
  });

  return {
    isLoading,
    isFetching,
    canEdit: data?.canEdit,
    canDelete: data?.canDelete,
    isError,
    refetch,
  };
};
