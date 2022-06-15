import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../../common/Modal/Modal';

import UserRoleScreen from './AssociateAWSAccountModal/UserRoleScreen';

function UserRoleInstructionsModal(props) {
  const {
    isOpen,
    hasAWSAccounts,
    closeModal,
  } = props;

  return isOpen && (
    <Modal
      title="Create and Link User Role"
      onClose={() => closeModal()}
      showPrimary={false}
      secondaryText="Ok"
      onSecondaryClick={() => closeModal()}
    >
      <UserRoleScreen hasAWSAccounts={hasAWSAccounts} hideTitle />
    </Modal>
  );
}

UserRoleInstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  hasAWSAccounts: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default UserRoleInstructionsModal;
