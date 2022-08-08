import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { getTrackEvent } from '~/common/analytics';

/**
 * Provides an analytics API instance, and a helper method for tracking.
 *
 * @returns {object}
 * - track - a convenience function that composes the track event parsing and the actual tracking.
 * - analytics - the analytics API instance
 */
const useAnalytics = () => {
  const { analytics } = useChrome();

  const track = (...args) => {
    const eventObj = getTrackEvent(...args);
    analytics.track(eventObj.event, eventObj.properties);
  };

  return { track, analytics };
};

export default useAnalytics;
