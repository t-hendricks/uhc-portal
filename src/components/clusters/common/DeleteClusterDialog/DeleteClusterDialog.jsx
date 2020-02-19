import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form, TextInput } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';

import { deleteClusterDialogActions } from './DeleteClusterDialogActions';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import ErroBox from '../../../common/ErrorBox';
import { noop } from '../../../../common/helpers';

class DeleteClusterDialog extends React.Component {
  state = {
    clusterNameInput: '',
  }

  componentDidUpdate() {
    const { deleteClusterResponse } = this.props;
    if (deleteClusterResponse.fulfilled) {
      // Close the dialog and tell the parent they might want to refresh.
      this.closeDialog(true);
    }
  }

  setValue(newInput) {
    this.setState({
      clusterNameInput: newInput,
    });
  }

  closeDialog(parentShouldRefresh) {
    const { clearDeleteClusterResponse, close, onClose } = this.props;
    // reset the input, so it'll be empty next time the dialog is opened.
    this.setState({
      clusterNameInput: '',
    });
    clearDeleteClusterResponse(); // clear the response for the next time the dialog is shown.
    close(); // Close the dialog.
    onClose(parentShouldRefresh); // call the onClose event handler from the parent.
  }

  render() {
    const {
      isOpen,
      modalData,
      deleteCluster,
      deleteClusterResponse,
    } = this.props;

    const {
      clusterID,
      clusterName,
    } = modalData;

    const {
      clusterNameInput,
    } = this.state;

    const errorContainer = deleteClusterResponse.error && (
      <ErroBox message="Error deleting cluster" response={deleteClusterResponse} />
    );

    const isPending = deleteClusterResponse.pending;
    const isValid = clusterNameInput === clusterName;

    const doSubmit = () => {
      deleteCluster(clusterID);
    };

    const submitForm = (e) => {
      e.preventDefault();
      if (isValid && !isPending) {
        doSubmit();
      }
    };

    return isOpen && (
      <Modal
        title="Delete Cluster"
        onClose={() => this.closeDialog(false)}
        primaryText="Delete"
        onPrimaryClick={() => doSubmit(clusterID)}
        onSecondaryClick={() => this.closeDialog(false)}
        isPrimaryDisabled={!isValid || isPending}
        isPending={isPending}
        primaryVariant="danger"
      >
        <>
          {errorContainer}
          <p>
          This action cannot be undone. It will uninstall the cluster, and all data will be deleted.
          </p>
        </>
        <Form onSubmit={submitForm}>
          <p>
          Confirm deletion by typing
            {' '}
            <span style={{ fontWeight: 'bold' }}>{clusterName}</span>
            {' '}
          below:
          </p>
          <TextInput
            type="text"
            value={clusterNameInput}
            placeholder="Enter name"
            onChange={newInput => this.setValue(newInput)}
            aria-label="cluster name"
          />
        </Form>
      </Modal>
    );
  }
}

DeleteClusterDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.object,
  clearDeleteClusterResponse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  deleteCluster: PropTypes.func.isRequired,
  deleteClusterResponse: PropTypes.object,
  onClose: PropTypes.func,
};

DeleteClusterDialog.defaultProps = {
  onClose: noop,
};

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'delete-cluster'),
  modalData: state.modal.data,
  deleteClusterResponse: state.deleteCluster,
});

const mapDispatchToProps = {
  clearDeleteClusterResponse: () => deleteClusterDialogActions.deletedClusterResponse(),
  deleteCluster: clusterID => deleteClusterDialogActions.deleteCluster(clusterID),
  close: () => closeModal('delete-cluster'),
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClusterDialog);
