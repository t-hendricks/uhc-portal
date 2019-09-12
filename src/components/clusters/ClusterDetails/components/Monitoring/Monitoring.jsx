import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@redhat-cloud-services/frontend-components';
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

  render() {
    const {
      cluster, alerts, nodes, lastCheckIn, resourceUsage, healthStatus, discoveredIssues, isPending,
    } = this.props;

    if (isPending) {
      return <Spinner id="monitoring-spinner" />;
    }

    const emptyState = (
      <EmptyState className="cluster-details-user-tab-contents">
        <EmptyStateIcon icon={WarningTriangleIcon} />
        <Title headingLevel="h5" size="lg">Monitoring Data is not available</Title>
        <EmptyStateBody>
    Monitoring Data is not available if a cluster goes more then
    three hours without sending metrics.
    Check the cluster&apos;s web console if you think that this cludter shoud
    be sending metrics.
        </EmptyStateBody>
      </EmptyState>
    );

    if (healthStatus === statuses.NO_METRICS) {
      return emptyState;
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

    return (
      <React.Fragment>
        <ClusterHealthCard
          lastCheckIn={lastCheckIn}
          status={healthStatus}
          discoveredIssues={discoveredIssues}
        />
        { (healthStatus === statuses.INSTALLING
        || healthStatus === statuses.UPDATING)
          ? (
            <EmptyState className="cluster-details-user-tab-contents">
              <EmptyStateIcon icon={WarningTriangleIcon} />
              <Title headingLevel="h5" size="lg">Monitoring Data is not available</Title>
              <EmptyStateBody>
          Monitoring Data is not available at this time. Please check back later.
              </EmptyStateBody>
            </EmptyState>
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
  alerts: PropTypes.object,
  nodes: PropTypes.object,
  resourceUsage: PropTypes.object,
  lastCheckIn: PropTypes.string,
  healthStatus: PropTypes.string,
  discoveredIssues: PropTypes.number,
  isPending: PropTypes.bool,
};

Monitoring.defaultProps = {
  cluster: {},
  alerts: {},
  nodes: {},
  getNodes: noop,
  getAlerts: noop,
  lastCheckIn: '',
  discoveredIssues: null,
  isPending: false,
};

export default Monitoring;
