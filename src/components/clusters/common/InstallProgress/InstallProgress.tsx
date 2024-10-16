import React from 'react';

import { AvailableRegionalInstance } from '~/queries/types';
import { ClusterFromSubscription } from '~/types/types';

import clusterStates from '../clusterStates';

import ProgressList from './ProgressList';

interface InstallProgressProps {
  cluster: ClusterFromSubscription;
  hasInflightErrors: boolean;
  hasNetworkOndemand: boolean;
  regionalInstance?: AvailableRegionalInstance;
}

const InstallProgress = ({
  cluster,
  hasNetworkOndemand,
  hasInflightErrors,
  regionalInstance,
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
      regionalInstance={regionalInstance}
    />
  ) : null;

export default InstallProgress;
