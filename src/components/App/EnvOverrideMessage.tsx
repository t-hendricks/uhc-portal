import React from 'react';
import { Alert, Text, TextVariants } from '@patternfly/react-core';
import { ENV_OVERRIDE_LOCALSTORAGE_KEY } from '../../config';

type Props = {
  env: string;
};

const EnvOverrideMessage = ({ env }: Props) => {
  const goBackToNormal = () => {
    localStorage.removeItem(ENV_OVERRIDE_LOCALSTORAGE_KEY);
    window.location.href = APP_BETA ? '/beta/openshift' : '/openshift';
  };
  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title="Environment override active"
      actionLinks={
        <Text component={TextVariants.a} onClick={goBackToNormal}>
          Go back to <b>{APP_API_ENV}</b>
        </Text>
      }
    >
      You&apos;re now using the <b>{env}</b> environment API.
    </Alert>
  );
};

export default EnvOverrideMessage;
