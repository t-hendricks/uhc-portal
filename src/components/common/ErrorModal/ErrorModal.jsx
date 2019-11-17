import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';
import Modal from '../Modal/Modal';

function ErrorModal({
  title, errorResponse, resetResponse, closeModal,
}) {
  const close = () => {
    resetResponse();
    closeModal();
  };

  return (
    <Modal
      header={(
        <Title size="2xl">
          <ExclamationCircleIcon color={global_danger_color_100.value} />
          {' '}
          {title}
        </Title>
        )}
      primaryText="Close"
      onPrimaryClick={close}
      onClose={close}
      showClose={false}
      showSecondery={false}
    >
      <p>
        {errorResponse.errorMessage}
      </p>
      <p>
        {`Operation ID: ${errorResponse.operationID || 'N/A'}`}
      </p>
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
