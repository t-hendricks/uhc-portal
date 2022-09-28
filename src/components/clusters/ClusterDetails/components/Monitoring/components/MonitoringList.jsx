import React from 'react';
import PropTypes from 'prop-types';
import { DataList } from '@patternfly/react-core';

import get from 'lodash/get';

import MonitoringListItem from './MonitoringListItem';
import AlertsTable from './AlertsTable';
import NodesTable from './NodesTable';
import ClusterOperators from './ClusterOperators';
import ResourceUsage from '../../../../common/ResourceUsage/ResourceUsage';
import MonitoringEmptyState from './MonitoringEmptyState';
import { metricsStatusMessages } from '../../../../common/ResourceUsage/ResourceUsage.consts';
import { hasResourceUsageMetrics } from '../monitoringHelper';
import { subscriptionStatuses } from '../../../../../../common/subscriptionTypes';

class MonitoringList extends React.Component {
  state = {
    expanded: [],
  };

  toggle = (sectionId) => {
    const { expanded } = this.state;
    const index = expanded.indexOf(sectionId);
    const newExpanded =
      index >= 0
        ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)]
        : [...expanded, sectionId];
    this.setState(() => ({ expanded: newExpanded }));
  };

  render() {
    const { cluster, alerts, nodes, operators, resourceUsage } = this.props;
    const { expanded } = this.state;

    const metricsAvailable = hasResourceUsageMetrics(cluster);
    const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
    const metricsStatusMessage = isArchived
      ? metricsStatusMessages.archived
      : metricsStatusMessages[cluster.state] || metricsStatusMessages.default;

    const EmptyState = (
      <MonitoringEmptyState hideLastCheckIn hideIcon title="No data available for this metric">
        <p>Please check back later</p>
      </MonitoringEmptyState>
    );

    return (
      <DataList aria-label="monitoring-table">
        <MonitoringListItem
          title="Alerts firing"
          numOfIssues={alerts.numOfIssues}
          numOfWarnings={alerts.numOfWarnings}
          toggle={this.toggle}
          expanded={expanded}
          hasData={alerts.hasData}
        >
          {alerts.hasData ? (
            <AlertsTable alerts={alerts.data} clusterConsole={cluster.console} />
          ) : (
            EmptyState
          )}
        </MonitoringListItem>
        {nodes.hasData && (
          // hide nodes if not available, this metric is missing in OpenShift >= 4.3.8
          <MonitoringListItem
            title="Nodes"
            numOfIssues={nodes.numOfIssues}
            toggle={this.toggle}
            expanded={expanded}
            hasData={nodes.hasData}
          >
            <NodesTable nodes={nodes.data} clusterConsole={cluster.console} />
          </MonitoringListItem>
        )}
        <MonitoringListItem
          title="Cluster operators"
          numOfIssues={operators.numOfIssues}
          numOfWarnings={operators.numOfWarnings}
          toggle={this.toggle}
          expanded={expanded}
          hasData={operators.hasData}
        >
          {operators.hasData ? (
            <ClusterOperators operators={operators.data} clusterConsole={cluster.console} />
          ) : (
            EmptyState
          )}
        </MonitoringListItem>
        <MonitoringListItem
          title="Resource usage"
          numOfIssues={resourceUsage.numOfIssues}
          numOfWarnings={resourceUsage.numOfWarnings}
          toggle={this.toggle}
          expanded={expanded}
          hasData={resourceUsage.hasData}
        >
          {resourceUsage.hasData ? (
            <div className="metrics-chart">
              <ResourceUsage
                cpu={{
                  used: cluster.metrics.cpu.used,
                  total: cluster.metrics.cpu.total,
                }}
                memory={{
                  used: cluster.metrics.memory.used,
                  total: cluster.metrics.memory.total,
                }}
                metricsAvailable={metricsAvailable}
                metricsStatusMessage={metricsStatusMessage}
                type="threshold"
              />
            </div>
          ) : (
            EmptyState
          )}
        </MonitoringListItem>
      </DataList>
    );
  }
}

MonitoringList.propTypes = {
  cluster: PropTypes.object,
  alerts: PropTypes.object,
  nodes: PropTypes.object,
  resourceUsage: PropTypes.object,
  operators: PropTypes.object,
};

MonitoringList.defaultProps = {
  cluster: {},
  alerts: {},
  nodes: {},
  resourceUsage: {},
  operators: {},
};

export default MonitoringList;
