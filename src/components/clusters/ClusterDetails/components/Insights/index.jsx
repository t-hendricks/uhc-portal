import React from 'react';
import PropTypes from 'prop-types';
import { NoIssuesMessage, NoRulesMessage } from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.css';

const Insights = ({ insights }) => {
  if (insights && insights.status === 404) {
    return <NoRulesMessage/>;
  }
  if (!insights || insights.meta.count === 0) {
    return <NoIssuesMessage />;
  }
  return <InsightsTable insights={insights} />;
};

Insights.propTypes = {
  insights: PropTypes.object,
};

Insights.defaultProps = {
  insights: {
    meta: { count: 0 },
    data: [],
  },
};

export default Insights;
