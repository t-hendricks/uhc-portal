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

  return {
    mutate,
    isSuccess,
    isPending,
    isError,
    error: formatErrorData(isPending, isError, error),
  };
};
