import React, { useState, useEffect } from 'react';

import {
  Form,
  TextInput,
  Select,
  SelectOption,
  FormGroup,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks';
import { useDispatch } from 'react-redux';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import modals from '../../../../../common/Modal/modals';
import Modal from '../../../../../common/Modal/Modal';
import PopoverHint from '../../../../../common/PopoverHint';
import { ocmRoles } from '../../../../../../common/subscriptionTypes';
import OCMRolesActions from '../../../../../../redux/actions/OCMRolesActions';
import { OCMRolesRow } from './OCMRolesRow';
import { closeModal } from '../../../../../common/Modal/ModalActions';

export type OCMRolesDialogProps = {
  onSubmit: (row: OCMRolesRow, username: string, roleID: string) => void;
  row: OCMRolesRow;
};

function OCMRolesDialog({ onSubmit, row }: OCMRolesDialogProps) {
  const [username, setUsername] = useState<string>();
  const [usernameValidationMsg, setUsernameValidationMsg] = useState('');
  const [APIErrorMsg, setAPIErrorMsg] = useState('');
  const [roleID, setRoleID] = useState<string>('');
  const [isPrimaryDisabled, setIsPrimaryDisabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isOpen = useGlobalState((state) => shouldShowModal(state, modals.OCM_ROLES));
  const { grantOCMRoleResponse } = useGlobalState((state) => state.ocmRoles);
  const dispatch = useDispatch();

  // when it's opened reset username and roleID
  // changes to the row are implicitly covered by isOpen.
  // No need to have it in the checklist.
  useEffect(() => {
    if (isOpen) {
      setUsername(row.usernameValue);
      setRoleID(row.roleValue || ocmRoles.CLUSTER_EDITOR.id);
      setUsernameValidationMsg('');
      setAPIErrorMsg('');
      setIsPrimaryDisabled(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(OCMRolesActions.clearGrantOCMRoleResponse());
  };

  // close the dialog if submit is successful.
  // otherwise display the error.
  useEffect(() => {
    if (grantOCMRoleResponse.pending) {
      setAPIErrorMsg('');
      setIsPrimaryDisabled(true);
    } else if (grantOCMRoleResponse.fulfilled) {
      handleClose();
    } else if (grantOCMRoleResponse.error) {
      if (grantOCMRoleResponse.errorCode === 404) {
        setAPIErrorMsg('This Red Hat login could not be found.');
      } else if (
        grantOCMRoleResponse.errorCode === 400 &&
        grantOCMRoleResponse.errorMessage &&
        grantOCMRoleResponse.errorMessage.toString().includes('belong to different organizations')
      ) {
        setAPIErrorMsg('This Red Hat login is not part of your organization.');
      } else {
        const errMsg = grantOCMRoleResponse.errorMessage?.toString() || 'Unknown Error';
        const newAPIErrorMsg = errMsg.split(/\r?\n/).pop();
        // use the shorten message if it is in the form "ACCT-MGMT-XX:\nXXX"
        setAPIErrorMsg(
          newAPIErrorMsg && newAPIErrorMsg.endsWith('.') ? newAPIErrorMsg : `${newAPIErrorMsg}.`,
        );
      }
      setIsPrimaryDisabled(false);
    }
  }, [grantOCMRoleResponse]);

  if (!isOpen) {
    return <></>;
  }

  const validateUsername = (val?: string): val is string => {
    setAPIErrorMsg('');
    if (!val) {
      setUsernameValidationMsg('Red Hat login cannot be empty.');
      setIsPrimaryDisabled(true);
      return false;
    }
    setUsernameValidationMsg('');
    setIsPrimaryDisabled(false);
    return true;
  };

  const handleUsernameChange = (inputVal: string) => {
    const usernameVal = inputVal.trim();
    setUsername(usernameVal);
    validateUsername(usernameVal);
  };

  const handleSubmit = () => {
    if (validateUsername(username)) {
      onSubmit(row, username, roleID);
    }
  };

  // TODO OCM RBAC phase 2: add the "learn more" link of links.OCM_DOCS_ROLES_AND_ACCESS
  // and add radio selection for roles.
  const title = row.isCreating ? 'Grant role' : 'Edit role';
  const btnText = row.isCreating ? 'Grant role' : 'Edit role';

  const options = Object.values(ocmRoles);

  return (
    <Modal
      title={title}
      onClose={handleClose}
      primaryText={btnText}
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={handleClose}
      isPrimaryDisabled={isPrimaryDisabled}
      id="ocm-roles-access-dialog"
    >
      <p className="pf-u-mb-xl">
        Allow users in your organization to edit or view clusters. These permissions only apply to
        cluster management in OpenShift Cluster Manager.
      </p>
      <Form
        className="control-form-cursor"
        onSubmit={(e) => {
          handleSubmit();
          e.preventDefault();
        }}
      >
        <FormGroup
          label={
            <>
              <span>Red Hat login</span>
              <PopoverHint
                id="ocm-roles-section-username-tooltip"
                hint={
                  <TextContent>
                    <Text component={TextVariants.p}>
                      Your Red Hat login is the username you use to access your Red Hat account.
                    </Text>
                  </TextContent>
                }
                iconClassName="text-input-tootip-icon"
                hasAutoWidth
                maxWidth="20.0rem"
              />
            </>
          }
          isRequired
          fieldId="username"
          validated={usernameValidationMsg || APIErrorMsg ? 'error' : 'default'}
          helperTextInvalid={usernameValidationMsg || APIErrorMsg}
        >
          <TextInput
            value={username}
            isRequired
            id="username"
            type="text"
            onChange={handleUsernameChange}
            isDisabled={!row.isCreating}
            validated={usernameValidationMsg || APIErrorMsg ? 'error' : 'default'}
            aria-label="username"
          />
        </FormGroup>
        <FormGroup label="Role" isRequired>
          <Select
            onToggle={setIsDropdownOpen}
            onSelect={(e, selection) => {
              setRoleID(selection as string);
              setIsDropdownOpen(false);
            }}
            selections={roleID}
            isOpen={isDropdownOpen}
            menuAppendTo={() => document.body}
          >
            {options.map((option) => (
              <SelectOption key={option.id} value={option.id} description={option.description}>
                {option.name}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
      </Form>
    </Modal>
  );
}

OCMRolesDialog.modalName = modals.OCM_ROLES;

export { OCMRolesDialog };

export default OCMRolesDialog;
