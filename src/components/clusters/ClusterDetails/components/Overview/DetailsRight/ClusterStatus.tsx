import React, { useEffect, useState } from 'react';

import { Flex } from '@patternfly/react-core';

import ClusterStateIcon from '~/components/clusters/common/ClusterStateIcon/ClusterStateIcon';
import clusterStates, {
  ClusterStateAndDescription,
  getClusterStateAndDescription,
  getStateDescription,
  isHypershiftCluster,
} from '~/components/clusters/common/clusterStates';
import { NodePool } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

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

interface ClusterStatusProps {
  cluster: ClusterFromSubscription;
  limitedSupport: boolean;
  machinePools?: NodePool[];
}

export const ClusterStatus = ({ cluster, limitedSupport, machinePools }: ClusterStatusProps) => {
  const [isHypershift, setIsHypershift] = useState<boolean>();
  const [clusterState, setClusterState] = useState<ClusterStateAndDescription | undefined>();

  useEffect(() => {
    setIsHypershift(isHypershiftCluster(cluster));
    setClusterState(getClusterStateAndDescription(cluster));
  }, [cluster]);

  const machinePoolsState = () => {
    if (clusterState?.state === clusterStates.UNINSTALLING) {
      return clusterStates.UNINSTALLING;
    }

    if (machinePools && numberReadyNodePools(machinePools) === 0 && machinePools.length === 0) {
      switch (clusterState?.state) {
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
    <ClusterStateIcon clusterState={clusterState?.state} limitedSupport={limitedSupport} animated />
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
          <div>{clusterState?.description}</div>
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
      <span className="pf-u-ml-xs">{clusterState?.description}</span>
    </>
  );
};
