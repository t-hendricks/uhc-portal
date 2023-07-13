import { renderHook } from '@testing-library/react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useAnalytics from '../useAnalytics';
import { getTrackEvent } from '../../common/analytics';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => jest.fn());
jest.mock('../../common/analytics', () => ({
  getTrackEvent: jest.fn(),
}));

const useChromeMock = useChrome as jest.Mock;
const getTrackEventMock = getTrackEvent as jest.Mock;

describe('useAnalytics', () => {
  const analyticsTrackMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    useChromeMock.mockReturnValue({
      analytics: {
        track: analyticsTrackMock,
      },
    });
  });

  it('should track events as a string', async () => {
    const track = renderHook(useAnalytics).result.current;

    // string event with string properties
    track('testEvent', 'testProperties');
    expect(analyticsTrackMock).toHaveBeenCalledWith('testEvent', { type: 'testProperties' });
    analyticsTrackMock.mockReset();

    // string event with object properties
    track('testEvent', { foo: 'bar' });
    expect(analyticsTrackMock).toHaveBeenCalledWith('testEvent', { foo: 'bar' });
  });

  it('should track events as an object', async () => {
    const track = renderHook(useAnalytics).result.current;
    const getTrackEventValue = {
      event: 'test',
      properties: { foo: 'bar' },
    };
    getTrackEventMock.mockReturnValue(getTrackEventValue);

    // object event with object options
    const trackEvent = { event: 'a', link_name: 'b' };
    const trackOptions = { url: 'y' };
    track(trackEvent, trackOptions);
    expect(getTrackEventMock).toHaveBeenCalledWith(trackEvent, trackOptions);
    expect(analyticsTrackMock).toHaveBeenCalledWith(
      getTrackEventValue.event,
      getTrackEventValue.properties,
    );
  });
});
