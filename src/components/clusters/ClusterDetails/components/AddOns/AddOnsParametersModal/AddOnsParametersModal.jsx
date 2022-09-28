import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from '@patternfly/react-core';

import { Field } from 'redux-form';
import { LevelUpAltIcon } from '@patternfly/react-icons';
import Modal from '../../../../../common/Modal/Modal';
import { getParameterValue, getParameters, quotaCostOptions } from '../AddOnsHelper';
import {
  ReduxCheckbox,
  ReduxFormDropdown,
  ReduxVerticalFormGroup,
} from '../../../../../common/ReduxFormComponents';
import { required, requiredTrue, validateNumericInput } from '../../../../../../common/validators';
import ErrorBox from '../../../../../common/ErrorBox';

import '../AddOns.scss';

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

    if (param.value_type === 'boolean') {
      // We can't match using the regexp here as it might contain chars not supported (Go vs JS),
      // instead we just do a simple check for '^true$' as the validation string
      if (param.validation !== undefined && param.validation === '^true$') {
        validations.push(requiredTrue);
      }
    } else if (param.required) {
      validations.push(required);
    }
    if (param.value_type === 'number') {
      validations.push(validateNumericInput);
    }
    return validations;
  };

  isFieldDisabled = (param) => {
    const { isUpdateForm, addOnInstallation } = this.props;
    return (
      isUpdateForm &&
      !param.editable &&
      addOnInstallation.parameters !== undefined &&
      addOnInstallation.parameters.items.find((x) => x.id === param.id) !== undefined
    );
  };

  // only return param on create form.
  getParamDefault = (param) => {
    const { isUpdateForm } = this.props;
    if (!isUpdateForm && param.default_value !== undefined) {
      return param.default_value;
    }
    return '';
  };

  getHelpText = (param) => {
    const { isUpdateForm } = this.props;
    // on create just show param description
    if (!isUpdateForm) {
      return param.description;
    }
    // on update with a default value set, show description and example
    if (isUpdateForm && param.default_value && param.editable) {
      return `${param.description}. For example "${param.default_value}"`;
    }
    // on update with no default value set, show description and example
    return param.description;
  };

  setDefaultParamValue = (param) => {
    const { change } = this.props;
    let paramValue = param.default_value;
    if (param.value_type === 'boolean') {
      paramValue = (paramValue || '').toLowerCase() === 'true';
    }
    change(`parameters.${param.id}`, paramValue);
  };

  getDefaultValueText = (param) => {
    if (param.options !== undefined && param.options.length > 0) {
      const defaultOption = param.options.find((o) => o.value === param.default_value);
      if (defaultOption !== undefined) {
        return defaultOption.name;
      }
    }
    return param.default_value;
  };

  getFieldProps = (param) => {
    const { cluster, quota, addOn, addOnInstallation, isUpdateForm } = this.props;
    if (param.options !== undefined && param.options.length > 0) {
      let paramOptions;
      if (param.value_type === 'resource') {
        let defaultValue;
        if (isUpdateForm && param.id === addOn.resource_name) {
          defaultValue = 1;
        }
        const currentValue = Number(getParameterValue(addOnInstallation, param.id, defaultValue));
        paramOptions = quotaCostOptions(param.id, cluster, quota, param.options, currentValue);
      } else {
        paramOptions = param.options;
      }
      return {
        component: ReduxFormDropdown,
        options: [{ name: '-- Please Select --', value: undefined }, ...paramOptions],
        type: 'text',
      };
    }
    switch (param.value_type) {
      case 'number':
        return {
          component: ReduxVerticalFormGroup,
          type: 'text',
        };
      case 'boolean':
        return {
          component: ReduxCheckbox,
          isHelperTextBeforeField: true,
        };
      default:
        return {
          component: ReduxVerticalFormGroup,
          type: 'text',
        };
    }
  };

  fieldForParam = (param) => {
    if (param.value_type && param.value_type === 'boolean') {
      return (
        <>
          <Field
            {...this.getFieldProps(param)}
            key={param.id}
            id={`field-addon-${param.id}`}
            name={`parameters.${param.id}`}
            label={param.name}
            placeholder={this.getParamDefault(param)}
            isRequired={param.required}
            isDisabled={this.isFieldDisabled(param)}
            validate={this.validationsForParameterField(param)}
          />
          <div className="ocm-c--reduxcheckbox-description">{this.getHelpText(param)}</div>
        </>
      );
    }
    return (
      <Field
        {...this.getFieldProps(param)}
        key={param.id}
        id={`field-addon-${param.id}`}
        name={`parameters.${param.id}`}
        label={param.name}
        placeholder={this.getParamDefault(param)}
        isRequired={param.required}
        isDisabled={this.isFieldDisabled(param)}
        helpText={this.getHelpText(param)}
        validate={this.validationsForParameterField(param)}
      />
    );
  };

  render() {
    const { isOpen, handleSubmit, addOn, isUpdateForm, submitClusterAddOnResponse, pristine } =
      this.props;

    const isPending = submitClusterAddOnResponse.pending;

    return (
      isOpen && (
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
          {submitClusterAddOnResponse.error && (
            <ErrorBox message="Error adding add-ons" response={submitClusterAddOnResponse} />
          )}

          <Form id={`form-addon-${addOn.id}`}>
            {getParameters(addOn).map((param) => (
              <FormGroup key={param.id}>
                {this.fieldForParam(param)}
                {((isUpdateForm && param.editable && param.default_value) ||
                  (!isUpdateForm && param.default_value)) && (
                  <Button
                    onClick={() => this.setDefaultParamValue(param)}
                    id={`reset-addon-${param.id}`}
                    variant="link"
                    icon={<LevelUpAltIcon />}
                    iconPosition="right"
                    className="addon-parameter-default-button"
                  >
                    Use default: {this.getDefaultValueText(param)}
                  </Button>
                )}
              </FormGroup>
            ))}
          </Form>
        </Modal>
      )
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
  cluster: PropTypes.object.isRequired,
  quota: PropTypes.object.isRequired,
  isUpdateForm: PropTypes.bool,
  submitClusterAddOnResponse: PropTypes.object,
  clearClusterAddOnsResponses: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  change: PropTypes.func,
};

export default AddOnsParametersModal;
