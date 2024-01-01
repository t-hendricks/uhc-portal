import React from 'react';

import { ClusterFromSubscription } from '~/types/types';
import clusterStates from '../clusterStates';
import ProgressList from './ProgressList';

interface InstallProgressProps {
  cluster: ClusterFromSubscription;
  hasInflightErrors: boolean;
  hasNetworkOndemand: boolean;
}

const InstallProgress = ({
  cluster,
  hasNetworkOndemand,
  hasInflightErrors,
}: InstallProgressProps) =>
  hasInflightErrors ||
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

export default InstallProgress;
