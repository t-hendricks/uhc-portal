import React from 'react';
import PropTypes from 'prop-types';
import { NoIssuesMessage, NoRulesMessage } from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.css';

const Insights = ({ insights, voteOnRule }) => {
  if (insights && insights.status === 404) {
    return <NoRulesMessage />;
  }
  if (!insights || insights.meta.count === 0) {
    return <NoIssuesMessage />;
  }
  return <InsightsTable insights={insights} voteOnRule={voteOnRule} />;
};

Insights.propTypes = {
  insights: PropTypes.object,
  voteOnRule: PropTypes.func.isRequired,
};

Insights.defaultProps = {
  insights: {
    meta: { count: 0 },
    data: [],
  },
};

export default Insights;
