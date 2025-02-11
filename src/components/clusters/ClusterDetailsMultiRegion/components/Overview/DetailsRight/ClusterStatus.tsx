import React, { useEffect, useState } from 'react';

import { Flex } from '@patternfly/react-core';

import ClusterStateIcon from '~/components/clusters/common/ClusterStateIcon';
import clusterStates, {
  ClusterStateAndDescription,
  getClusterStateAndDescription,
  getStateDescription,
  isHypershiftCluster,
} from '~/components/clusters/common/clusterStates';
import { MachinePool, NodePool, NodePoolAutoscaling } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

type NormalizedNodePoolAutoscaling = Omit<NodePoolAutoscaling, 'max_replica' | 'min_replica'> & {
  max_replicas?: number;
  min_replicas?: number;
};

type NormalizedNodePool = Omit<NodePool, 'autoscaling'> & {
  autoscaling?: NormalizedNodePoolAutoscaling;
};

// Despite being designed to handle HCP node pools, numberReadyNodePools function cannot accept type NodePool since we normalize the data to match the structure of NodePoolAutoscaling type to MachinePoolAutoscaling type.
// See normalizeNodePool function in machinePoolsHelper.ts
export const numberReadyNodePools = (nodePools: NormalizedNodePool[]) =>
  nodePools?.filter((pool) => {
    const current = pool.status?.current_replicas;

    if (current === undefined) {
      return false;
    }
    if (pool.autoscaling) {
      if (!pool.autoscaling.min_replicas || !pool.autoscaling.max_replicas) {
        return false;
      }
      return current >= pool.autoscaling.min_replicas && current <= pool.autoscaling.max_replicas;
    }

    if (pool.replicas === undefined) {
      return false;
    }
    return pool.replicas === current;
  }).length || 0;

interface ClusterStatusProps {
  cluster: ClusterFromSubscription;
  limitedSupport: boolean;
  machinePools?: MachinePool[] | NormalizedNodePool[];
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
          <span className="pf-v5-u-mr-sm">Control plane:</span>
          {clusterWideStateIcon}
          <div>{clusterState?.description}</div>
        </Flex>

        {machinePools ? (
          <Flex
            alignItems={{ default: 'alignItemsCenter' }}
            spaceItems={{ default: 'spaceItemsXs' }}
            data-testid="machine-pools-status"
          >
            <span className="pf-v5-u-mr-sm">Machine pools:</span>
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
      <span className="pf-v5-u-ml-xs">{clusterState?.description}</span>
    </>
  );
};
