import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../common/Modal/Modal';
import ErroBox from '../../../common/ErrorBox';

class ToggleClusterAdminAccessDialog extends React.Component {
  componentDidUpdate() {
    const {
      toggleClusterAdminResponse, clearToggleClusterAdminResponse, closeModal,
    } = this.props;

    if (toggleClusterAdminResponse.fulfilled) {
      clearToggleClusterAdminResponse();
      closeModal();
    }
  }

  render() {
    const {
      toggleClusterAdminAccess, toggleClusterAdminResponse, isOpen, closeModal, modalData,
    } = this.props;

    const errorContainer = toggleClusterAdminResponse.error && (
    <ErroBox message="Error deleting cluster" response={toggleClusterAdminResponse} />
    );

    const isPending = toggleClusterAdminResponse.pending;

    const submit = () => {
      toggleClusterAdminAccess(modalData.id, !!(modalData.cluster_admin_enabled));
    };

    const modalText = !modalData.cluster_admin_enabled
      ? (
        <>
        Users with this level of access privilege can cause irreperable damage to the cluster.
          Per the
          {' '}
          <a href="https://www.openshift.com/legal/terms/" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          {' '}
          Red Hat
          is not responsible for problems caused by cluster-admin users.
        </>
      )
      : (
        <>
        Users will no longer be able to access the cluster with cluster-admin privileges.
        Previously created cluster-admin roles will be deleted.
        </>
      );
    return isOpen && (
    <Modal
      title={!modalData.cluster_admin_enabled ? 'Allow cluster-admin access?' : 'Remove cluster-admin access?'}
      onClose={closeModal}
      primaryText={!modalData.cluster_admin_enabled ? 'Allow access' : 'Remove access'}
      secondaryText="cancel"
      onPrimaryClick={() => submit()}
      onSecondaryClick={closeModal}
      isPrimaryDisabled={isPending}
      isPending={isPending}
    >
      <>
        {errorContainer}
        {modalText}
      </>
    </Modal>
    );
  }
}

ToggleClusterAdminAccessDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object,
  toggleClusterAdminAccess: PropTypes.func.isRequired,
  toggleClusterAdminResponse: PropTypes.object,
  clearToggleClusterAdminResponse: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};


export default ToggleClusterAdminAccessDialog;
