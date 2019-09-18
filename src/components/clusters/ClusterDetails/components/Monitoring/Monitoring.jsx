import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
  Title,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { WarningTriangleIcon } from '@patternfly/react-icons';

import ClusterHealthCard from './components/ClusterHealthCard';
import MonitoringList from './components/MonitoringList';
import { statuses } from './statusHelper';

import { noop } from '../../../../../common/helpers';

class Monitoring extends React.Component {
  componentDidMount() {
    const { getNodes, getAlerts, cluster } = this.props;
    getNodes(cluster.id);
    getAlerts(cluster.id);
  }

  componentWillUnmount() {
    const { clearMonitoringState } = this.props;
    clearMonitoringState();
  }

  render() {
    const {
      cluster, alerts, nodes, lastCheckIn, resourceUsage, healthStatus, discoveredIssues,
    } = this.props;

    const lastCheckInText = lastCheckIn && `Last check-in: ${lastCheckIn}`;

    const emptyState = body => (
      <EmptyState>
        <EmptyStateIcon icon={WarningTriangleIcon} />
        <Title headingLevel="h5" size="lg">Monitoring Data is not available</Title>
        <EmptyStateBody>
          <>
            {body}
            <p>{lastCheckInText}</p>
          </>
        </EmptyStateBody>
      </EmptyState>
    );

    if (healthStatus === statuses.NO_METRICS) {
      return emptyState(
        <p>
        Monitoring Data is not available if a cluster goes more than
        three hours without sending metrics.
          <br />
        Check the cluster&apos;s web console if you think that this cluster should
        be sending metrics.
        </p>,
      );
    }

    if (healthStatus === statuses.DISCONNECTED) {
      return (
        <React.Fragment>
          <ClusterHealthCard
            lastCheckIn={lastCheckIn}
            status={healthStatus}
            discoveredIssues={discoveredIssues}
          />
          { emptyState }
        </React.Fragment>
      );
    }

    const isInProgress = healthStatus === statuses.INSTALLING || healthStatus === statuses.UPDATING;

    return (
      <React.Fragment>
        <ClusterHealthCard
          lastCheckIn={!isInProgress ? lastCheckIn : null}
          status={healthStatus}
          discoveredIssues={discoveredIssues}
        />
        { isInProgress
          ? emptyState(
            <p>Monitoring Data is not available at this time. Please check back later.</p>,
          )
          : (
            <Card id="monitoring">
              <CardHeader>
                <Title headingLevel="h2" size="3xl">Status</Title>
              </CardHeader>
              <CardBody>
                <MonitoringList
                  cluster={cluster}
                  alerts={alerts}
                  nodes={nodes}
                  resourceUsage={resourceUsage}
                />
              </CardBody>
            </Card>
          )
          }
      </React.Fragment>
    );
  }
}

Monitoring.propTypes = {
  cluster: PropTypes.object,
  getNodes: PropTypes.func,
  getAlerts: PropTypes.func,
  clearMonitoringState: PropTypes.func,
  alerts: PropTypes.object,
  nodes: PropTypes.object,
  resourceUsage: PropTypes.object,
  lastCheckIn: PropTypes.string,
  healthStatus: PropTypes.string,
  discoveredIssues: PropTypes.number,
};

Monitoring.defaultProps = {
  cluster: {},
  alerts: {},
  nodes: {},
  getNodes: noop,
  getAlerts: noop,
  clearMonitoringState: noop,
  lastCheckIn: '',
  discoveredIssues: null,
};

export default Monitoring;
