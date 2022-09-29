import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, TextInput, FormGroup, Radio } from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';
import PopoverHint from '../../../../../../common/PopoverHint';
import { validateARN } from '../../../../../../../common/validators';
import './AddGrantModal.scss';

const initialState = {
  selectedRole: '',
  arn: '',
  arnTouched: false,
};

class AddGrantModal extends Component {
  state = initialState;

  componentDidUpdate(prevProps) {
    const { selectedRole } = this.state;
    const { roles } = this.props;
    // set default role
    if (!selectedRole && !!roles.length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedRole: roles[0].id });
    }

    const { addGrantResponse, clearAddGrantResponse, closeModal } = this.props;
    if (!prevProps.addGrantResponse.fulfilled && addGrantResponse.fulfilled) {
      closeModal();
      clearAddGrantResponse();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(initialState);
    }
  }

  setArnValue = (arnValue) => {
    this.setState({ arn: arnValue, arnTouched: true });
  };

  setRoleValue = (_, event) => {
    this.setState({ selectedRole: event.target.value });
  };

  render() {
    const { isOpen, closeModal, submit, addGrantResponse, clearAddGrantResponse, roles } =
      this.props;
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

    const generateRadio = (role) => (
      <Radio
        className="radio-button"
        key={role.id}
        isChecked={selectedRole === role.id}
        name={role.id}
        onChange={this.setRoleValue}
        label={
          <>
            {role.displayName}
            <div className="radio-helptext">{role.description}</div>
          </>
        }
        id={role.id}
        value={role.id}
      />
    );

    return (
      isOpen && (
        <Modal
          title="Grant AWS infrastructure role"
          onClose={cancelAddGrant}
          primaryText="Grant role"
          secondaryText="Cancel"
          onPrimaryClick={handleSubmit}
          onSecondaryClick={cancelAddGrant}
          isPrimaryDisabled={!!validationMessage || addGrantResponse.pending}
          isPending={addGrantResponse.pending}
        >
          <>
            {hasError}
            <Form
              className="control-form-cursor"
              onSubmit={(e) => {
                handleSubmit();
                e.preventDefault();
              }}
            >
              <FormGroup
                helperTextInvalid={validationMessage}
                validated={(arnTouched ? !validationMessage : true) ? 'default' : 'error'}
                label="AWS IAM ARN"
                isRequired
                fieldId="aws-iam-arn"
                labelIcon={
                  <PopoverHint
                    hint={
                      <div>
                        <p>Need help configuring ARNs?</p>
                        <a
                          href="https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Check the AWS documention.
                        </a>
                      </div>
                    }
                    iconClassName="hand-pointer"
                  />
                }
              >
                <TextInput
                  value={arn}
                  isRequired
                  id="aws-iam-arn-input"
                  type="text"
                  validated={(arnTouched ? !validationMessage : true) ? 'default' : 'error'}
                  placeholder="arn:aws:iam::123456789012:user/name"
                  onChange={this.setArnValue}
                  aria-label="AWS IAM ARN"
                />
              </FormGroup>
              <h3 id="grant-role-select">Role</h3>
              {roles.map((role) => generateRadio(role))}
            </Form>
          </>
        </Modal>
      )
    );
  }
}

AddGrantModal.propTypes = {
  roles: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  clearAddGrantResponse: PropTypes.func.isRequired,
  addGrantResponse: PropTypes.object,
  isOpen: PropTypes.bool,
};

AddGrantModal.defaultProps = {
  addGrantResponse: {},
  isOpen: false,
};

export default AddGrantModal;
