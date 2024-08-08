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
        title={
          <>
            You do not have access to view the Multiregion Preview. The Multiregion Preview items
            will <em>not</em> be shown
          </>
        }
        className="pf-v5-u-flex-basis-0 pf-v5-u-flex-grow-1"
      >
        <Button variant={ButtonVariant.link} isInline onClick={removeMultiRegionPreviewFlag}>
          Turn off <strong>Multiregion preview</strong>
        </Button>
      </Alert>
    );
  }

  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title="Multiregion preview active"
      className="pf-v5-u-flex-basis-0 pf-v5-u-flex-grow-1"
    >
      <Button variant={ButtonVariant.link} isInline onClick={removeMultiRegionPreviewFlag}>
        Turn off <strong>Multiregion preview</strong>
      </Button>
    </Alert>
  );
};

export default MultiRegionOverrideMessage;
