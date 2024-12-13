import { useEditSubscription } from '../common/useEditSubscription';

export const useEditClusterName = () => {
  const { isSuccess, error, isError, isPending, mutate, reset } = useEditSubscription();

  const setClusterName = ({
    subscriptionID,
    displayName,
  }: {
    subscriptionID: string;
    displayName: string;
  }) =>
    mutate({
      subscriptionID,
      data: { display_name: displayName },
    });
  return {
    isSuccess,
    error,
    isError,
    isPending,
    mutate: setClusterName,
    reset,
  };
};
