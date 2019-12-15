import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Alert } from '@patternfly/react-core';

function ExpirationAlert({ expirationTimestamp }) {
  const now = moment.utc();
  const expirationTime = moment.utc(expirationTimestamp);
  const diff = expirationTime.diff(now, 'hours');
  const timeUntilExpiryString = now.to(expirationTime);
  const expirationTimeString = expirationTime.format('dddd, MMMM Do YYYY, h:mm a');
  let variant;

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
      title={`This cluster will be deleted ${timeUntilExpiryString}, on ${expirationTimeString}.`}
    />
  );
}

ExpirationAlert.propTypes = {
  expirationTimestamp: PropTypes.string.isRequired,
};

export default ExpirationAlert;
