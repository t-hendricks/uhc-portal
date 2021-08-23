import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
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
}) => {
  if (!insightsData) {
    return (
      <Bullseye className="insights-loading-container">
        <Spinner />
      </Bullseye>
    );
  }

  const status = get(insightsData, 'status');
  // No enabled rules for cluster
  if (status === 404) {
    return <NoRulesMessage />;
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
    />
  );
};

Insights.propTypes = {
  cluster: PropTypes.object.isRequired,
  insightsData: PropTypes.object,
  enableRule: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default Insights;
