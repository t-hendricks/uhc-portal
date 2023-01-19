import React from 'react';
import PropTypes from 'prop-types';

import { Form, Flex, TextInput } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';

import ErroBox from '../../../common/ErrorBox';
import { noop } from '../../../../common/helpers';

class DeleteClusterDialog extends React.Component {
  state = {
    clusterNameInput: '',
  };

  componentDidUpdate(prevProps) {
    const { deleteClusterResponse, onSuccess } = this.props;
    if (!prevProps.deleteClusterResponse.fulfilled && deleteClusterResponse.fulfilled) {
      // Close the dialog and tell the parent they might want to refresh.
      this.closeDialog(true);
      onSuccess?.();
    }
  }

  setValue = (newInput) => {
    this.setState({
      clusterNameInput: newInput,
    });
  };

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
      textContent,
      title,
      titleIconVariant,
    } = this.props;

    const { clusterID, clusterName } = modalData;

    const { clusterNameInput } = this.state;

    const errorContainer = deleteClusterResponse.error && (
      <ErroBox message="Error deleting cluster" response={deleteClusterResponse} />
    );

    const isPending = deleteClusterResponse.pending;
    const isValid = clusterNameInput === clusterName;

    const submitForm = (e) => {
      e.preventDefault();
      if (isValid && !isPending) {
        deleteCluster(clusterID);
      }
    };

    return (
      <Modal
        title={title || 'Delete cluster'}
        titleIconVariant={titleIconVariant}
        secondaryTitle={shouldDisplayClusterName ? clusterName : undefined}
        onClose={() => this.closeDialog(false)}
        primaryText="Delete"
        onPrimaryClick={() => deleteCluster(clusterID)}
        onSecondaryClick={() => this.closeDialog(false)}
        isPrimaryDisabled={!isValid || isPending}
        isPending={isPending}
        primaryVariant="danger"
        data-testid="delete-cluster-dialog"
      >
        <Flex direction={{ default: 'column' }}>
          {errorContainer}
          <p>
            {textContent ||
              'This action cannot be undone. It will uninstall the cluster, and all data will be deleted.'}
          </p>
          <p>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Confirm deletion by typing <strong>{clusterName}</strong> below:
          </p>
          <Form onSubmit={submitForm}>
            <TextInput
              type="text"
              value={clusterNameInput}
              placeholder="Enter name"
              onChange={this.setValue}
              aria-label="cluster name"
            />
          </Form>
        </Flex>
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
  textContent: PropTypes.string,
  title: PropTypes.string,
  titleIconVariant: PropTypes.string,
  onSuccess: PropTypes.func,
};

DeleteClusterDialog.defaultProps = {
  onClose: noop,
};

DeleteClusterDialog.modalName = modals.DELETE_CLUSTER;

export default DeleteClusterDialog;
