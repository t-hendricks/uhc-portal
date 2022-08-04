import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionLink } from '@patternfly/react-core';
import { ENV_OVERRIDE_LOCALSTORAGE_KEY } from '../../config';

function EnvOverrideMessage({ env }) {
  const goBackToNormal = () => {
    localStorage.removeItem(ENV_OVERRIDE_LOCALSTORAGE_KEY);
    window.location.href = APP_BETA ? '/beta/openshift' : '/openshift';
  };
  return (
    <Alert
      variant="warning"
      isInline
      id="env-override-message"
      title="Environment override active"
      actionLinks={<AlertActionLink onClick={goBackToNormal}>Go back to normal</AlertActionLink>}
    >
      You&apos;re now using the
      {' '}
      <b>{env}</b>
      {' '}
      environment API.
    </Alert>
  );
}

EnvOverrideMessage.propTypes = {
  env: PropTypes.string.isRequired,
};

export default EnvOverrideMessage;
