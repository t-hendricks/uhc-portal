import React from 'react';
import { Dictionary } from 'lodash';

import { ClusterAutoScalingForm } from '~/components/clusters/common/clusterAutoScalingValues';
import { Subscription } from '~/types/accounts_mgmt.v1';
import { MachineType } from '~/types/clusters_mgmt.v1';
import { ErrorDetail } from '~/types/types';

export type SubscriptionResponseType = {
  subscription: Subscription;
  isAROCluster: boolean;
  isROSACluster: boolean;
  isOSDCluster: boolean;
};

export type RQApiErrorType = {
  pending?: boolean;
  fulfilled?: false;
  error?: true;
  errorCode?: number;
  internalErrorCode?: string;
  operationID?: string;
  errorMessage?: string | React.ReactElement;
  errorDetails?: ErrorDetail[];
};

export type MachineTypesResponse = {
  types?: {
    [id: string]: MachineType[];
  };
  typesByID?: Dictionary<MachineType>;
};

export type ClusterAutoscalerResponseType = {
  hasAutoscaler: boolean;
  data: ClusterAutoScalingForm;
};
