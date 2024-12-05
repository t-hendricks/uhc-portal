import { useMutation } from '@tanstack/react-query';

import accountsService from '~/services/accountsService';

export const useEditSubscription = () => {
  const { isSuccess, error, isError, isPending, mutate, reset } = useMutation({
    mutationKey: ['accountService', 'editSubscription'],
    mutationFn: ({ subscriptionID, data }: { subscriptionID: string; data: any }) =>
      accountsService.editSubscription(subscriptionID, data),
  });

  return { isSuccess, error, isError, isPending, mutate, reset };
};
