import React from 'react';
import { useLocation } from 'react-router-dom';

import InsightsAdvisorRedirector from '../InsightsAdvisorRedirector';

import ClusterDetails from '.';

const ClusterDetailsSubscriptionId = (props) => {
  const location = useLocation();

  /* This guarantees that the old links to OCM will redirect to OCP Advisor
       instead of the deprecated Insights Advisor tab */
  return location.hash === '#insights' ? (
    <InsightsAdvisorRedirector {...props} />
  ) : (
    <ClusterDetails {...props} />
  );
};

export default ClusterDetailsSubscriptionId;
