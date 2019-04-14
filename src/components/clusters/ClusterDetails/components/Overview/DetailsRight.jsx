import React from 'react';
import PropTypes from 'prop-types';
import result from 'lodash/result';

import ClusterNetwork from './ClusterNetwork';
import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import { humanizeValueWithUnit } from '../../../../../common/unitParser';

function DetailsRight({ cluster, routerShards }) {
  const memoryTotalWithUnit = humanizeValueWithUnit(
    cluster.memory.total.value, cluster.memory.total.unit,
  );

  return (
    <React.Fragment>
      <dl className="cluster-details-item left">
        <dt>
          Status
        </dt>
        <dd style={{ textTransform: 'capitalize' }}>
          <ClusterStateIcon clusterState={cluster.state} />
          {' '}
          {cluster.state}
        </dd>
        <dt>
          Total CPU
        </dt>
        <dd>
          {cluster.cpu.total.value}
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
        <dt>
          Nodes
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
