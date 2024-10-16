import { useMutation } from '@tanstack/react-query';

import accountsService from '~/services/accountsService';

export const useEditClusterName = () => {
  const { isSuccess, error, isError, isPending, mutate, reset } = useMutation({
    mutationKey: ['accountService', 'editSubscription'],
    mutationFn: ({
      subscriptionID,
      displayName,
    }: {
      subscriptionID: string;
      displayName: string;
    }) => accountsService.editSubscription(subscriptionID, { display_name: displayName }),
  });

  return { isSuccess, error, isError, isPending, mutate, reset };
};
