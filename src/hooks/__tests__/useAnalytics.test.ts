import { renderHook } from '@testing-library/react-hooks';
import useAnalytics from '../useAnalytics';

describe('useAnalytics', () => {
  let hook;

  beforeEach(() => {
    hook = renderHook(useAnalytics).result.current;
  });

  it('provides the track method', async () => {
    expect(hook.track).toBeInstanceOf(Function);
  });
});
