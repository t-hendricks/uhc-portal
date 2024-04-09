import React from 'react';
import { useLocation, useParams } from 'react-router-dom-v5-compat';

import ClusterDetailsRedirector from '../ClusterDetailsRedirector';
import InsightsAdvisorRedirector from '../InsightsAdvisorRedirector';

const ClusterDetailsClusterOrExternalId = (props) => {
  const params = useParams();
  const location = useLocation();

  /* This guarantees that the old links to OCM will redirect to OCP Advisor
       instead of the deprecated Insights Advisor tab */
  if (location.hash === '#insights') {
    // Redirect to OCP Advisor (OpenShift Insights)
    return <InsightsAdvisorRedirector params={params} location={location} {...props} />;
  }

  return <ClusterDetailsRedirector params={params} location={location} {...props} />;
};

export default ClusterDetailsClusterOrExternalId;
