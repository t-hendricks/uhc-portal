import React from 'react';

import { AvailableRegionalInstance } from '~/queries/types';
import { ClusterFromSubscription } from '~/types/types';

import clusterStates from '../clusterStates';

import ProgressList from './ProgressList';

interface InstallProgressProps {
  cluster: ClusterFromSubscription;
  hasInflightErrors: boolean;
  regionalInstance?: AvailableRegionalInstance;
}

const InstallProgress = ({ cluster, hasInflightErrors, regionalInstance }: InstallProgressProps) =>
  hasInflightErrors ||
  cluster.state === clusterStates.INSTALLING ||
  cluster.state === clusterStates.PENDING ||
  cluster.state === clusterStates.VALIDATING ||
  cluster.state === clusterStates.WAITING ||
  cluster.state === clusterStates.ERROR ? (
    <ProgressList cluster={cluster} actionRequiredInitialOpen regionalInstance={regionalInstance} />
  ) : null;

export default InstallProgress;
