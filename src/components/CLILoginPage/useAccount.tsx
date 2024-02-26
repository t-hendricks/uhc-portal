import React from 'react';
import { AxiosError } from 'axios';
import accountsService from '~/services/accountsService';
import { Account } from '~/types/accounts_mgmt.v1';

const useAccount = () => {
  const [userAccount, setUserAccount] = React.useState<Account | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<unknown>();

  const manageFetchAccount = async () => {
    setError(undefined);
    setIsLoading(true);
    let account;
    try {
      const currentAccount = await accountsService.getCurrentAccount();
      if (currentAccount.data.id) {
        account = await accountsService.getAccount(currentAccount.data.id);
        setUserAccount(account.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    manageFetchAccount();
  }, []);

  return { userAccount, isLoading, error };
};

export default useAccount;
