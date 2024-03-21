import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { Alert, Skeleton } from '@patternfly/react-core';
import type { ChromeAPI } from '@redhat-cloud-services/types';
import { isRestrictedEnv } from '~/restrictedEnv';
import { trackEvents } from '~/common/analytics';
import TokenBox from '~/components/CLILoginPage/TokenBox';
import InstructionCommand from '~/components/common/InstructionCommand';

import { Error } from '~/types/accounts_mgmt.v1';

type ROSALoginCommandProps = {
  restrictTokens: boolean | undefined;
  error: Error | undefined;
  isLoading: boolean;
  token: string;
  defaultToOfflineTokens: boolean;
};

const ROSALoginCommand = ({
  restrictTokens,
  error,
  isLoading,
  token,
  defaultToOfflineTokens,
}: ROSALoginCommandProps) => {
  const chrome = useChrome();
  const restrictedEnv = isRestrictedEnv(chrome as unknown as ChromeAPI);

  const getEnv = () => {
    const env = chrome.getEnvironment();
    if (env === 'int') {
      return ' --env=integration';
    }
    return '';
  };

  const loginCommand = `rosa login${
    restrictedEnv ? ' --govcloud' : ''
  }${getEnv()} --token="${token}"`;

  const ROSALoginWithToken = (
    <TokenBox
      token={token}
      command={loginCommand}
      textAriaLabel="Copyable ROSA login command"
      trackEvent={trackEvents.ROSALogin}
      data-testid="token-box"
    />
  );

  if (restrictedEnv) {
    return ROSALoginWithToken;
  }

  if (isLoading) {
    return <Skeleton fontSize="3xl" data-testid="loading" />;
  }

  if (error && !defaultToOfflineTokens) {
    return (
      <Alert variant="danger" isInline title="Error retrieving user account">
        <p>{error.reason}</p>
        <p>{`Operation ID: ${error.operation_id || 'N/A'}`}</p>
      </Alert>
    );
  }

  if (restrictTokens) {
    return (
      <InstructionCommand
        className="ocm-c-api-token-limit-width"
        outerClassName="pf-v5-u-mt-md"
        data-testid="sso-login"
      >
        rosa login --use-auth-code
      </InstructionCommand>
    );
  }

  return ROSALoginWithToken;
};

export default ROSALoginCommand;
