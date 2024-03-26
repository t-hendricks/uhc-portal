import React from 'react';
import dayjs from 'dayjs';
import { Alert, AlertProps, Button } from '@patternfly/react-core';
import { Cluster } from '~/types/clusters_mgmt.v1';
import modals from '../../../common/Modal/modals';
import ExternalLink from '../../../common/ExternalLink';

type ExpirationAlertProps = {
  expirationTimestamp: string;
  trialExpiration?: boolean;
  openModal?: (name: string, data?: unknown) => void;
  cluster?: Cluster;
  OSDRHMExpiration?: boolean;
};

const ExpirationAlert = ({
  expirationTimestamp,
  trialExpiration,
  openModal,
  cluster,
  OSDRHMExpiration,
}: ExpirationAlertProps) => {
  const now = dayjs.utc();
  const expirationTime = dayjs.utc(expirationTimestamp);
  const hours = expirationTime.diff(now, 'hour');
  const timeUntilExpiryString = now.to(expirationTime);
  const expirationTimeString = expirationTime.local().format('dddd, MMMM Do YYYY, h:mm a');

  if (hours <= 0) {
    return (
      <Alert
        id="expiration-alert"
        className="pf-v5-u-mt-md"
        variant="warning"
        isInline
        title="Cluster failed to delete"
        data-testid="expiration-alert-passed"
        role="alert"
      >
        <>
          {`This cluster should have been deleted ${timeUntilExpiryString} but is still running.`}{' '}
          <ExternalLink href="https://access.redhat.com/support/">
            Contact our customer support
          </ExternalLink>
          .
        </>
      </Alert>
    );
  }

  let variant: AlertProps['variant'];
  switch (true) {
    case hours < 24:
      variant = 'danger';
      break;
    case hours < 48 && hours >= 24:
      variant = 'warning';
      break;
    default:
      variant = 'info';
  }

  let contents: string | React.ReactElement =
    `This cluster is scheduled for deletion on ${expirationTimeString}`;
  if (OSDRHMExpiration) {
    contents = (
      <>
        Your cluster subscription was purchased from Red Hat Marketplace and will expire on
        {` ${expirationTimeString}. `}
        Once expired, the cluster will be deleted permanently. To avoid deletion, please purchase a
        new subscription from the{' '}
        <ExternalLink href="https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated">
          Red Hat Marketplace
        </ExternalLink>{' '}
        before the expiration date.
      </>
    );
  } else if (trialExpiration) {
    contents = `Your free trial cluster will automatically be deleted on ${expirationTimeString}. Upgrade your cluster at any time to prevent deletion.`;
  }

  return (
    <Alert
      id="expiration-alert"
      className="pf-v5-u-mt-md"
      variant={variant}
      isInline
      title={`This cluster will be deleted ${timeUntilExpiryString}.`}
      data-testid="expiration-alert-will-delete"
      role="alert"
    >
      <p>{contents}</p>
      {trialExpiration && (
        <Button
          variant="secondary"
          className="pf-v5-u-mt-sm"
          data-testid="trial-button"
          onClick={() =>
            openModal?.(modals.UPGRADE_TRIAL_CLUSTER, {
              title: 'Upgrade cluster from Trial',
              clusterID: cluster?.id,
              cluster,
            })
          }
        >
          Upgrade from trial
        </Button>
      )}
    </Alert>
  );
};

export default ExpirationAlert;
