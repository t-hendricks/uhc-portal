import { AxiosError } from 'axios';
import * as React from 'react';
import { accountsService } from '~/services';

const govAddresses = /\.(gov|mil)$/;

export const useHasGovEmail = (): [boolean, boolean, string | undefined] => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>();
  const [hasGovEmail, setHasGovEmail] = React.useState(false);
  React.useEffect(() => {
    const doItAsync = async () => {
      try {
        const response = await accountsService.getCurrentAccount();
        setHasGovEmail(govAddresses.test(response.data.email || ''));
      } catch (err) {
        const axiosErr = err as any as AxiosError;
        setError(`Could not retrieve user's email. ${axiosErr.code}: ${axiosErr.message}`);
      } finally {
        setLoading(false);
      }
    };
    doItAsync();
  }, []);
  return [hasGovEmail, loading, error];
};
