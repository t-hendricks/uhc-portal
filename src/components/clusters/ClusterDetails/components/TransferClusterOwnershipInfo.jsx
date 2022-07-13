import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Alert } from '@patternfly/react-core';

import { normalizedProducts, subscriptionStatuses } from '../../../../common/subscriptionTypes';
import ExternalLink from '../../../common/ExternalLink';

function TransferClusterOwnershipInfo({ subscription = {} }) {
  const isAllowedProducts = [normalizedProducts.OCP, normalizedProducts.ARO].includes(get(subscription, 'plan.type', false));
  if (!isAllowedProducts || !subscription.released) {
    return null;
  }

  const changePullSecretUrl = 'https://access.redhat.com/solutions/4902871';
  const alertText = subscription.status === subscriptionStatuses.DISCONNECTED ? (
    <>
      The transfer process will complete after
      {' '}
      <Link to="/register">
        registering
      </Link>
      {' '}
      the cluster again using the same id.
    </>
  ) : (
    <>
      The transfer process will complete once the pull secret has been changed in the cluster. See
      {' '}
      <ExternalLink href={changePullSecretUrl}>
        this knowledgebase article
      </ExternalLink>
      {' '}
      for instructions on how to change the pull secret.
    </>
  );

  return (
    <Alert
      id="transfer-cluster-ownership-alert"
      className="pf-u-mt-md"
      variant="info"
      isInline
      title="Cluster ownership transfer initiated"
    >
      {alertText}
    </Alert>
  );
}

TransferClusterOwnershipInfo.propTypes = {
  subscription: PropTypes.shape({
    released: PropTypes.bool,
  }),
};

export default TransferClusterOwnershipInfo;
