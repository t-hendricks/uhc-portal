import React from 'react';
import PropTypes from 'prop-types';

import ClusterDetails from '.';
import InsightsAdvisorRedirector from '../InsightsAdvisorRedirector';

const ClusterDetailsSubscriptionId = (props) => {
  const {
    location: { hash },
  } = props;

  /* This guarantees that the old links to OCM will redirect to OCP Advisor
       instead of the deprecated Insights Advisor tab */
  if (hash === '#insights') {
    // Redirect to OCP Advisor (OpenShift Insights)
    return <InsightsAdvisorRedirector {...props} />;
  }

  return <ClusterDetails {...props} />;
};

ClusterDetailsSubscriptionId.propTypes = {
  location: PropTypes.shape({ hash: PropTypes.string }),
};

export default ClusterDetailsSubscriptionId;
