import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Alert } from '@patternfly/react-core';

import { subscriptionPlans } from '../../../../common/subscriptionTypes';


function TransferClusterOwnershipInfo({ subscription = {} }) {
  if (get(subscription, 'plan.id', false) !== subscriptionPlans.OCP || !subscription.released) {
    return null;
  }

  const changePullSecretUrl = 'https://access.redhat.com/solutions/4902871';

  return (
    <Alert
      id="transfer-cluster-ownership-alert"
      variant="info"
      isInline
      title="Cluster ownership transfer initiated"
    >
      The transfer process will complete once the pull secret has been changed in the cluster. See
      {' '}
      <a href={changePullSecretUrl} target="_blank" rel="noreferrer noopener">
        this knowledgebase article
      </a>
      {' '}
      for instructions on how to change the pull secret.
    </Alert>
  );
}

TransferClusterOwnershipInfo.propTypes = {
  subscription: PropTypes.shape({
    released: PropTypes.bool,
  }),
};

export default TransferClusterOwnershipInfo;
