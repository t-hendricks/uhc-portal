import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Bullseye } from '@patternfly/react-core';
import {
  NoIssuesMessage,
  NoRulesMessage,
  AnalysisInProgressMessage,
  ErrorMessage,
} from './EmptyTableMessage';
import InsightsTable from './InsightsTable';
import './index.scss';

const Insights = ({
  insightsData,
  enableRule,
  cluster,
  openModal,
  addNotification,
}) => {
  const status = get(insightsData, 'status');

  if (!insightsData || status === 404) {
    return (
      <Bullseye className="insights-loading-container">
        <NoRulesMessage />
      </Bullseye>
    );
  }
  // insights-operator was just installed on cluster, no information yet
  if (status === 204) {
    return <AnalysisInProgressMessage />;
  }
  // Another error
  if (status !== 200 && status !== 304) {
    return <ErrorMessage />;
  }
  // No issues was found
  if (get(insightsData, 'meta.count', 0) === 0) {
    return <NoIssuesMessage lastChecked={get(insightsData, 'meta.last_checked_at')} />;
  }

  return (
    <InsightsTable
      cluster={cluster}
      insightsData={insightsData}
      enableRule={enableRule}
      openModal={openModal}
      addNotifiction={addNotification}
    />
  );
};

Insights.propTypes = {
  cluster: PropTypes.object.isRequired,
  insightsData: PropTypes.object,
  enableRule: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

export default Insights;
