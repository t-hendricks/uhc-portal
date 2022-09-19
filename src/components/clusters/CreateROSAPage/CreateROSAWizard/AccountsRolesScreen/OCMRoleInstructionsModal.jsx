import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../../common/Modal/Modal';
import { OcmRoleScreen } from './AssociateAWSAccountModal/OcmRoleScreen';

function OCMRoleInstructionsModal(props) {
  const { isOpen, closeModal } = props;

  return (
    isOpen && (
      <Modal
        title="Create and Link OCM Role"
        modalSize="medium"
        onClose={() => closeModal()}
        showPrimary={false}
        secondaryText="Ok"
        onSecondaryClick={() => closeModal()}
      >
        <OcmRoleScreen />
      </Modal>
    )
  );
}

OCMRoleInstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default OCMRoleInstructionsModal;
