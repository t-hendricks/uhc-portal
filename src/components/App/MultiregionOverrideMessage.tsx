import React from 'react';

import { Alert } from '@patternfly/react-core';

import { MULTIREGION_LOCALSTORAGE_KEY } from '~/common/localStorageConstants';
import { Link } from '~/common/routing';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { MULTIREGION_PREVIEW_ENABLED } from '~/redux/constants/featureConstants';

const MultiRegionOverrideMessage = () => {
  const multiRegionFeatureGate = useFeatureGate(MULTIREGION_PREVIEW_ENABLED);
  const removeMultiRegionPreviewFlag = () => {
    localStorage.removeItem(MULTIREGION_LOCALSTORAGE_KEY);
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
        <Link to="/" reloadDocument onClick={removeMultiRegionPreviewFlag}>
          Turn off <strong>Multiregion preview</strong>
        </Link>
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
      <Link to="/" reloadDocument onClick={removeMultiRegionPreviewFlag}>
        Turn off <strong>Multiregion preview</strong>
      </Link>
    </Alert>
  );
};

export default MultiRegionOverrideMessage;
