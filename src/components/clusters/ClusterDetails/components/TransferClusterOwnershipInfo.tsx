import { Alert } from '@patternfly/react-core';
import get from 'lodash/get';
import React from 'react';
import { Link } from 'react-router-dom';
import { Subscription } from '~/types/accounts_mgmt.v1';

import { normalizedProducts, subscriptionStatuses } from '../../../../common/subscriptionTypes';
import ExternalLink from '../../../common/ExternalLink';

type TransferClusterOwnershipInfoProps = {
  subscription?: Subscription;
};

const TransferClusterOwnershipInfo = ({ subscription }: TransferClusterOwnershipInfoProps) => {
  const isAllowedProducts = [normalizedProducts.OCP, normalizedProducts.ARO].includes(
    get(subscription, 'plan.type', false),
  );
  if (!isAllowedProducts || !subscription?.released) {
    return null;
  }

  const alertText =
    subscription.status === subscriptionStatuses.DISCONNECTED ? (
      <>
        The transfer process will complete after{' '}
        <Link to="/register" data-testid="link">
          registering
        </Link>{' '}
        the cluster again using the same id.
      </>
    ) : (
      <>
        The transfer process will complete once the pull secret has been changed in the cluster. See{' '}
        <ExternalLink
          href="https://access.redhat.com/solutions/4902871"
          data-testid="external-link"
        >
          this knowledgebase article
        </ExternalLink>{' '}
        for instructions on how to change the pull secret.
      </>
    );

  return (
    <Alert
      id="transfer-cluster-ownership-alert"
      className="pf-v5-u-mt-md"
      variant="info"
      isInline
      title="Cluster ownership transfer initiated"
    >
      {alertText}
    </Alert>
  );
};

export default TransferClusterOwnershipInfo;
