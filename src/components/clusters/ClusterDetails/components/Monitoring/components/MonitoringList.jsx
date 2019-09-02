import React from 'react';
import PropTypes from 'prop-types';
import {
  DataList,
} from '@patternfly/react-core';

import MonitoringListItem from './MonitoringListItem';
import AlertsTable from './AlertsTable';
import NodesTable from './NodesTable';
// import ClusterOperators from './ClusterOperators';
import ResourceUsage from '../../Overview/ResourceUsage/ResourceUsage';

import { getClusterStateAndDescription } from '../../../../common/clusterStates';

class MonitoringList extends React.Component {
    state = {
      expanded: [],
    }

  toggle = (sectionId) => {
    const { expanded } = this.state;
    const index = expanded.indexOf(sectionId);
    const newExpanded = index >= 0
      ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)]
      : [...expanded, sectionId];
    this.setState(() => ({ expanded: newExpanded }));
  };

  render() {
    const {
      cluster, alerts, nodes, resourceUsage,
    } = this.props;
    const { expanded } = this.state;

    const clusterState = getClusterStateAndDescription(cluster);

    return (
      <DataList aria-label="monitoring-table">
        <MonitoringListItem title="Alerts firing" numOfIssues={alerts.numOfIssues} toggle={this.toggle} expanded={expanded}>
          <AlertsTable alerts={alerts.data} />
        </MonitoringListItem>
        <MonitoringListItem title="Nodes" numOfIssues={nodes.numOfIssues} toggle={this.toggle} expanded={expanded}>
          <NodesTable nodes={nodes.data} />
        </MonitoringListItem>
        {/* <MonitoringListItem title="Cluster operators" toggle={this.toggle} expanded={expanded}>
          <ClusterOperators />
        </MonitoringListItem> */}
        <MonitoringListItem title="Resource usage" numOfIssues={resourceUsage.numOfIssues} toggle={this.toggle} expanded={expanded}>
          <div className="metrics-chart">
            <ResourceUsage cluster={{ ...cluster, state: clusterState }} />
          </div>
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
};

MonitoringList.defaultProps = {
  cluster: {},
  alerts: {},
  nodes: {},
  resourceUsage: {},
};

export default MonitoringList;
