import React from 'react';
import { InflightCheckState } from '~/types/clusters_mgmt.v1';

import { ClusterFromSubscription } from '~/types/types';
import clusterStates, { getInflightChecks } from '../clusterStates';
import ProgressList from './ProgressList';

interface InstallProgressProps {
  cluster: ClusterFromSubscription;
  hasNetworkOndemand: boolean;
}

const InstallProgress = ({ cluster, hasNetworkOndemand }: InstallProgressProps) => {
  const isAnyCheckNotPassedState = getInflightChecks(cluster).some(
    (check) => check.state !== InflightCheckState.PASSED,
  );

  return isAnyCheckNotPassedState ||
    cluster.state === clusterStates.INSTALLING ||
    cluster.state === clusterStates.PENDING ||
    cluster.state === clusterStates.VALIDATING ||
    cluster.state === clusterStates.WAITING ? (
    <ProgressList
      cluster={cluster}
      hasNetworkOndemand={hasNetworkOndemand}
      actionRequiredInitialOpen
    />
  ) : null;
};

export default InstallProgress;
