import React from 'react';

import { Alert, Button, ButtonVariant } from '@patternfly/react-core';

import ocmBaseName from '~/common/getBaseName';
import { ENV_OVERRIDE_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';

type Props = {
  env: string;
};

const EnvOverrideMessage = ({ env }: Props) => {
  const goBackToNormal = () => {
    localStorage.removeItem(ENV_OVERRIDE_LOCALSTORAGE_KEY);
    window.location.href = ocmBaseName;
  };

  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title={
        <>
          Using the <em>{env}</em> environment API
        </>
      }
      className="pf-v5-u-flex-basis-0 pf-v5-u-flex-grow-1"
    >
      <Button variant={ButtonVariant.link} isInline onClick={goBackToNormal}>
        Go back to <strong>{APP_API_ENV}</strong>
      </Button>
    </Alert>
  );
};

export default EnvOverrideMessage;
