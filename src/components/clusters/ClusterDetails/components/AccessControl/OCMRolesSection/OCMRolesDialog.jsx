import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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

import modals from '../../../../../common/Modal/modals';
import Modal from '../../../../../common/Modal/Modal';
import PopoverHint from '../../../../../common/PopoverHint';
import { ocmRoles } from '../../../../../../common/subscriptionTypes';

function OCMRolesDialog({
  closeModal,
  isOpen,
  onSubmit,
  clearGrantOCMRoleResponse,
  grantOCMRoleResponse,
  row,
}) {
  const [username, setUsername] = useState(null);
  const [usernameValidationMsg, setUsernameValidationMsg] = useState('');
  const [APIErrorMsg, setAPIErrorMsg] = useState('');
  const [roleID, setRoleID] = useState(null);
  const [isPrimaryDisabled, setIsPrimaryDisabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // when it's opened reset username and roleID
  // changes to the row are implicitly covered by isOpen.
  // No need to have it in the checklist.
  useEffect(() => {
    if (isOpen) {
      setUsername(row.usernameValue);
      setRoleID(row.roleValue || ocmRoles.CLUSTER_EDITOR);
      setUsernameValidationMsg('');
      setAPIErrorMsg('');
      setIsPrimaryDisabled(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    closeModal();
    clearGrantOCMRoleResponse();
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
        grantOCMRoleResponse.errorMessage.includes('belong to different organizations')
      ) {
        setAPIErrorMsg('This Red Hat login is not part of your organization.');
      } else {
        const errMsg = grantOCMRoleResponse.errorMessage || 'Unknow Error';
        const newAPIErrorMsg = errMsg.split(/\r?\n/).pop();
        // use the shorten message if it is in the form "ACCT-MGMT-XX:\nXXX"
        setAPIErrorMsg(newAPIErrorMsg.endsWith('.') ? newAPIErrorMsg : `${newAPIErrorMsg}.`);
      }
      setIsPrimaryDisabled(false);
    }
  }, [grantOCMRoleResponse]);

  const validateUsername = (val) => {
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

  const handleUsernameChange = (inputVal) => {
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

  const options = [
    {
      id: ocmRoles.CLUSTER_EDITOR,
      name: 'Cluster editor',
      description:
        'Cluster editor role will allow users or groups to manage and cofigure the cluster.',
    },
    {
      id: ocmRoles.CLUSTER_VIEWER,
      name: 'Cluster viewer',
      description: 'Cluster viewer role will allow users or groups to view cluster details only.',
    },
  ];

  return (
    isOpen && (
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
                setRoleID(selection);
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
    )
  );
}

OCMRolesDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  clearGrantOCMRoleResponse: PropTypes.func.isRequired,
  grantOCMRoleResponse: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

OCMRolesDialog.modalName = modals.OCM_ROLES;

export { OCMRolesDialog };

export default OCMRolesDialog;
