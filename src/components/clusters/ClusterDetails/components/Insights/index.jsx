import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { NoIssuesMessage, NoRulesMessage } from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.css';

const Insights = ({ insightsData, voteOnRule }) => {
  if (!insightsData) {
    return (
      <Bullseye className="insights-loading-container">
        <Spinner />
      </Bullseye>
    );
  }

  if (insightsData.status === 404) {
    return <NoRulesMessage />;
  }
  if (!insightsData || get(insightsData, 'meta.count', 0) === 0) {
    return <NoIssuesMessage lastChecked={get(insightsData, 'meta.last_checked_at')} />;
  }

  return <InsightsTable insightsData={insightsData} voteOnRule={voteOnRule} />;
};

Insights.propTypes = {
  insightsData: PropTypes.object.isRequired,
  voteOnRule: PropTypes.func.isRequired,
};

export default Insights;
