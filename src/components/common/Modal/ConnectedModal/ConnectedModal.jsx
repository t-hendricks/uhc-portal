import React from 'react';
import PropTypes from 'prop-types';

function ConnectedModal({ ModalComponent, isOpen, ...props }) {
  if (!ModalComponent.modalName) {
    // Error handling to ensure catching badly defined modals as early as possible
    throw new Error('Modal component missing name');
  }

  return isOpen && <ModalComponent {...props} />;
}

ConnectedModal.propTypes = {
  isOpen: PropTypes.bool,
  ModalComponent: PropTypes.shape({
    modalName: PropTypes.string,
  }),
};

export default ConnectedModal;
