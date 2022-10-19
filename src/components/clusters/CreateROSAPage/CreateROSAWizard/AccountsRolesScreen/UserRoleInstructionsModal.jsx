import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../../common/Modal/Modal';
import { UserRoleScreen } from './AssociateAWSAccountModal/UserRoleScreen';

function UserRoleInstructionsModal(props) {
  const { isOpen, closeModal } = props;

  return (
    isOpen && (
      <Modal
        title="Create and Link User Role"
        modalSize="medium"
        onClose={() => closeModal()}
        showPrimary={false}
        secondaryText="Ok"
        onSecondaryClick={() => closeModal()}
      >
        <UserRoleScreen hideTitle />
      </Modal>
    )
  );
}

UserRoleInstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default UserRoleInstructionsModal;
