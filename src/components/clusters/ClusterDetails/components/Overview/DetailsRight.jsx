import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  getSubscriptionManagementURL,
  getClusterEvaluationExpiresDate,
} from '../../clusterDetailsHelper';

import ClusterStateIcon from '../../../common/ClusterStateIcon/ClusterStateIcon';
import { humanizeValueWithUnit, humanizeValueWithUnitGiB } from '../../../../../common/units';
import { subscriptionStatuses } from '../../../../../common/subscriptionTypes';
import ClusterNetwork from './ClusterNetwork';

function DetailsRight({ cluster }) {
  const memoryTotalWithUnit = humanizeValueWithUnit(
    cluster.metrics.memory.total.value, cluster.metrics.memory.total.unit,
  );

  const showDesiredNodes = cluster.managed;
  const showInfraNodes = (!cluster.managed && get(cluster, 'metrics.nodes.infra', null))
                         || get(cluster, 'nodes.infra', 0) > 0;
  const showSockets = cluster.metrics.sockets.total.value > 0;

  const humanizedPersistentStorage = cluster.managed
             && humanizeValueWithUnitGiB(cluster.storage_quota.value);

  const showVCPU = !showSockets;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const evaluationExpiresDate = getClusterEvaluationExpiresDate(cluster);
  const manageSubscriptionURL = getSubscriptionManagementURL(get(cluster, 'subscription'));
  return (
    <>
      <dl className="cluster-details-item">
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
          <>
            <dt>
              Total vCPU
            </dt>
            <dd>
              {cluster.metrics.cpu.total.value}
              {' '}
              vCPU
            </dd>
          </>
        )}
        <dt>
          Total Memory
        </dt>
        <dd>
          {memoryTotalWithUnit.value}
          {' '}
          {memoryTotalWithUnit.unit}
        </dd>
        { cluster.managed && (
          <>
            <dt>
            Load Balancers
            </dt>
            <dd>
              {cluster.load_balancer_quota}
            </dd>
            <dt>
            Persistent Storage
            </dt>
            <dd>
              {humanizedPersistentStorage.value}
              {' '}
              {humanizedPersistentStorage.unit}
            </dd>
          </>
        )}
        {showSockets && (
          <>
            <dt>
              Total Sockets
            </dt>
            <dd>
              {cluster.metrics.sockets.total.value}
            </dd>
          </>
        )}

        {showDesiredNodes && (
          <>
            <dt>
              Desired Nodes
            </dt>
            <dd>
              <dl className="cluster-details-item-list">
                <dt>
                  Master:
                  {' '}
                </dt>
                <dd>
                  {get(cluster, 'nodes.master', 'N/A')}
                </dd>
              </dl>
              {showInfraNodes && (
                <dl className="cluster-details-item-list">
                  <dt>
                    Infra:
                    {' '}
                  </dt>
                  <dd>
                    {get(cluster, 'nodes.infra', 'N/A')}
                  </dd>
                </dl>
              )}
              <dl className="cluster-details-item-list">
                <dt>
                  Compute:
                  {' '}
                </dt>
                <dd>
                  {get(cluster, 'nodes.compute', 'N/A')}
                </dd>
              </dl>
            </dd>
          </>
        )}

        <dt>
          {showDesiredNodes ? 'Actual Nodes' : 'Nodes'}
        </dt>
        <dd>
          <dl className="cluster-details-item-list">
            <dt>
              Master:
              {' '}
            </dt>
            <dd>
              {get(cluster, 'metrics.nodes.master', 'N/A')}
            </dd>
          </dl>
          {showInfraNodes && (
            <dl className="cluster-details-item-list">
              <dt>
                Infra:
                {' '}
              </dt>
              <dd>
                {get(cluster, 'metrics.nodes.infra', 'N/A')}
              </dd>
            </dl>
          )}
          <dl className="cluster-details-item-list">
            <dt>
              Compute:
              {' '}
            </dt>
            <dd>
              {get(cluster, 'metrics.nodes.compute', 'N/A')}
            </dd>
          </dl>
        </dd>
        { !cluster.managed && (
          <>
            <dt>
              Support Level
            </dt>
            <dd>
              {get(cluster, 'subscription.support_level', 'None (Evaluation)')}
            </dd>
          </>
        )}
        { evaluationExpiresDate && (
          <>
            <dt>
              Subscription Status
            </dt>
            <dd>
              {`Evaluation expires ${evaluationExpiresDate}`}
              <br />
              <a href={manageSubscriptionURL} target="_blank" rel="noreferrer noopener">Manage Subscription</a>
            </dd>
          </>
        )}
        <ClusterNetwork cluster={cluster} />
      </dl>
    </>
  );
}

DetailsRight.propTypes = {
  cluster: PropTypes.any,
};

export default DetailsRight;
