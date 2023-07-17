import { renderHook } from '@testing-library/react';
import usePreventBrowserNav from '../usePreventBrowserNav';

describe('usePreventBrowserNav', () => {
  it('onbeforeunload event is a function that returns true by default', () => {
    renderHook(usePreventBrowserNav);

    expect(window.onbeforeunload).toBeInstanceOf(Function);
    expect(window.onbeforeunload?.({} as any)).toEqual(true);
  });

  it('onbeforeunload event is null if "when" condition is false', () => {
    renderHook(() => usePreventBrowserNav(false));

    expect(window.onbeforeunload).toBeNull();
  });

  it('onbeforeunload event is reset to null when the hook is unmounted', () => {
    const { unmount } = renderHook(() => usePreventBrowserNav(true));

    unmount();
    expect(window.onbeforeunload).toBeNull();
  });
});
