import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';
import { formatErrorDetails } from '../../../common/errors';
import Modal from '../Modal/Modal';

function ErrorModal({
  title, errorResponse, resetResponse, closeModal,
}) {
  const close = () => {
    resetResponse();
    closeModal();
  };

  const errorDetails = formatErrorDetails(errorResponse.errorDetails);

  return (
    <Modal
      header={(
        <Title headingLevel="h2" size="2xl">
          <ExclamationCircleIcon color={global_danger_color_100.value} />
          {' '}
          {title}
        </Title>
        )}
      primaryText="Close"
      onPrimaryClick={close}
      onClose={close}
      showClose={false}
      showSecondary={false}
      aria-label={title}
    >
      <p>{errorResponse.errorMessage}</p>
      {errorDetails && <p>{errorDetails}</p>}
      <p>{`Operation ID: ${errorResponse.operationID || 'N/A'}`}</p>
    </Modal>
  );
}

ErrorModal.propTypes = {
  title: PropTypes.string,
  errorResponse: PropTypes.object,
  closeModal: PropTypes.func,
  resetResponse: PropTypes.func.isRequired,
};

export default ErrorModal;
