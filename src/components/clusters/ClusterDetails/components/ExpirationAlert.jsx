import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Alert, Button } from '@patternfly/react-core';
import modals from '../../../common/Modal/modals';
import ExternalLink from '../../../common/ExternalLink';

function ExpirationAlert({
  expirationTimestamp,
  trialExpiration,
  openModal,
  cluster,
  OSDRHMExpiration,
}) {
  const now = moment.utc();
  const expirationTime = moment.utc(expirationTimestamp);
  const hours = expirationTime.diff(now, 'hours');
  const timeUntilExpiryString = now.to(expirationTime);
  const expirationTimeString = expirationTime.local().format('dddd, MMMM Do YYYY, h:mm a');
  let variant;

  if (hours <= 0) {
    return (
      <Alert
        id="expiration-alert"
        className="pf-u-mt-md"
        variant="warning"
        isInline
        title={`This cluster should have been deleted ${timeUntilExpiryString}.`}
      >
        <>
          Please contact OCM support at
          {' '}
          <a
            href="mailto: ocm-feedback@redhat.com"
          >
            ocm-feedback@redhat.com
          </a>
          {' '}
          to let us know about this issue.
        </>
      </Alert>
    );
  }

  if (hours >= 48) {
    variant = 'info';
  }
  if (hours < 48 && hours >= 24) {
    variant = 'warning';
  }
  if (hours < 24) {
    variant = 'danger';
  }

  let contents = `This cluster is scheduled for deletion on ${expirationTimeString}`;

  if (trialExpiration) {
    contents = `Your free trial cluster will automatically be deleted on ${expirationTimeString}. Upgrade your cluster at any time to prevent deletion.`;
  }

  if (OSDRHMExpiration) {
    contents = (
      <>
        Your cluster subscription was purchased from Red Hat Marketplace and will expire on
        {` ${expirationTimeString}. `}
        Once expired, the cluster will be deleted permanently.
        To avoid deletion, please purchase a new subscription from the
        {' '}
        <ExternalLink href="https://marketplace.redhat.com/en-us/products/red-hat-openshift-dedicated">
          Red Hat Marketplace
        </ExternalLink>
        {' '}
        before the expiration date.
      </>
    );
  }

  const upgradeTrialProps = {
    title: 'Upgrade cluster from Trial',
    clusterID: cluster?.id,
    cluster,
  };

  return (
    <Alert
      id="expiration-alert"
      className="pf-u-mt-md"
      variant={variant}
      isInline
      title={`This cluster will be deleted ${timeUntilExpiryString}.`}
    >
      <p>
        {contents}
      </p>
      {trialExpiration && (
        <Button variant="secondary" className="pf-u-mt-sm" onClick={() => openModal(modals.UPGRADE_TRIAL_CLUSTER, upgradeTrialProps)}>Upgrade from trial</Button>
      )}
    </Alert>
  );
}

ExpirationAlert.propTypes = {
  expirationTimestamp: PropTypes.string.isRequired,
  trialExpiration: PropTypes.bool,
  openModal: PropTypes.func,
  cluster: PropTypes.shape({ id: PropTypes.string }),
  OSDRHMExpiration: PropTypes.bool,
};

export default ExpirationAlert;
