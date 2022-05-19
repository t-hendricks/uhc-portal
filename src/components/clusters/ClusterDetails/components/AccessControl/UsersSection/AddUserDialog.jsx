import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Form, TextInput, FormGroup, Radio,
} from '@patternfly/react-core';

import Modal from '../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../common/ErrorBox';
import ExternalLink from '../../../../../common/ExternalLink';
import links from '../../../../../../common/installLinks.mjs';
import { checkUserID } from '../../../../../../common/validators';

const initialState = {
  selectedGroup: 'dedicated-admins',
  userId: '',
  userIdTouched: false,
};

class AddUserDialog extends Component {
 state = initialState;

 componentDidUpdate() {
   const {
     addUserResponse, clearAddUserResponses, closeModal,
   } = this.props;
   if (addUserResponse.fulfilled) {
     closeModal();
     clearAddUserResponses();
     //  eslint-disable-next-line react/no-did-update-set-state
     this.setState(initialState);
   }
 }

  setUserIdValue = (userIdValue) => {
    this.setState({ userId: userIdValue, userIdTouched: true });
  }

  setGroupValue = (_, event) => {
    this.setState({ selectedGroup: event.target.value });
  }

  cancelAddUser = () => {
    const { clearAddUserResponses, closeModal } = this.props;
    this.setState(initialState);
    clearAddUserResponses();
    closeModal();
  };

  render() {
    const {
      isOpen, submit, addUserResponse, clusterID, canAddClusterAdmin,
    } = this.props;
    const { selectedGroup, userId, userIdTouched } = this.state;

    const hasError = addUserResponse.error && (
      <ErrorBox message="Error adding grant" response={addUserResponse} />
    );

    const validationMessage = checkUserID(userId);

    const handleSubmit = () => {
      if (!validationMessage && !!selectedGroup) {
        submit(clusterID, selectedGroup, userId);
      }
    };

    const dedicatedAdmin = 'dedicated-admins';
    const clusterAdmin = 'cluster-admins';

    return isOpen && (
      <Modal
        title="Add cluster user"
        onClose={this.cancelAddUser}
        primaryText="Add user"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={this.cancelAddUser}
        isPrimaryDisabled={!!validationMessage || addUserResponse.pending}
        isPending={addUserResponse.pending}
      >
        <>
          {hasError}
          <Form className="control-form-cursor" onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
            <FormGroup
              helperTextInvalid={validationMessage}
              validated={(userIdTouched ? !validationMessage : true) ? 'default' : 'error'}
              label="User ID"
              isRequired
              fieldId="user-id"
            >
              <TextInput
                value={userId}
                isRequired
                id="user-id"
                type="text"
                validated={(userIdTouched ? !validationMessage : true) ? 'default' : 'error'}
                onChange={this.setUserIdValue}
                aria-label="user id"
              />
            </FormGroup>
            <h3 id="user-group-select">Group</h3>
            <Radio
              className="radio-button"
              key={dedicatedAdmin}
              isChecked={selectedGroup === dedicatedAdmin}
              name={dedicatedAdmin}
              onChange={this.setGroupValue}
              label={(
                <>
                  {dedicatedAdmin}
                  <div className="radio-helptext">
                    Grants standard administrative privileges for OpenShift Dedicated.
                    Users can perform administrative actions listed in the
                    {' '}
                    <ExternalLink href={links.OSD_DEDICATED_ADMIN_ROLE}>documentation</ExternalLink>
                    .
                  </div>
                </>
        )}
              id={dedicatedAdmin}
              value={dedicatedAdmin}
            />
            {canAddClusterAdmin && (
            <Radio
              className="radio-button"
              key={clusterAdmin}
              isChecked={selectedGroup === clusterAdmin}
              name={clusterAdmin}
              onChange={this.setGroupValue}
              label={(
                <>
                  {clusterAdmin}
                  <div className="radio-helptext"> Gives users full administrative access to the cluster. This is the highest level of privilege available to users. It should be granted with extreme care, because it is possible with this level of access to get the cluster into an unsupportable state.</div>
                </>
        )}
              id={clusterAdmin}
              value={clusterAdmin}
            />
            )}
          </Form>
        </>
      </Modal>
    );
  }
}

AddUserDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  clearAddUserResponses: PropTypes.func.isRequired,
  addUserResponse: PropTypes.object,
  isOpen: PropTypes.bool,
  canAddClusterAdmin: PropTypes.bool.isRequired,
  clusterID: PropTypes.string.isRequired,
};

AddUserDialog.defaultProps = {
  addUserResponse: {},
  isOpen: false,
};

export default AddUserDialog;
