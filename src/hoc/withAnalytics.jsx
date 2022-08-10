import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { getTrackEvent } from '~/common/analytics';

/**
 * Provides an analytics API instance, and a helper method for tracking.
 *
 * @param AnalyticsContext {function(*)|React.Component|React.PureComponent}
 * The component to receive the analytics instance.
 * @returns {function(*)}
 * A wrapped component, enriched with these properties:
 * - track - a convenience function that composes the track event parsing and the actual tracking.
 * - analytics - the analytics API instance
 */
const withAnalytics = AnalyticsContext => (props) => {
  const { analytics } = useChrome();

  const track = (...args) => {
    const eventObj = getTrackEvent(...args);
    analytics.track(eventObj.event, eventObj.properties);
  };

  return (
    <AnalyticsContext
      {...props}
      track={track}
      analytics={analytics}
    />
  );
};

export default withAnalytics;
