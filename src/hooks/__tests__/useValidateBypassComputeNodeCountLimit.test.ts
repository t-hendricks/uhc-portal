import { renderHook } from '@testing-library/react';

import { validateMaxNodes } from '~/common/validators';

import { useFeatureGate } from '../useFeatureGate';
import useValidateBypassComputeNodeCountLimit from '../useValidateBypassComputeNodeCountLimit';

jest.mock('~/common/validators', () => ({
  validateMaxNodes: jest.fn(),
}));

jest.mock('../useFeatureGate', () => ({
  useFeatureGate: jest.fn(),
}));

describe('useValidateBypassComputeNodeCountLimit', () => {
  it('should return undefined when bypassComputeNodeCountLimitClassicOsdGcpFlag is true', () => {
    (useFeatureGate as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useValidateBypassComputeNodeCountLimit(10));

    const validationResult = result.current('5');
    expect(validationResult).toBeUndefined();
    expect(validateMaxNodes).not.toHaveBeenCalled();
  });

  it('should call validateMaxNodes when bypassComputeNodeCountLimitClassicOsdGcpFlag is false', () => {
    (useFeatureGate as jest.Mock).mockReturnValue(false);
    (validateMaxNodes as jest.Mock).mockReturnValue('value');

    const { result } = renderHook(() => useValidateBypassComputeNodeCountLimit(10));

    const validationResult = result.current('5');
    expect(validationResult).toBe('value');
    expect(validateMaxNodes).toHaveBeenCalledWith('5', 10);
  });

  it('should return undefined when validateMaxNodes returns undefined', () => {
    (useFeatureGate as jest.Mock).mockReturnValue(false);
    (validateMaxNodes as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useValidateBypassComputeNodeCountLimit(10));

    const validationResult = result.current('5');
    expect(validationResult).toBeUndefined();
    expect(validateMaxNodes).toHaveBeenCalledWith('5', 10);
  });
});
