import { renderHook } from '@testing-library/react';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { useFeatureGate, featureGateSelector } from '../useFeatureGate';

jest.mock('~/redux/hooks/useGlobalState', () => ({
  useGlobalState: jest.fn(),
}));

describe('useFeatureGate', () => {
  it('Returns true if feature is enabled', () => {
    const features = { MY_GATE: true, MY_OTHER_GATE: false };
    (useGlobalState as jest.Mock).mockReturnValue(features);

    const { result } = renderHook(() => useFeatureGate('MY_GATE'));
    expect(result.current).toBe(true);
  });

  it('Returns false if feature is not enabled', () => {
    const features = { MY_GATE: true, MY_OTHER_GATE: false };
    (useGlobalState as jest.Mock).mockReturnValue(features);

    const { result } = renderHook(() => useFeatureGate('MY_OTHER_GATE'));
    expect(result.current).toBe(false);
  });

  it('Returns false if feature is unknown', () => {
    const features = { MY_GATE: true, MY_OTHER_GATE: false };
    (useGlobalState as jest.Mock).mockReturnValue(features);

    const { result } = renderHook(() => useFeatureGate('MY_UNKNOWN_GATE'));
    expect(result.current).toBe(false);
  });

  it('Returns false if features are not in store', () => {
    (useGlobalState as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useFeatureGate('MY_UNKNOWN_GATE'));
    expect(result.current).toBe(false);
  });
});

describe('featureGateSelector', () => {
  it('Returns true if feature is enabled', () => {
    const state = { features: { MY_GATE: true, MY_OTHER_GATE: false } };
    // @ts-ignore = keeping it simple and not fully typing the store
    expect(featureGateSelector(state, 'MY_GATE')).toEqual(true);
  });

  it('Returns false if feature is not enabled', () => {
    const state = { features: { MY_GATE: true, MY_OTHER_GATE: false } };
    // @ts-ignore = keeping it simple and not fully typing the store
    expect(featureGateSelector(state, 'MY_OTHER_GATE')).toEqual(false);
  });

  it('Returns false if feature is unknown', () => {
    const state = { features: { MY_GATE: true, MY_OTHER_GATE: false } };
    // @ts-ignore = keeping it simple and not fully typing the store
    expect(featureGateSelector(state, 'MY_UNKNOWN_GATE')).toEqual(false);
  });

  it('Returns false if features are not in store', () => {
    const state = {};
    // @ts-ignore = keeping it simple and not fully typing the store
    expect(featureGateSelector(state, 'MY_UNKNOWN_GATE')).toEqual(false);
  });
});
