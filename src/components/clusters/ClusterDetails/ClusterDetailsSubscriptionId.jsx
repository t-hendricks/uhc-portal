import React from 'react';
import { useParams, useLocation } from 'react-router-dom-v5-compat';
import ClusterDetails from '.';
import InsightsAdvisorRedirector from '../InsightsAdvisorRedirector';

const ClusterDetailsSubscriptionId = (props) => {
  const params = useParams();
  const location = useLocation();

  /* This guarantees that the old links to OCM will redirect to OCP Advisor
       instead of the deprecated Insights Advisor tab */
  return location.hash === '#insights' ? (
    <InsightsAdvisorRedirector params={params} location={location} {...props} />
  ) : (
    <ClusterDetails params={params} location={location} {...props} />
  );
};

export default ClusterDetailsSubscriptionId;
