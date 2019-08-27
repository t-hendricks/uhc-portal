import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
  Title,
} from '@patternfly/react-core';
// eslint-disable-next-line camelcase

import ClusterHealthCard from './components/ClusterHealthCard';
import MonitoringList from './components/MonitoringList';

import { noop } from '../../../../../common/helpers';

// eslint-disable-next-line react/prefer-stateless-function
class Monitoring extends React.Component {
  componentDidMount() {
    const { getNodes, getAlerts, cluster } = this.props;
    getNodes(cluster.id);
    getAlerts(cluster.id);
  }

  render() {
    const {
      cluster, alerts, nodes, lastCheckIn, resourceUsage, healthStatus,
    } = this.props;
    return (
      <React.Fragment>
        <ClusterHealthCard lastCheckIn={lastCheckIn} status={healthStatus} />
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
};

Monitoring.defaultProps = {
  cluster: {},
  alerts: {},
  nodes: {},
  getNodes: noop,
  getAlerts: noop,
  lastCheckIn: '',
};

export default Monitoring;
