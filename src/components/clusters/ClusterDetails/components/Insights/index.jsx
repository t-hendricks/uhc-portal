import React from 'react';
import PropTypes from 'prop-types';
import { NoIssuesMessage, NoRulesMessage } from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.css';

const Insights = ({ insightsData, voteOnRule }) => {
  if (insightsData && insightsData.status === 404) {
    return <NoRulesMessage />;
  }
  if (!insightsData || insightsData.meta.count === 0) {
    return <NoIssuesMessage />;
  }
  return <InsightsTable insightsData={insightsData} voteOnRule={voteOnRule} />;
};

Insights.propTypes = {
  insightsData: PropTypes.object,
  voteOnRule: PropTypes.func.isRequired,
};

Insights.defaultProps = {
  insightsData: {
    meta: { count: 0 },
    data: [],
  },
};

export default Insights;
