import { useCallback } from 'react';

import { validateMaxNodes } from '~/common/validators';
import { BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP } from '~/redux/constants/featureConstants';

import { useFeatureGate } from './useFeatureGate';

const useValidateBypassComputeNodeCountLimit = (maxNodesTotalDefault: number) => {
  const bypassComputeNodeCountLimitClassicOsdGcpFlag = useFeatureGate(
    BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP,
  );

  const validateBypassComputeNodeCountLimit = useCallback(
    (value: string) =>
      bypassComputeNodeCountLimitClassicOsdGcpFlag
        ? undefined
        : validateMaxNodes(value, maxNodesTotalDefault),
    [bypassComputeNodeCountLimitClassicOsdGcpFlag, maxNodesTotalDefault],
  );

  return validateBypassComputeNodeCountLimit;
};

export default useValidateBypassComputeNodeCountLimit;
