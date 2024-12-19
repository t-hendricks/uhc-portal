import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Form, FormGroup, TextInput } from '@patternfly/react-core';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import {
  addNotificationContact,
  clearAddNotificationContacts,
} from '~/redux/actions/supportActions';
import { useGlobalState } from '~/redux/hooks';

import { validateRHITUsername } from '../../../../../../common/validators';
import Modal from '../../../../../common/Modal/Modal';
import { closeModal } from '../../../../../common/Modal/ModalActions';

const AddNotificationContactDialog = () => {
  const initialState = {
    userName: '',
    userNameTouched: false,
  };

  const isModalOpen = useGlobalState((state) => shouldShowModal(state, 'add-notification-contact'));
  const { cluster } = useGlobalState((state) => state.clusters.details);
  const { addContactResponse } = useGlobalState((state) => state.clusterSupport);
  const [userName, setUserName] = useState<string>(initialState.userName);
  const [userNameTouched, setUserNameTouched] = useState<boolean>(initialState.userNameTouched);
  const dispatch = useDispatch();
  const setInitialState = useCallback(() => {
    dispatch(clearAddNotificationContacts());
    dispatch(closeModal());
    setUserName(initialState.userName);
    setUserNameTouched(initialState.userNameTouched);
  }, [dispatch, initialState.userName, initialState.userNameTouched]);

  useEffect(() => {
    if (addContactResponse.fulfilled) {
      setInitialState();
    }
  }, [addContactResponse.fulfilled, setInitialState]);

  const setUserNameValue = (userName: string) => {
    setUserName(userName);
    setUserNameTouched(true);
  };

  const validationMessage = userNameTouched
    ? validateRHITUsername(userName)
    : addContactResponse.errorMessage;

  const handleSubmit = () => {
    if (!validationMessage && cluster.subscription?.id) {
      setUserNameTouched(false);
      dispatch(addNotificationContact(cluster.subscription.id, userName));
    }
  };

  return isModalOpen ? (
    <Modal
      title="Add notification contact"
      onClose={setInitialState}
      primaryText="Add contact"
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={setInitialState}
      isPrimaryDisabled={!!validationMessage || addContactResponse.pending || userName === ''}
      isPending={addContactResponse.pending}
    >
      <p className="pf-v5-u-mb-xl">
        Identify the user to be added as notification contact. These users will be contacted in the
        event of notifications about this cluster.
      </p>
      <Form
        className="control-form-cursor"
        onSubmit={(e) => {
          handleSubmit();
          e.preventDefault();
        }}
      >
        <FormGroup label="Red Hat username or email" isRequired fieldId="username">
          <TextInput
            value={userName}
            isRequired
            id="username"
            type="text"
            validated={!validationMessage ? 'default' : 'error'}
            onChange={(_event, userNameValue) => setUserNameValue(userNameValue)}
            aria-label="user name"
          />

          <FormGroupHelperText touched error={validationMessage} />
        </FormGroup>
      </Form>
    </Modal>
  ) : null;
};

export default AddNotificationContactDialog;
