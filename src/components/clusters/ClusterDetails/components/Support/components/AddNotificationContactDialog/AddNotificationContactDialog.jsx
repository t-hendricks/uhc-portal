import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, FormGroup, TextInput } from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';
import { validateRHITUsername } from '../../../../../../../common/validators';

const initialState = {
  userName: '',
  userNameTouched: false,
};

class AddNotificationContactDialog extends Component {
  state = initialState;

  componentDidUpdate() {
    const { addContactResponse, clearAddNotificationContacts, closeModal } = this.props;
    if (addContactResponse.fulfilled) {
      closeModal();
      clearAddNotificationContacts();
      this.onUpdate(initialState);
    }
  }

  onUpdate = (state) => this.setState(state);

  setUserNameValue = (userNameValue) => {
    this.onUpdate({
      userName: userNameValue,
      userNameTouched: true,
    });
  };

  cancelAddUser = () => {
    const { clearAddNotificationContacts, closeModal } = this.props;
    this.onUpdate(initialState);
    clearAddNotificationContacts();
    closeModal();
  };

  render() {
    const {
      isAddNotificationContactModalOpen,
      addNotificationContact,
      addContactResponse,
      subscriptionID,
    } = this.props;
    const { userName, userNameTouched } = this.state;

    if (!isAddNotificationContactModalOpen) {
      return null;
    }

    const validationMessage = userNameTouched
      ? validateRHITUsername(userName)
      : addContactResponse.errorMessage;

    const handleSubmit = () => {
      if (!validationMessage) {
        this.onUpdate({
          userNameTouched: false,
        });
        addNotificationContact(subscriptionID, userName);
      }
    };

    return (
      <Modal
        title="Add notification contact"
        onClose={this.cancelAddUser}
        primaryText="Add contact"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={this.cancelAddUser}
        isPrimaryDisabled={!!validationMessage || addContactResponse.pending || userName === ''}
        isPending={addContactResponse.pending}
      >
        <p className="pf-u-mb-xl">
          Identify the user to be added as notification contact. These users will be contacted in
          the event of notifications about this cluster.
        </p>
        <Form
          className="control-form-cursor"
          onSubmit={(e) => {
            handleSubmit();
            e.preventDefault();
          }}
        >
          <FormGroup
            helperTextInvalid={validationMessage}
            validated={!validationMessage ? 'default' : 'error'}
            label="Red Hat username or email"
            isRequired
            fieldId="username"
          >
            <TextInput
              value={userName}
              isRequired
              id="username"
              type="text"
              validated={!validationMessage ? 'default' : 'error'}
              onChange={this.setUserNameValue}
              aria-label="user name"
            />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

AddNotificationContactDialog.propTypes = {
  isAddNotificationContactModalOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  clearAddNotificationContacts: PropTypes.func.isRequired,
  addContactResponse: PropTypes.object,
  addNotificationContact: PropTypes.func.isRequired,
  subscriptionID: PropTypes.string.isRequired,
};

export default AddNotificationContactDialog;
