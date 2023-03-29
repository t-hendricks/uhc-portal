import React from 'react';

import { Flex } from '@patternfly/react-core';

import { Cluster, NodePool } from '~/types/clusters_mgmt.v1';
import ClusterStateIcon from '~/components/clusters/common/ClusterStateIcon/ClusterStateIcon';
import clusterStates, { getStateDescription } from '~/components/clusters/common/clusterStates';
import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';

const numberReadyNodePools = (nodePools: NodePool[]) =>
  nodePools?.filter((pool) => {
    const current = pool.status?.current_replicas;

    if (current === undefined) {
      return false;
    }
    if (pool.autoscaling) {
      if (!pool.autoscaling.min_replica || !pool.autoscaling.max_replica) {
        return false;
      }
      return current >= pool.autoscaling.min_replica && current <= pool.autoscaling.max_replica;
    }

    if (pool.replicas === undefined) {
      return false;
    }
    return pool.replicas === current;
  }).length || 0;

type ClusterWithStateDescription = Omit<Cluster, 'state'> & {
  state: { state: string; description: string };
};

interface ClusterStatusProps {
  cluster: ClusterWithStateDescription;
  limitedSupport: boolean;
  machinePools?: NodePool[];
}

export const ClusterStatus = ({ cluster, limitedSupport, machinePools }: ClusterStatusProps) => {
  const isHypershift = isHypershiftCluster(cluster);
  const {
    state: { state: stateName, description: stateDescription },
  } = cluster;

  const machinePoolsState = () => {
    if (stateName === clusterStates.UNINSTALLING) {
      return clusterStates.UNINSTALLING;
    }

    if (machinePools && numberReadyNodePools(machinePools) === 0 && machinePools.length === 0) {
      switch (stateName) {
        case clusterStates.WAITING:
          return clusterStates.WAITING;
        case clusterStates.INSTALLING:
        case clusterStates.VALIDATING:
          return clusterStates.PENDING;
        default:
          return clusterStates.DEPROVISIONED;
      }
    }
    return machinePools && numberReadyNodePools(machinePools) === machinePools.length
      ? clusterStates.READY
      : clusterStates.PENDING;
  };

  const clusterWideStateIcon = (
    <ClusterStateIcon clusterState={stateName} limitedSupport={limitedSupport} animated />
  );

  if (isHypershift) {
    return (
      <>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsXs' }}
          data-testid="control-plane-status"
        >
          <span className="pf-u-mr-sm">Control plane:</span>
          {clusterWideStateIcon}
          <div>{stateDescription}</div>
        </Flex>

        {machinePools ? (
          <Flex
            alignItems={{ default: 'alignItemsCenter' }}
            spaceItems={{ default: 'spaceItemsXs' }}
            data-testid="machine-pools-status"
          >
            <span className="pf-u-mr-sm">Machine pools:</span>
            <ClusterStateIcon
              clusterState={machinePoolsState()}
              limitedSupport={limitedSupport}
              animated
            />
            <div>
              {getStateDescription(machinePoolsState())} {numberReadyNodePools(machinePools)} /{' '}
              {machinePools.length}
            </div>
          </Flex>
        ) : null}
      </>
    );
  }

  return (
    <>
      {clusterWideStateIcon}
      <span className="pf-u-ml-xs">{stateDescription}</span>
    </>
  );
};
