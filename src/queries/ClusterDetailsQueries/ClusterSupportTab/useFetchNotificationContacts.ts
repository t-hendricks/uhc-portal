import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { queryConstants } from '~/queries/queriesConstants';
import { accountsService } from '~/services';

export const invalidateNotificationContacts = () => {
  queryClient.invalidateQueries({ queryKey: ['fetchNotificationContacts', 'accountService'] });
};

export const useFetchNotificationContacts = (subscriptionID: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['fetchNotificationContacts', 'accountService', subscriptionID],
    queryFn: async () => {
      const response = await accountsService.getNotificationContacts(subscriptionID);

      return response;
    },
    staleTime: queryConstants.STALE_TIME,
    enabled: !!subscriptionID,
  });
  return {
    notificationContacts: {
      contacts: data?.data.items?.map((contact) => ({
        userID: contact.id,
        username: contact.username,
        email: contact.email,
        firstName: contact.first_name,
        lastName: contact.last_name,
      })),
      subscriptionID,
      fullfilled: !isLoading,
      error: isError,
      pending: isLoading,
    },
    refetch,
  };
};
