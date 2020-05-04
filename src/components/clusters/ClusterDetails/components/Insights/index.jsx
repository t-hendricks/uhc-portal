import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { NoIssuesMessage, NoRulesMessage } from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.css';

const Insights = ({
  insightsData, voteOnRule, disableRule, enableRule,
}) => {
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

  return (
    <InsightsTable
      insightsData={insightsData}
      voteOnRule={voteOnRule}
      disableRule={disableRule}
      enableRule={enableRule}
    />
  );
};

Insights.propTypes = {
  insightsData: PropTypes.object.isRequired,
  voteOnRule: PropTypes.func.isRequired,
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
};

export default Insights;
