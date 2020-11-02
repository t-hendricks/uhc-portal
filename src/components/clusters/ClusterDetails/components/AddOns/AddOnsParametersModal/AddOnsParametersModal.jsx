import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';

import { Field } from 'redux-form';
import Modal from '../../../../../common/Modal/Modal';
import { hasParameters } from '../AddOnsHelper';
import { ReduxVerticalFormGroup } from '../../../../../common/ReduxFormComponents';
import { required } from '../../../../../../common/validators';

class AddOnsParametersModal extends Component {
  handleClose = () => {
    const { closeModal, resetForm, clearClusterAddOnsResponses } = this.props;
    clearClusterAddOnsResponses();
    resetForm();
    closeModal();
  };

  validationsForParameterField = (param) => {
    const validations = [];
    if (param.required) {
      validations.push(required);
    }
    return validations;
  };

  render() {
    const {
      isOpen,
      handleSubmit,
      addOn,
    } = this.props;

    return isOpen && (
    <Modal
      title={`Configure ${addOn.name}`}
      width={810}
      variant="large"
      onClose={this.handleClose}
      primaryText="Install"
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={this.handleClose}
      isPrimaryDisabled={false}
    >
      <Form>
        {hasParameters(addOn) && addOn.parameters.items.map(param => (
          <Field
            key={param.id}
            component={ReduxVerticalFormGroup}
            name={`parameters.${param.id}`}
            label={param.name}
            type="text"
            validate={this.validationsForParameterField(param)}
            isRequired={param.required}
            helpText={param.description}
          />
        ))}
      </Form>
    </Modal>
    );
  }
}

AddOnsParametersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  addOn: PropTypes.object,
  clearClusterAddOnsResponses: PropTypes.func.isRequired,
};

export default AddOnsParametersModal;
