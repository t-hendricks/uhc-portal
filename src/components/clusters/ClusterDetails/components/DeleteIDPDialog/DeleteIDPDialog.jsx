import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../../common/Modal/Modal';
import ErrorBox from '../../../../common/ErrorBox';

import { noop } from '../../../../../common/helpers';

class DeleteIDPDialog extends React.Component {
  componentDidUpdate() {
    const { deletedIDPResponse } = this.props;
    if (deletedIDPResponse.fulfilled) {
      this.closeDialog(true);
    }
  }

  closeDialog(parentShouldRefresh) {
    const { clearDeleteIDPResponse, close, onClose } = this.props;

    clearDeleteIDPResponse(); // clear the response for the next time the dialog is shown.
    close(); // Close the dialog.
    onClose(parentShouldRefresh); // call the onClose event handler from the parent.
  }

  render() {
    const {
      isOpen,
      modalData,
      deleteIDP,
      deletedIDPResponse,
    } = this.props;

    const {
      clusterID,
      idpID,
    } = modalData;

    const errorContainer = deletedIDPResponse.error && (
      <ErrorBox message="Error removing Identiy Provider" response={deletedIDPResponse} />
    );

    const isPending = deletedIDPResponse.pending;
    const close = () => this.closeDialog(false);

    return isOpen && (
      <Modal
        onClose={close}
        primaryText="Remove"
        primaryVariant="danger"
        onPrimaryClick={() => deleteIDP(clusterID, idpID)}
        onSecondaryClick={close}
        title="Remove Identity Provider"
        isPending={isPending}
      >
        {errorContainer}
        <p>
          You may lose access to this cluster if you remove this identity provider.
          At least one identity provider is required to access the cluster.
        </p>
      </Modal>
    );
  }
}

DeleteIDPDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object,
  clearDeleteIDPResponse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  deleteIDP: PropTypes.func.isRequired,
  deletedIDPResponse: PropTypes.object,
  onClose: PropTypes.func,
};

DeleteIDPDialog.defaultProps = {
  onClose: noop,
};

export default DeleteIDPDialog;
