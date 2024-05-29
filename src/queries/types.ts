import React from 'react';

import { Subscription } from '~/types/accounts_mgmt.v1';
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
