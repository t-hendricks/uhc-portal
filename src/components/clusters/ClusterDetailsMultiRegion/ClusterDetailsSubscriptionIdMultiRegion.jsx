import React from 'react';
import { useLocation, useParams } from 'react-router-dom-v5-compat';

import InsightsAdvisorRedirector from '../InsightsAdvisorRedirector';

import ClusterDetails from '.';

const ClusterDetailsSubscriptionIdMultiRegion = (props) => {
  const params = useParams();
  const location = useLocation();

  /* This guarantees that the old links to OCM will redirect to OCP Advisor
       instead of the deprecated Insights Advisor tab */
  return location.hash === '#insights' ? (
    <InsightsAdvisorRedirector params={params} location={location} {...props} />
  ) : (
    <ClusterDetails location={location} {...props} />
  );
};

export default ClusterDetailsSubscriptionIdMultiRegion;
