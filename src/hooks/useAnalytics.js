import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { getTrackEvent } from '~/common/analytics';

const useAnalytics = () => {
  const { analytics } = useChrome();
  // todo - move this to analytics.js, and do the same for withAnalytics
  const track = (...args) => {
    const eventObj = getTrackEvent(...args);
    analytics.track(eventObj.event, eventObj.properties);
  };
  return { track, analytics };
};

export default useAnalytics;
