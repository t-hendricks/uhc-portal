import React from 'react';

import { Flex } from '@patternfly/react-core';

import { Cluster } from '~/types/clusters_mgmt.v1';
import ClusterStateIcon from '~/components/clusters/common/ClusterStateIcon/ClusterStateIcon';
import clusterStates, { getStateDescription } from '~/components/clusters/common/clusterStates';
import { isHypershiftCluster } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';

type ClusterWithStateDescription = Omit<Cluster, 'state'> & {
  state: { state: string; description: string };
};

interface ClusterStatusProps {
  cluster: ClusterWithStateDescription;
  limitedSupport: boolean;
}

export const ClusterStatus = ({ cluster, limitedSupport }: ClusterStatusProps) => {
  const isHypershift = isHypershiftCluster(cluster);
  const {
    nodes,
    status,
    state: { state: stateName, description: stateDescription },
  } = cluster;
  const nodesCompute = nodes?.compute ?? 0;
  const currentCompute = status?.current_compute ?? 0;

  const machinePoolsState = React.useMemo(() => {
    if (nodesCompute > currentCompute) {
      return clusterStates.INSTALLING;
    }

    if (nodesCompute < currentCompute) {
      return clusterStates.UNINSTALLING;
    }

    return clusterStates.READY;
  }, [nodesCompute, currentCompute]);

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

        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsXs' }}
          data-testid="machine-pools-status"
        >
          <span className="pf-u-mr-sm">Machine pools:</span>
          <ClusterStateIcon
            clusterState={machinePoolsState}
            limitedSupport={limitedSupport}
            animated
          />
          <div>{getStateDescription(machinePoolsState)}</div>
        </Flex>
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
