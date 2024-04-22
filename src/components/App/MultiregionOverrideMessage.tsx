import React from 'react';

import { Alert, Button, ButtonVariant } from '@patternfly/react-core';

import ocmBaseName from '~/common/getBaseName';
import { MULTIREGION_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';

const MultiregionOvverideMessage = () => {
  const removeMultiRegionPreviewFlag = () => {
    localStorage.removeItem(MULTIREGION_LOCALSTORAGE_KEY);
    window.location.href = ocmBaseName();
  };

  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title="Environment override active"
      actionLinks={
        <Button variant={ButtonVariant.link} isInline onClick={removeMultiRegionPreviewFlag}>
          Turn off <b>Multiregion preview</b>
        </Button>
      }
    >
      You&apos;re now using the <b>Multiregion Preview active</b> environment API.{' '}
    </Alert>
  );
};

export default MultiregionOvverideMessage;
