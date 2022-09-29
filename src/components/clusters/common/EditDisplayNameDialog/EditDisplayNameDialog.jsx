import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput, FormGroup } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';
import modals from '../../../common/Modal/modals';
import { checkClusterDisplayName } from '../../../../common/validators';

class EditDisplayNameDialog extends Component {
  state = {
    currentValue: '',
  };

  componentDidMount() {
    const { displayName } = this.props;
    this.setState({ currentValue: displayName });
  }

  componentDidUpdate() {
    const { editClusterResponse, resetResponse, closeModal, onClose } = this.props;
    if (editClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  setValue(newValue) {
    this.setState({
      currentValue: newValue,
    });
  }

  render() {
    const {
      closeModal,
      submit,
      editClusterResponse,
      resetResponse,
      subscriptionID,
      shouldDisplayClusterName,
      displayName,
    } = this.props;
    const { currentValue } = this.state;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const hasError = editClusterResponse.error && (
      <ErrorBox message="Error changing display name" response={editClusterResponse} />
    );

    const { pending } = editClusterResponse;

    const validationMessage = checkClusterDisplayName(currentValue);
    const handleSubmit = () => {
      if (!validationMessage) {
        submit(subscriptionID, currentValue);
      }
    };

    return (
      <Modal
        title="Edit display name"
        secondaryTitle={shouldDisplayClusterName ? displayName : undefined}
        data-test-id="edit-displayname-modal"
        onClose={cancelEdit}
        primaryText="Edit"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        isPrimaryDisabled={!!validationMessage || currentValue === displayName}
        isPending={pending}
      >
        <>
          {hasError}
          <Form
            onSubmit={(e) => {
              handleSubmit();
              e.preventDefault();
            }}
          >
            <FormGroup
              helperTextInvalid={validationMessage}
              validated={!validationMessage ? 'default' : 'error'}
              fieldId="edit-display-name-input"
            >
              <TextInput
                type="text"
                validated={!validationMessage ? 'default' : 'error'}
                value={currentValue}
                placeholder="Enter display name"
                onChange={(newValue) => this.setValue(newValue)}
                aria-label="Edit display name"
                id="edit-display-name-input"
              />
            </FormGroup>
          </Form>
        </>
      </Modal>
    );
  }
}

EditDisplayNameDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  displayName: PropTypes.string,
  subscriptionID: PropTypes.string,
  shouldDisplayClusterName: PropTypes.bool,
};

EditDisplayNameDialog.defaultProps = {
  editClusterResponse: {},
};

EditDisplayNameDialog.modalName = modals.EDIT_DISPLAY_NAME;

export default EditDisplayNameDialog;
