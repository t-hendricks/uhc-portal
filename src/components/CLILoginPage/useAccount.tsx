import React from 'react';
import accountsService from '~/services/accountsService';
import { Account } from '~/types/accounts_mgmt.v1';

const useAccount = () => {
  const [userAccount, setUserAccount] = React.useState<Account | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasError, setHasError] = React.useState<boolean>(false);

  const manageFetchAccount = async () => {
    setHasError(false);
    setIsLoading(true);
    let account;
    try {
      const currentAccount = await accountsService.getCurrentAccount();
      if (currentAccount.data.id) {
        account = await accountsService.getAccount(currentAccount.data.id);
        setUserAccount(account.data);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    manageFetchAccount();
  }, []);

  return { userAccount, isLoading, hasError };
};

export default useAccount;
