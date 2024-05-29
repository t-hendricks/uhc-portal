import React from 'react';

import { Alert, Button, ButtonVariant } from '@patternfly/react-core';

import ocmBaseName from '~/common/getBaseName';
import { MULTIREGION_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { MULTIREGION_PREVIEW_ENABLED } from '~/redux/constants/featureConstants';

const MultiRegionOverrideMessage = () => {
  const multiRegionFeatureGate = useFeatureGate(MULTIREGION_PREVIEW_ENABLED);
  const removeMultiRegionPreviewFlag = () => {
    localStorage.removeItem(MULTIREGION_LOCALSTORAGE_KEY);
    window.location.href = ocmBaseName();
  };

  if (!multiRegionFeatureGate) {
    return (
      <Alert
        variant="info"
        isInline
        id="env-override-message"
        title="Environment override not available"
        actionLinks={
          <Button variant={ButtonVariant.link} isInline onClick={removeMultiRegionPreviewFlag}>
            Turn off <b>Multiregion preview</b>
          </Button>
        }
      >
        You do not have access to view the Multiregion Preview environment API. The Multiregion
        Preview items will <strong>not</strong> be shown.
      </Alert>
    );
  }

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

export default MultiRegionOverrideMessage;
