import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, TextInput } from '@patternfly/react-core';

import Modal from '../../../../../common/Modal/Modal';

import ErroBox from '../../../../../common/ErrorBox';

import '../AddOns.scss';

class AddOnsDeleteModal extends Component {
  state = {
    addOnNameInput: '',
  };

  componentDidUpdate(prevProps) {
    const { deleteClusterAddOnResponse } = this.props;
    if (!prevProps.deleteClusterAddOnResponse.fulfilled && deleteClusterAddOnResponse.fulfilled) {
      this.handleClose();
    }
  }

  setValue = (newInput) => {
    this.setState({
      addOnNameInput: newInput,
    });
  };

  handleClose = () => {
    const { closeModal, clearClusterAddOnsResponses } = this.props;
    clearClusterAddOnsResponses();
    this.setState({
      addOnNameInput: '',
    });
    closeModal();
  };

  render() {
    const { isOpen, modalData, deleteClusterAddOn, deleteClusterAddOnResponse } = this.props;

    const { addOnNameInput } = this.state;

    const { addOnName, addOnID, clusterID } = modalData;

    const isValid = addOnNameInput === addOnName;

    const handleSubmit = () => {
      deleteClusterAddOn(clusterID, addOnID);
    };

    const submitForm = (e) => {
      e.preventDefault();
      if (isValid) {
        handleSubmit();
      }
    };

    const errorContainer = deleteClusterAddOnResponse.error && (
      <ErroBox message="Error uninstalling add-on" response={deleteClusterAddOnResponse} />
    );

    const isPending = deleteClusterAddOnResponse.pending;

    return (
      isOpen && (
        <Modal
          title={`Uninstall ${addOnName}`}
          onClose={this.handleClose}
          primaryText="Uninstall"
          primaryVariant="danger"
          isPrimaryDisabled={!isValid}
          onPrimaryClick={handleSubmit}
          onSecondaryClick={this.handleClose}
          isPending={isPending}
        >
          <p>
            {errorContainer}
            This action will uninstall the add-on, removing add-on data from cluster can not be
            undone.
          </p>
          <Form onSubmit={submitForm}>
            <p>
              Confirm deletion by typing{' '}
              <span className="addon-delete-modal-textinput">{addOnName}</span> below:
            </p>
            <TextInput
              type="text"
              value={addOnNameInput}
              placeholder="Enter name"
              onChange={this.setValue}
              aria-label="addon name"
            />
          </Form>
        </Modal>
      )
    );
  }
}

AddOnsDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalData: PropTypes.shape({
    addOnName: PropTypes.string,
    addOnID: PropTypes.string,
    clusterID: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
  deleteClusterAddOn: PropTypes.func.isRequired,
  deleteClusterAddOnResponse: PropTypes.object.isRequired,
  clearClusterAddOnsResponses: PropTypes.func.isRequired,
};

export default AddOnsDeleteModal;
