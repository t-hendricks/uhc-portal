import { useMutation } from '@tanstack/react-query';

import { addNotificationErrorFormat } from '~/queries/helpers';
import { accountsService } from '~/services';

export const useAddNotificationContact = (subscriptionID: string) => {
  const { data, isError, isPending, isSuccess, mutate, mutateAsync, error, status } = useMutation({
    mutationKey: ['addNotificationContact', 'accountService', subscriptionID],
    mutationFn: async (username: string) => {
      const response = await accountsService.addNotificationContact(subscriptionID, username);
      return response;
    },
  });

  const errorData = addNotificationErrorFormat(isPending, isError, error);

  return {
    data: Array.isArray(data?.data) ? data?.data : [data?.data],
    isError,
    isSuccess,
    isPending,
    status,
    mutate,
    mutateAsync,
    error: errorData?.error?.errorMessage,
  };
};
