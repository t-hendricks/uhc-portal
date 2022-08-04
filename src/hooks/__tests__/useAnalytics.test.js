import { renderHook } from '@testing-library/react-hooks';
import useAnalytics from '../useAnalytics';

describe('useAnalytics', () => {
  it.skip('...', () => {
    renderHook(useAnalytics);
    expect().toBe();
  });

  it.skip('... when the hook is unmounted', () => {
    const { unmount } = renderHook(() => useAnalytics());

    unmount();
    expect().toBeNull();
  });
});
