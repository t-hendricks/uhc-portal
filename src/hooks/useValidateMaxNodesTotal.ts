import { useCallback } from 'react';

import { validateMaxNodes, validatePositive } from '~/common/validators';
import { BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP } from '~/redux/constants/featureConstants';

import { useFeatureGate } from './useFeatureGate';

const useValidateMaxNodesTotal = (maxNodesTotalDefault: number) => {
  const bypassComputeNodeCountLimitClassicOsdGcpFlag = useFeatureGate(
    BYPASS_COMPUTE_NODE_COUNT_LIMIT_CLASSIC_OSD_GCP,
  );
  const validateMaxNodesTotal = useCallback(
    (value: string) => {
      const negativeValueError = validatePositive(value);
      if (negativeValueError !== undefined) {
        return negativeValueError;
      }
      return bypassComputeNodeCountLimitClassicOsdGcpFlag
        ? undefined
        : validateMaxNodes(value, maxNodesTotalDefault);
    },
    [bypassComputeNodeCountLimitClassicOsdGcpFlag, maxNodesTotalDefault],
  );
  return validateMaxNodesTotal;
};

export default useValidateMaxNodesTotal;
