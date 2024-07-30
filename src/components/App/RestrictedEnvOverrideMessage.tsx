import React from 'react';

import { Alert, Button, ButtonVariant } from '@patternfly/react-core';

import ocmBaseName from '~/common/getBaseName';
import { RESTRICTED_ENV_OVERRIDE_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';

const RestrictedEnvOverrideMessage = () => {
  const goBackToNormal = () => {
    localStorage.removeItem(RESTRICTED_ENV_OVERRIDE_LOCALSTORAGE_KEY);
    window.location.href = ocmBaseName();
  };

  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title={
        <>
          Simulating a <em>restricted</em> environment
        </>
      }
      className="pf-v5-u-flex-basis-0 pf-v5-u-flex-grow-1"
    >
      <Button variant={ButtonVariant.link} isInline onClick={goBackToNormal}>
        Remove <strong>restricted env</strong> override
      </Button>
    </Alert>
  );
};

export default RestrictedEnvOverrideMessage;
