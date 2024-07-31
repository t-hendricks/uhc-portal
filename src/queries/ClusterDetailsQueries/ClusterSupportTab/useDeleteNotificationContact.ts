import { useMutation } from '@tanstack/react-query';

import { formatErrorData } from '~/queries/helpers';
import { accountsService } from '~/services';

export const useDeleteNotificationContact = (subscriptionID: string) => {
  const { mutate, isSuccess, isPending, isError, error } = useMutation({
    mutationKey: ['deleteNotificationContact', 'accountService', subscriptionID],
    mutationFn: async (userId: string) => {
      const response = accountsService.deleteNotificationContact(subscriptionID, userId);
      return response;
    },
  });

  if (isError) {
    const formattedError = formatErrorData(isPending, isError, error);
    return {
      mutate,
      isSuccess,
      isPending,
      isError,
      error: formattedError,
    };
  }

  return {
    mutate,
    isSuccess,
    isPending,
    isError,
    error,
  };
};
