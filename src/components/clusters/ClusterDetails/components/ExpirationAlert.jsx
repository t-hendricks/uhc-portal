import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Alert } from '@patternfly/react-core';
import './ExpirationAlert.scss';


function ExpirationAlert({ expirationTimestamp }) {
  const now = moment.utc();
  const expirationTime = moment.utc(expirationTimestamp);
  const diff = expirationTime.diff(now, 'hours');
  const timeUntilExpiryString = now.to(expirationTime);
  const expirationTimeString = expirationTime.local().format('dddd, MMMM Do YYYY, h:mm a');
  let variant;

  if (diff < 0) {
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

  if (diff >= 48) {
    variant = 'info';
  }
  if (diff < 48 && diff >= 24) {
    variant = 'warning';
  }
  if (diff < 24) {
    variant = 'danger';
  }

  return (
    <Alert
      id="expiration-alert"
      variant={variant}
      isInline
      title={`This cluster will be deleted ${timeUntilExpiryString}.`}
    >
      This cluster is scheduled for deletion on
      {' '}
      {expirationTimeString}
.
    </Alert>
  );
}

ExpirationAlert.propTypes = {
  expirationTimestamp: PropTypes.string.isRequired,
};

export default ExpirationAlert;
