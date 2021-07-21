import React from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';

import ErroBox from '../../../common/ErrorBox';
import { noop } from '../../../../common/helpers';

class DeleteClusterDialog extends React.Component {
  state = {
    clusterNameInput: '',
  }

  componentDidUpdate(prevProps) {
    const { deleteClusterResponse } = this.props;
    if (!prevProps.deleteClusterResponse.fulfilled && deleteClusterResponse.fulfilled) {
      // Close the dialog and tell the parent they might want to refresh.
      this.closeDialog(true);
    }
  }

  setValue = (newInput) => {
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
      modalData,
      deleteCluster,
      deleteClusterResponse,
      shouldDisplayClusterName,
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

    return (
      <Modal
        title="Delete cluster"
        secondaryTitle={shouldDisplayClusterName ? clusterName : undefined}
        onClose={() => this.closeDialog(false)}
        primaryText="Delete"
        onPrimaryClick={() => doSubmit(clusterID)}
        onSecondaryClick={() => this.closeDialog(false)}
        isPrimaryDisabled={!isValid || isPending}
        isPending={isPending}
        primaryVariant="danger"
        data-test-id="delete-cluster-dialog"
      >
        <>
          {errorContainer}
          <p>
            This action cannot be undone.
            It will uninstall the cluster, and all data will be deleted.
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
            onChange={this.setValue}
            aria-label="cluster name"
          />
        </Form>
      </Modal>
    );
  }
}

DeleteClusterDialog.propTypes = {
  modalData: PropTypes.shape({
    clusterName: PropTypes.string,
    clusterID: PropTypes.string,
  }),
  clearDeleteClusterResponse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  deleteCluster: PropTypes.func.isRequired,
  deleteClusterResponse: PropTypes.object,
  onClose: PropTypes.func,
  shouldDisplayClusterName: PropTypes.bool,
};

DeleteClusterDialog.defaultProps = {
  onClose: noop,
};

DeleteClusterDialog.modalName = modals.DELETE_CLUSTER;

export default DeleteClusterDialog;
