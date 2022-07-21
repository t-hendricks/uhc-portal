import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

const withAnalytics = Component => (props) => {
  const { analytics } = useChrome();

  return (
    <Component
      {...props}
      analytics={analytics}
    />
  );
};

export default withAnalytics;
