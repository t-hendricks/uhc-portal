import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';

import { getRoundedCountdown } from '../clusterDetailsHelper';

function ExpirationAlert({ expirationTimestamp }) {
  const countdown = getRoundedCountdown(expirationTimestamp);

  if (Object.values(countdown).every(value => value <= 0)) {
    return null;
  }

  let variant;
  let title;
  const { days, hours, minutes } = countdown;
  const prefix = 'This cluster will be deleted in';

  if (days >= 1) {
    const daysPart = `${days} ${days === 1 ? 'day' : 'days'}`;
    title = `${prefix} ${daysPart}.`;
  } else if (hours > 0) { // 0 days, n hours
    const hoursPart = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    if (minutes > 0) {
      const minutesPart = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
      title = `${prefix} ${hoursPart} and ${minutesPart}.`;
    } else {
      title = `${prefix} ${hoursPart}.`;
    }
  } else { // 0 days, 0 hours, m minutes
    title = `${prefix} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`;
  }

  if (days >= 2) {
    variant = 'info';
  } else if (days === 1) {
    variant = 'warning';
  } else {
    variant = 'danger';
  }

  return (
    <Alert
      id="expiration-alert"
      variant={variant}
      isInline
      title={title}
    />
  );
}

ExpirationAlert.propTypes = {
  expirationTimestamp: PropTypes.string.isRequired,
};

export default ExpirationAlert;
