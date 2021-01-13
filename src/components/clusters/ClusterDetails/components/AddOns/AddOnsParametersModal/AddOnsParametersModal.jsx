import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';

import { Field } from 'redux-form';
import Modal from '../../../../../common/Modal/Modal';
import { hasParameters } from '../AddOnsHelper';
import { ReduxVerticalFormGroup } from '../../../../../common/ReduxFormComponents';
import { required } from '../../../../../../common/validators';
import ErrorBox from '../../../../../common/ErrorBox';

class AddOnsParametersModal extends Component {
  componentDidUpdate() {
    const { submitClusterAddOnResponse } = this.props;
    if (submitClusterAddOnResponse.fulfilled) {
      this.handleClose();
    }
  }

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

  isFieldDisabled = (param) => {
    const { isUpdateForm, addOnInstallation } = this.props;
    return isUpdateForm
      && !param.editable
      && addOnInstallation.parameters !== undefined
      && addOnInstallation.parameters.items.find(x => x.id === param.id) !== undefined;
  };

  // only return param on create form.
  getParamDefault = (param) => {
    const { isUpdateForm } = this.props;
    if (!isUpdateForm && param.default_value !== undefined) {
      return param.default_value;
    }
    return '';
  }

  getHelpText = (param) => {
    const { isUpdateForm } = this.props;
    // on create just show param description
    if (!isUpdateForm) {
      return param.description;
    }
    // on update with a default value set, show description and example
    if (param.default_value !== undefined && param.default_value !== '') {
      return `${param.description}. For example "${param.default_value}"`;
    }
    // on update with no default value set, show description and example
    return param.description;
  }

  render() {
    const {
      isOpen,
      handleSubmit,
      addOn,
      isUpdateForm,
      submitClusterAddOnResponse,
      pristine,
    } = this.props;

    const isPending = submitClusterAddOnResponse.pending;

    return isOpen && (
    <Modal
      title={`Configure ${addOn.name}`}
      width={810}
      variant="large"
      onClose={this.handleClose}
      primaryText={isUpdateForm ? 'Update' : 'Install'}
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={this.handleClose}
      isPrimaryDisabled={isUpdateForm && pristine}
      isPending={isPending}
    >

      { submitClusterAddOnResponse.error && (
        <ErrorBox message="Error adding add-ons" response={submitClusterAddOnResponse} />
      )}

      <Form>
        {hasParameters(addOn) && addOn.parameters.items.map(param => (
          <Field
            key={param.id}
            component={ReduxVerticalFormGroup}
            name={`parameters.${param.id}`}
            label={param.name}
            type="text"
            placeholder={this.getParamDefault(param)}
            validate={this.validationsForParameterField(param)}
            isRequired={param.required}
            disabled={this.isFieldDisabled(param)}
            helpText={this.getHelpText(param)}
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
  addOnInstallation: PropTypes.object,
  isUpdateForm: PropTypes.bool,
  submitClusterAddOnResponse: PropTypes.object,
  clearClusterAddOnsResponses: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default AddOnsParametersModal;
