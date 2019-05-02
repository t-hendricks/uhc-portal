import React from 'react';
import PropTypes from 'prop-types';
import result from 'lodash/result';

import ClusterNetwork from './ClusterNetwork';
import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import { getClusterStateAndDescription } from '../../../common/clusterStates';
import { humanizeValueWithUnit } from '../../../../../common/unitParser';

function DetailsRight({ cluster, routerShards }) {
  const memoryTotalWithUnit = humanizeValueWithUnit(
    cluster.metrics.memory.total.value, cluster.metrics.memory.total.unit,
  );

  const clusterState = getClusterStateAndDescription(cluster);

  return (
    <React.Fragment>
      <dl className="cluster-details-item left">
        <dt>
          Status
        </dt>
        <dd style={clusterState.style}>
          <ClusterStateIcon clusterState={clusterState.state} />
          {' '}
          {clusterState.description}
        </dd>
        <dt>
          Total CPU
        </dt>
        <dd>
          {cluster.metrics.cpu.total.value}
          {' '}
          vCPU
        </dd>
        <dt>
          Total Memory
        </dt>
        <dd>
          {memoryTotalWithUnit.value}
          {' '}
          {memoryTotalWithUnit.unit}
        </dd>
        {(cluster.managed || (!cluster.managed && cluster.nodes))
        && (
        <React.Fragment>
          <dt>
          Desired Nodes
          </dt>
          <dd>
            <dl className="cluster-details-item-list left">
              <dt>
              Master:
                {' '}
              </dt>
              <dd>
                {result(cluster, 'nodes.master', 'N/A')}
              </dd>
            </dl>
            <dl className="cluster-details-item-list left">
              <dt>
              Compute:
                {' '}
              </dt>
              <dd>
                {result(cluster, 'nodes.compute', 'N/A')}
              </dd>
            </dl>
          </dd>
        </React.Fragment>)
      }

        <dt>
          Actual Nodes
        </dt>
        <dd>
          <dl className="cluster-details-item-list left">
            <dt>
              Master:
              {' '}
            </dt>
            <dd>
              {result(cluster, 'metrics.nodes.master', 'N/A')}
            </dd>
          </dl>
          <dl className="cluster-details-item-list left">
            <dt>
              Compute:
              {' '}
            </dt>
            <dd>
              {result(cluster, 'metrics.nodes.compute', 'N/A')}
            </dd>
          </dl>
        </dd>
        <ClusterNetwork cluster={cluster} routerShards={routerShards} />
      </dl>
    </React.Fragment>
  );
}

DetailsRight.propTypes = {
  cluster: PropTypes.any,
  routerShards: PropTypes.object.isRequired,
};

export default DetailsRight;
