import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Alert } from '@patternfly/react-core';
import './ExpirationAlert.scss';

function ExpirationAlert({ expirationTimestamp, trialExpiration }) {
  const now = moment.utc();
  const expirationTime = moment.utc(expirationTimestamp);
  const hours = expirationTime.diff(now, 'hours');
  const timeUntilExpiryString = now.to(expirationTime);
  const expirationTimeString = expirationTime.local().format('dddd, MMMM Do YYYY, h:mm a');
  let variant;

  if (hours < 0) {
    return (
      <Alert
        id="expiration-alert"
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

  return (
    <Alert
      id="expiration-alert"
      variant={variant}
      isInline
      title={`This cluster will be deleted ${timeUntilExpiryString}.`}
    >
      {contents}
    </Alert>
  );
}

ExpirationAlert.propTypes = {
  expirationTimestamp: PropTypes.string.isRequired,
  trialExpiration: PropTypes.bool,
};

export default ExpirationAlert;
