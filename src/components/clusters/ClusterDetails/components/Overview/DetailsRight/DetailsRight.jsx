import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';

import ClusterStateIcon from '../../../../common/ClusterStateIcon/ClusterStateIcon';
import { humanizeValueWithUnit, humanizeValueWithUnitGiB } from '../../../../../../common/units';
import { subscriptionStatuses } from '../../../../../../common/subscriptionTypes';
import ClusterNetwork from '../ClusterNetwork';

function DetailsRight({ cluster, totalDesiredComputeNodes }) {
  const memoryTotalWithUnit = humanizeValueWithUnit(
    cluster.metrics.memory.total.value, cluster.metrics.memory.total.unit,
  );

  const showDesiredNodes = cluster.managed;
  const showInfraNodes = (!cluster.managed && get(cluster, 'metrics.nodes.infra', null))
                         || get(cluster, 'nodes.infra', 0) > 0;
  const hasSockets = get(cluster, 'metrics.sockets.total.value', 0) > 0;

  const humanizedPersistentStorage = cluster.managed
             && humanizeValueWithUnitGiB(cluster.storage_quota.value);
  const showVCPU = !hasSockets;
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;

  const masterActualNodes = get(cluster, 'metrics.nodes.master', '-');
  const masterDesiredNodes = get(cluster, 'nodes.master', '-');

  const infraActualNodes = get(cluster, 'metrics.nodes.infra', '-');
  const infraDesiredNodes = get(cluster, 'nodes.infra', '-');

  const computeActualNodes = get(cluster, 'metrics.nodes.compute', '-');
  const computeDesiredNodes = totalDesiredComputeNodes || '-';

  return (
    <>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>
            Status
          </DescriptionListTerm>
          { isArchived ? (
            <DescriptionListDescription>
              Archived
            </DescriptionListDescription>
          ) : (
            <DescriptionListDescription style={cluster.state.style}>
              <ClusterStateIcon clusterState={cluster.state.state} animated />
              {' '}
              {cluster.state.description}
            </DescriptionListDescription>
          )}
        </DescriptionListGroup>

        {showVCPU && (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>
                Total vCPU
              </DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.metrics.cpu.total.value}
                {' '}
                vCPU
              </DescriptionListDescription>
            </DescriptionListGroup>
          </>
        )}
        <DescriptionListGroup>
          <DescriptionListTerm>
            Total memory
          </DescriptionListTerm>
          <DescriptionListDescription>
            {get(cluster, 'subscription.status') === subscriptionStatuses.DISCONNECTED ? (
              'N/A'
            )
              : (
                <>
                  {memoryTotalWithUnit.value}
                  {' '}
                  {memoryTotalWithUnit.unit}
                </>
              )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        { cluster.managed && !cluster.byoc && (
          <>

            <DescriptionListGroup>
              <DescriptionListTerm>
                Load balancers
              </DescriptionListTerm>
              <DescriptionListDescription>
                {cluster.load_balancer_quota}
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>
                Persistent storage
              </DescriptionListTerm>
              <DescriptionListDescription>
                {humanizedPersistentStorage.value}
                {' '}
                {humanizedPersistentStorage.unit}
              </DescriptionListDescription>
            </DescriptionListGroup>

          </>
        )}
        {showDesiredNodes ? (
          <>
            <DescriptionListGroup>
              <DescriptionListTerm>
                Nodes
                <span className="font-weight-normal"> (actual/desired)</span>
              </DescriptionListTerm>
              <DescriptionList isHorizontal className="ocm-c-description-list-secondary">
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Master:
                    {' '}
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    { masterActualNodes !== '-' || masterDesiredNodes !== '-'
                      ? `${masterActualNodes}/${masterDesiredNodes}`
                      : 'N/A'}
                  </DescriptionListDescription>
                  {showInfraNodes && (
                    <>
                      <DescriptionListTerm>
                        Infra:
                        {' '}
                      </DescriptionListTerm>

                      <DescriptionListDescription>
                        { infraActualNodes !== '-' || infraDesiredNodes !== '-'
                          ? `${infraActualNodes}/${infraDesiredNodes}`
                          : 'N/A'}
                      </DescriptionListDescription>
                    </>
                  )}
                  <DescriptionListTerm>
                    Compute:
                    {' '}
                  </DescriptionListTerm>

                  <DescriptionListDescription>
                    { computeActualNodes !== '-' || computeDesiredNodes !== '-'
                      ? `${computeActualNodes}/${computeDesiredNodes}`
                      : 'N/A'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </DescriptionListGroup>
          </>
        )
          : (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  Nodes
                </DescriptionListTerm>
                <DescriptionList isHorizontal className="ocm-c-description-list-secondary">
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      Master:
                      {' '}
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {get(cluster, 'metrics.nodes.master', 'N/A')}
                    </DescriptionListDescription>
                    {showInfraNodes && (
                      <>
                        <DescriptionListTerm>
                          Infra:
                          {' '}
                        </DescriptionListTerm>

                        <DescriptionListDescription>
                          {get(cluster, 'metrics.nodes.infra', 'N/A')}
                        </DescriptionListDescription>
                      </>
                    )}
                    <DescriptionListTerm>
                      Compute:
                      {' '}
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      {get(cluster, 'metrics.nodes.compute', 'N/A')}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </DescriptionListGroup>
            </>
          )}
        <ClusterNetwork cluster={cluster} />
      </DescriptionList>
    </>
  );
}

DetailsRight.propTypes = {
  cluster: PropTypes.any,
  totalDesiredComputeNodes: PropTypes.number,
};

export default DetailsRight;
