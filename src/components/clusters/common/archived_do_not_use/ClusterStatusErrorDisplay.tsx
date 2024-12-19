import React from 'react';

import MarkdownParser from '~/common/MarkdownParser';
import { ClusterStatus } from '~/types/clusters_mgmt.v1';

type Props = {
  clusterStatus: Pick<
    ClusterStatus,
    'provision_error_code' | 'provision_error_message' | 'description'
  >;
  showErrorCode?: boolean;
  showDescription?: boolean;
};

const ClusterStatusErrorDisplay = ({ clusterStatus, showErrorCode, showDescription }: Props) => {
  const {
    description,
    provision_error_code: errorCode,
    provision_error_message: errorMessage,
  } = clusterStatus;

  const contents = [showErrorCode && errorCode, errorMessage, showDescription && description]
    .filter(Boolean)
    .join(' ');

  return <MarkdownParser>{contents}</MarkdownParser>;
};

export default ClusterStatusErrorDisplay;
