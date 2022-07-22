import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

/**
 * A Higher-Order Component to provide an analytics API instance.
 *
 * @param AnalyticsContext {function(*)|React.Component|React.PureComponent}
 * The component to receive the analytics instance.
 * @returns {function(*)}
 * A wrapped component, enriched with the analytics API as a property.
 */
const withAnalytics = AnalyticsContext => (props) => {
  const { analytics } = useChrome();

  return (
    <AnalyticsContext
      {...props}
      analytics={analytics}
    />
  );
};

export default withAnalytics;
