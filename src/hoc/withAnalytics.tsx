import React from 'react';
import useAnalytics from '~/hooks/useAnalytics';

type WithAnalyticsProps = ReturnType<typeof useAnalytics>;

/**
 * Provides a helper function for analytics track events.
 * Wrapped component enriched with these properties:
 *  - track - a convenience function that composes the track event parsing and the actual tracking.
 */
const withAnalytics =
  <Props extends WithAnalyticsProps>(AnalyticsContext: React.ComponentType<Props>) =>
  (props: Omit<Props, 'track'>) =>
    <AnalyticsContext {...(props as Props)} track={useAnalytics()} />;

export default withAnalytics;
