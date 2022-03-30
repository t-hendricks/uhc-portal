import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

function LeaveClusterModal({ isOpen, onSubmit, onCancel }) {
  const actions = [
    <Button
      key="leave"
      variant="primary"
      onClick={onSubmit}
    >
      Yes, leave
    </Button>,
    <Button
      key="stay"
      variant="link"
      onClick={onCancel}
    >
      No, stay
    </Button>,
  ];

  return (
    <Modal
      variant={ModalVariant.small}
      title="Leave create cluster?"
      titleIconVariant="warning"
      isOpen={isOpen}
      onClose={onCancel}
      actions={actions}
    >
      All data entered will be lost
    </Modal>
  );
}

LeaveClusterModal.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default LeaveClusterModal;
