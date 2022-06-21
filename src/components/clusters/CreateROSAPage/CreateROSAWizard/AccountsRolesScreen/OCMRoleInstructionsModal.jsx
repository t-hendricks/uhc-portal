import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../../common/Modal/Modal';

import OCMRoleScreen from './AssociateAWSAccountModal/OCMRoleScreen';

function OCMRoleInstructionsModal(props) {
  const {
    isOpen,
    hasAWSAccounts,
    closeModal,
  } = props;

  return isOpen && (
    <Modal
      title="Create and Link OCM Role"
      modalSize="medium"
      onClose={() => closeModal()}
      showPrimary={false}
      secondaryText="Ok"
      onSecondaryClick={() => closeModal()}
    >
      <OCMRoleScreen hasAWSAccounts={hasAWSAccounts} hideTitle />
    </Modal>
  );
}

OCMRoleInstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  hasAWSAccounts: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default OCMRoleInstructionsModal;
