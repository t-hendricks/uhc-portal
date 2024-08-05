import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks';

import ClusterHealthCard from './components/ClusterHealthCard';
import MonitoringEmptyState from './components/MonitoringEmptyState';
import MonitoringList from './components/MonitoringList';
import { clearMonitoringState } from './MonitoringActions';
import { monitoringStatuses } from './monitoringHelper';
import {
  alertsNodesOperatorsSelector,
  clusterHealthSelector,
  issuesAndWarningsSelector,
  lastCheckInSelector,
} from './MonitoringSelectors';

import './Monitoring.scss';

const Monitoring = ({ cluster }) => {
  const dispatch = useDispatch();
  const monitoring = useGlobalState((state) => state.monitoring);
  const issuesAndWarnings = issuesAndWarningsSelector(monitoring, cluster);
  const { issues, warnings } = issuesAndWarnings;
  const totalIssuesCount = issuesAndWarnings.issues.totalCount;
  const lastCheckIn = lastCheckInSelector(cluster);
  const healthStatus = clusterHealthSelector(cluster, lastCheckIn, totalIssuesCount);
  const discoveredIssues = issues.totalCount;

  const { alerts, nodes, operators, resourceUsage } = alertsNodesOperatorsSelector(
    monitoring,
    issues,
    warnings,
    cluster,
  );

  React.useEffect(
    () => () => {
      dispatch(clearMonitoringState());
    },
    //  mimics componentWillUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (healthStatus === monitoringStatuses.DISCONNECTED) {
    return (
      <>
        <ClusterHealthCard
          lastCheckIn={lastCheckIn}
          status={healthStatus}
          discoveredIssues={discoveredIssues}
        />
        <MonitoringEmptyState lastCheckIn={lastCheckIn} />
      </>
    );
  }

  if (healthStatus === monitoringStatuses.NO_METRICS) {
    return (
      <MonitoringEmptyState lastCheckIn={lastCheckIn}>
        <p>
          Monitoring data is not available if a cluster goes more than three hours without sending
          metrics.
          <br />
          Check the cluster&apos;s web console if you think that this cluster should be sending
          metrics.
        </p>
      </MonitoringEmptyState>
    );
  }

  if (healthStatus === monitoringStatuses.UNKNOWN) {
    return (
      <MonitoringEmptyState hideLastCheckIn>
        <p>
          Monitoring data is not available - cluster did not send any metrics.
          <br />
          Check the cluster&apos;s web console if you think that this cluster should be sending
          metrics.
        </p>
      </MonitoringEmptyState>
    );
  }

  return (
    <>
      <ClusterHealthCard
        lastCheckIn={lastCheckIn}
        status={healthStatus}
        discoveredIssues={discoveredIssues}
      />
      <Card className="ocm-c-monitoring-status__card">
        <CardTitle className="ocm-c-monitoring-status__card--header">
          <Title headingLevel="h2" className="card-title">
            Status
          </Title>
        </CardTitle>
        <CardBody className="ocm-c-monitoring-status__card--body">
          <MonitoringList
            cluster={cluster}
            alerts={alerts}
            nodes={nodes}
            operators={operators}
            resourceUsage={resourceUsage}
          />
        </CardBody>
      </Card>
    </>
  );
};

Monitoring.propTypes = {
  cluster: PropTypes.object,
};

Monitoring.defaultProps = {
  cluster: {},
};

export default Monitoring;
