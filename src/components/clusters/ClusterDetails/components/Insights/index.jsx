import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import {
  NoIssuesMessage,
  NoRulesMessage,
  AnalysisInProgressMessage,
  ErrorMessage,
} from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.css';

const Insights = ({
  insightsData, voteOnRule, disableRule, enableRule, groups,
}) => {
  if (!insightsData) {
    return (
      <Bullseye className="insights-loading-container">
        <Spinner />
      </Bullseye>
    );
  }

  // No enabled rules for cluster
  if (insightsData.status === 404) {
    return <NoRulesMessage />;
  }
  // insights-operator was just installed on cluster, no information yet
  if (insightsData.status === 204) {
    return <AnalysisInProgressMessage />;
  }
  // Error on aggregator side
  if (insightsData.status === 500) {
    return <ErrorMessage />;
  }
  // No issues was found
  if (!insightsData || get(insightsData, 'meta.count', 0) === 0) {
    return <NoIssuesMessage lastChecked={get(insightsData, 'meta.last_checked_at')} />;
  }

  return (
    <InsightsTable
      insightsData={insightsData}
      groups={groups}
      voteOnRule={voteOnRule}
      disableRule={disableRule}
      enableRule={enableRule}
    />
  );
};

Insights.propTypes = {
  insightsData: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  voteOnRule: PropTypes.func.isRequired,
  disableRule: PropTypes.func.isRequired,
  enableRule: PropTypes.func.isRequired,
};

export default Insights;
