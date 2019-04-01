import React from 'react';
import PropTypes from 'prop-types';

import ClusterNetwork from './ClusterNetwork';
import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import { humanizeValueWithUnit } from '../../../../../common/unitParser';

function DetailsRight({ cluster, routerShards }) {
  const memoryTotalWithUnit = humanizeValueWithUnit(
    cluster.memory.total.value, cluster.memory.total.unit,
  );
  const storageTotalWithUnit = humanizeValueWithUnit(
    cluster.storage.total.value, cluster.storage.total.unit,
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
          Total Storage
        </dt>
        <dd>
          {storageTotalWithUnit.value}
          {' '}
          {storageTotalWithUnit.unit}
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
              {cluster.nodes.master}
            </dd>
          </dl>
          { cluster.managed ? (
            <dl className="cluster-details-item-list left">
              <dt>
                Infrastructure:
                {' '}
              </dt>
              <dd>
                {cluster.nodes.infra}
              </dd>
            </dl>
          ) : null }
          <dl className="cluster-details-item-list left">
            <dt>
              Compute:
              {' '}
            </dt>
            <dd>
              {cluster.nodes.compute}
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
