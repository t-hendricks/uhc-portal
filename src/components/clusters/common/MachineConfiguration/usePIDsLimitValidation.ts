import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PIDS_LIMIT_MAX,
  PIDS_LIMIT_MAX_OVERRIDE,
} from '~/components/clusters/common/machinePools/constants';

export function usePIDsLimitValidation(
  currentValue: number | undefined,
  min: number,
  max: number,
  canBypassPIDsLimit: boolean,
) {
  const [isValid, setIsValid] = useState(true);

  const validatePIDsLimit = useCallback(
    (value: number) => Number.isInteger(value) && value <= max && value >= min,
    [max, min],
  );

  const isPIDsLimitUnsafe = useMemo(
    () => (canBypassPIDsLimit && isValid && currentValue ? currentValue > PIDS_LIMIT_MAX : false),
    [canBypassPIDsLimit, currentValue, isValid],
  );

  const validationMessage = useMemo(() => {
    if (currentValue !== undefined && !validatePIDsLimit(currentValue)) {
      if (canBypassPIDsLimit && currentValue > max) {
        // if the user can bypass the max limit, we only want to show the override limit when the provided value is higher
        return `Please enter a value between ${min.toLocaleString()} - ${PIDS_LIMIT_MAX_OVERRIDE.toLocaleString()}`;
      }
      return `Please enter a value between ${min.toLocaleString()} - ${PIDS_LIMIT_MAX.toLocaleString()}`;
    }
    return '';
  }, [max, min, canBypassPIDsLimit, currentValue, validatePIDsLimit]);

  useEffect(() => {
    setIsValid(currentValue !== undefined ? validatePIDsLimit(currentValue) : true);
  }, [currentValue, validatePIDsLimit]);

  return {
    isValid,
    isPIDsLimitUnsafe,
    validationMessage,
  };
}
