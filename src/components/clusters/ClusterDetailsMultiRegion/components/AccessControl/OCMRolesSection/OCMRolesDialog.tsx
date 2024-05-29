import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Form,
  FormGroup,
  Text,
  TextContent,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { useGlobalState } from '~/redux/hooks';

import { ocmRoles } from '../../../../../../common/subscriptionTypes';
import OCMRolesActions from '../../../../../../redux/actions/OCMRolesActions';
import Modal from '../../../../../common/Modal/Modal';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import modals from '../../../../../common/Modal/modals';
import PopoverHint from '../../../../../common/PopoverHint';

import { OCMRolesRow } from './OCMRolesRow';

export type OCMRolesDialogProps = {
  onSubmit: (row: OCMRolesRow, username: string, roleID: string) => void;
  row: OCMRolesRow;
  productId?: string;
};

function OCMRolesDialog({ onSubmit, row, productId }: OCMRolesDialogProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantOCMRoleResponse]);

  if (!isOpen) {
    return null;
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

  const options = Object.values(ocmRoles).filter((ocmRole) => {
    if (!productId || !ocmRole.excludeProductIds) {
      return true;
    }
    return !ocmRole.excludeProductIds.some((excludedId) => excludedId === productId);
  });

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
      <p className="pf-v5-u-mb-xl">
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
        >
          <TextInput
            value={username}
            isRequired
            id="username"
            type="text"
            onChange={(_event, inputVal: string) => handleUsernameChange(inputVal)}
            isDisabled={!row.isCreating}
            validated={usernameValidationMsg || APIErrorMsg ? 'error' : 'default'}
            aria-label="username"
          />

          <FormGroupHelperText touched error={usernameValidationMsg || APIErrorMsg} />
        </FormGroup>
        <FormGroup label="Role" isRequired>
          <SelectDeprecated
            onToggle={(_event, val) => setIsDropdownOpen(val)}
            onSelect={(e, selection) => {
              setRoleID(selection as string);
              setIsDropdownOpen(false);
            }}
            selections={roleID}
            isOpen={isDropdownOpen}
            menuAppendTo={() => document.body}
          >
            {options.map((option) => (
              <SelectOptionDeprecated
                key={option.id}
                value={option.id}
                description={option.description}
              >
                {option.name}
              </SelectOptionDeprecated>
            ))}
          </SelectDeprecated>
        </FormGroup>
      </Form>
    </Modal>
  );
}

OCMRolesDialog.modalName = modals.OCM_ROLES;

export { OCMRolesDialog };

export default OCMRolesDialog;
