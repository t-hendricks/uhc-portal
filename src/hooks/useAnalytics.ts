import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { getTrackEvent } from '~/common/analytics';

interface useAnalyticsReturn {
  /** a convenience function that composes the track event parsing and the actual tracking. */
  track: (trackEvent: object, options: object) => void;
  /** the analytics API instance */
  analytics: any;
  /**
   * adds additional page metadata on route changes
   * NOTE: Does not work on initial page load
   */
  setPageMetadata: (metadata: any) => void;
}

/**
 * Provides an analytics API instance, and a helper method for tracking.
 */
const useAnalytics = (): useAnalyticsReturn => {
  const { analytics, segment: { setPageMetadata } } = useChrome();

  const track = (trackEvent: object, options = {}) => {
    const eventObj: any = getTrackEvent(trackEvent, options);
    analytics.track(eventObj.event, eventObj.properties);
  };

  return { track, analytics, setPageMetadata };
};

export default useAnalytics;
