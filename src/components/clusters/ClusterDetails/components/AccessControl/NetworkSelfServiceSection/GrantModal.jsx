import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Form, TextInput, FormGroup, Radio,
} from '@patternfly/react-core';

import Modal from '../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../common/ErrorBox';
import PopoverHint from '../../../../../common/PopoverHint';
import { validateARN } from '../../../../../../common/validators';

const initialState = {
  selectedRole: '',
  arn: '',
  arnTouched: false,
};

class GrantModal extends Component {
 state = initialState;

 componentDidUpdate() {
   const { selectedRole } = this.state;
   const { roles } = this.props;

   // set default role
   if (!selectedRole && !!roles.length) {
     // eslint-disable-next-line react/no-did-update-set-state
     this.setState({ selectedRole: roles[0].id });
   }

   const {
     addGrantResponse, clearAddGrantResponse, closeModal,
   } = this.props;
   if (addGrantResponse.fulfilled) {
     closeModal();
     clearAddGrantResponse();
     // eslint-disable-next-line react/no-did-update-set-state
     this.setState(initialState);
   }
 }

  setArnValue = (arnValue) => {
    this.setState({ arn: arnValue, arnTouched: true });
  }

  setRoleValue = (_, event) => {
    this.setState({ selectedRole: event.target.value });
  }

  render() {
    const {
      isOpen, closeModal, submit, addGrantResponse, clearAddGrantResponse, roles,
    } = this.props;
    const { selectedRole, arn, arnTouched } = this.state;

    const cancelAddGrant = () => {
      clearAddGrantResponse();
      closeModal();
    };

    const hasError = addGrantResponse.error && (
      <ErrorBox message="Error adding grant" response={addGrantResponse} />
    );

    const validationMessage = validateARN(arn);

    const handleSubmit = () => {
      if (!validationMessage && !!selectedRole) {
        submit(selectedRole, arn);
      }
    };

    const generateRadio = role => (
      <Radio
        key={role.id}
        isChecked={selectedRole === role.id}
        name={role.id}
        onChange={this.setRoleValue}
        label={(
          <>
            {role.displayName}
            <div className="radio-helptext">{role.description}</div>
          </>
      )}
        id={role.id}
        value={role.id}
      />
    );

    return isOpen && (
      <Modal
        title="Grant AWS infrastructure role"
        onClose={cancelAddGrant}
        primaryText="Grant role"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelAddGrant}
        isPrimaryDisabled={!!validationMessage}
      >
        <>
          {hasError}
          <Form onSubmit={(e) => { handleSubmit(); e.preventDefault(); }}>
            <FormGroup
              helperTextInvalid={validationMessage}
              isValid={arnTouched ? !validationMessage : true}
              label="AWS IAM ARN"
              isRequired
              fieldId="aws-iam-arn"
            >
              <PopoverHint hint={(
                <div>
                  <p>Need help configuring ARNs?</p>
                  <a href="https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html" target="_blank" rel="noreferrer noopener">Check the AWS documention.</a>
                </div>
              )}
              />
              <TextInput
                value={arn}
                isRequired
                id="aws-iam-arn-input"
                type="text"
                isValid={arnTouched ? !validationMessage : true}
                placeholder="arn::aws:iam::123456789012:user/name"
                onChange={this.setArnValue}
                aria-label="AWS IAM ARN"
              />
            </FormGroup>
            {roles.map(role => generateRadio(role))}
          </Form>
        </>
      </Modal>
    );
  }
}

GrantModal.propTypes = {
  isOpen: PropTypes.bool,
  roles: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  clearAddGrantResponse: PropTypes.func.isRequired,
  addGrantResponse: PropTypes.object,
};

GrantModal.defaultProps = {
  isOpen: false,
  addGrantResponse: {},
};

export default GrantModal;
