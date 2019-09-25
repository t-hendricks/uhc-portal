import React from 'react';
import PropTypes from 'prop-types';
import result from 'lodash/result';

import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import { humanizeValueWithUnit } from '../../../../../common/units';

import ClusterNetwork from './ClusterNetwork';

function DetailsRight({ cluster }) {
  const memoryTotalWithUnit = humanizeValueWithUnit(
    cluster.metrics.memory.total.value, cluster.metrics.memory.total.unit,
  );

  const showDesiredNodes = cluster.managed;
  const showSockets = cluster.metrics.sockets.total.value > 0;
  const showVCPU = !showSockets;
  const isArchived = cluster.subscription && cluster.subscription.status === 'Archived';

  return (
    <React.Fragment>
      <dl className="cluster-details-item left">
        <dt>
          Status
        </dt>
        { isArchived ? (
          <dd>
            Archived
          </dd>
        ) : (
          <dd style={cluster.state.style}>
            <ClusterStateIcon clusterState={cluster.state.state} />
            {' '}
            {cluster.state.description}
          </dd>
        )}
        {showVCPU && (
          <React.Fragment>
            <dt>
              Total vCPU
            </dt>
            <dd>
              {cluster.metrics.cpu.total.value}
              {' '}
              vCPU
            </dd>
          </React.Fragment>)
        }
        <dt>
          Total Memory
        </dt>
        <dd>
          {memoryTotalWithUnit.value}
          {' '}
          {memoryTotalWithUnit.unit}
        </dd>
        {showSockets && (
          <React.Fragment>
            <dt>
              Total Sockets
            </dt>
            <dd>
              {cluster.metrics.sockets.total.value}
            </dd>
          </React.Fragment>)
        }

        {showDesiredNodes && (
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
          {showDesiredNodes ? 'Actual Nodes' : 'Nodes'}
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
        { !cluster.managed && (
          <React.Fragment>
            <dt>
              Support Level
            </dt>
            <dd>
              {result(cluster, 'subscription.support_level', 'None (Evaluation)')}
            </dd>
          </React.Fragment>
        )}
        <ClusterNetwork cluster={cluster} />
      </dl>
    </React.Fragment>
  );
}

DetailsRight.propTypes = {
  cluster: PropTypes.any,
};

export default DetailsRight;
