import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  Title, CardTitle,
} from '@patternfly/react-core';

import ClusterHealthCard from './components/ClusterHealthCard';
import MonitoringList from './components/MonitoringList';
import MonitoringEmptyState from './components/MonitoringEmptyState';
import { monitoringStatuses } from './monitoringHelper';

import { noop } from '../../../../../common/helpers';

class Monitoring extends React.Component {
  componentWillUnmount() {
    const { clearMonitoringState } = this.props;
    clearMonitoringState();
  }

  render() {
    const {
      cluster, alerts, nodes, operators, lastCheckIn, resourceUsage, healthStatus, discoveredIssues,
    } = this.props;

    const isInstalling = healthStatus === monitoringStatuses.INSTALLING;

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

    if (isInstalling) {
      return (
        <>
          <ClusterHealthCard status={healthStatus} />
          <MonitoringEmptyState hideLastCheckIn>
            <p>Monitoring data is not available at this time. Try again later.</p>
          </MonitoringEmptyState>
        </>
      );
    }

    if (healthStatus === monitoringStatuses.NO_METRICS) {
      return (
        <MonitoringEmptyState lastCheckIn={lastCheckIn}>
          <p>
            Monitoring data is not available if a cluster goes more than
            three hours without sending metrics.
            <br />
        Check the cluster&apos;s web console if you think that this cluster should
        be sending metrics.
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
        <Card id="monitoring">
          <CardTitle>
            <Title headingLevel="h2" className="card-title" size="md">Status</Title>
          </CardTitle>
          <CardBody>
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
  }
}

Monitoring.propTypes = {
  cluster: PropTypes.object,
  clearMonitoringState: PropTypes.func,
  alerts: PropTypes.object,
  nodes: PropTypes.object,
  operators: PropTypes.object,
  resourceUsage: PropTypes.object,
  lastCheckIn: PropTypes.instanceOf(Date).isRequired,
  healthStatus: PropTypes.string,
  discoveredIssues: PropTypes.number,
};

Monitoring.defaultProps = {
  cluster: {},
  alerts: {},
  nodes: {},
  operators: {},
  clearMonitoringState: noop,
  discoveredIssues: null,
};

export default Monitoring;
