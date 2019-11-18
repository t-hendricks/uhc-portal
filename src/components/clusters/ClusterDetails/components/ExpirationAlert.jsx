import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';

import { getCountdown } from '../../../../common/helpers';

function ExpirationAlert({ expirationTimestamp }) {
  const countdown = getCountdown(expirationTimestamp);

  if (Object.values(countdown).every(value => value <= 0)) {
    return null;
  }

  let variant;
  let title;
  if (countdown.days >= 3) {
    variant = 'info';
    title = `This cluster will be deleted in ${countdown.days} days.`;
  } else if (countdown.days >= 1) {
    variant = 'warning';
    title = `This cluster will be deleted in ${countdown.days}
     ${countdown.days === 1 ? 'day' : 'days'}.`;
  } else if (countdown.hours >= 1) {
    variant = 'danger';
    title = `This cluster will be deleted in ${countdown.hours}
     ${countdown.hours === 1 ? 'hour' : 'hours'}.`;
  } else {
    variant = 'danger';
    title = `This cluster will be deleted in ${countdown.minutes}
    ${countdown.minutes === 1 ? 'minute' : 'minutes'}.`;
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
