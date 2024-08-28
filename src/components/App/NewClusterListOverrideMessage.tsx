import React from 'react';

import { Alert, Button, ButtonVariant } from '@patternfly/react-core';

import { NEW_CLUSTER_LIST_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';
import { ocmBaseName } from '~/common/routing';

const NewClusterListOverrideMessage = () => {
  const removeNewClusterListFlag = () => {
    localStorage.removeItem(NEW_CLUSTER_LIST_LOCALSTORAGE_KEY);
    window.location.href = ocmBaseName;
  };

  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title="New cluster list preview active"
      className="pf-v5-u-flex-basis-0 pf-v5-u-flex-grow-1"
    >
      <Button variant={ButtonVariant.link} isInline onClick={removeNewClusterListFlag}>
        Turn off <strong>new cluster list preview</strong>
      </Button>
    </Alert>
  );
};

export default NewClusterListOverrideMessage;
