import { required, requiredTrue, validateNumericInput } from '~/common/validators';
import { CheckboxField, TextInputField } from '~/components/clusters/wizards/form';
import { AddOnsFormDropdown } from '~/components/common/formik/AddOnsFormDropdown';
import { NumberInputField } from '~/components/common/formik/NumberInputField';

import { getParameterValue, quotaCostOptions } from '../AddOnsHelper';

export const isFieldDisabled = (param, isUpdateForm, addOnInstallation) =>
  isUpdateForm &&
  !param.editable &&
  addOnInstallation.parameters !== undefined &&
  addOnInstallation.parameters.items.find((x) => x.id === param.id) !== undefined;

// only return param on create form.
export const getParamDefault = (param, isUpdateForm) => {
  if (!isUpdateForm && param.default_value !== undefined) {
    return param.default_value;
  }
  return '';
};

export const getHelpText = (param, isUpdateForm) => {
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

export const setDefaultParamValue = (param, setFieldValue) => {
  let paramValue = param.default_value;
  if (param.value_type === 'boolean') {
    paramValue = (paramValue || '').toLowerCase() === 'true';
  }
  setFieldValue(param.id, paramValue);
};

export const getDropdownParamOptions = (
  param,
  isUpdateForm,
  cluster,
  quota,
  addOn,
  addOnInstallation,
) => {
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
    return paramOptions;
  }
  return undefined;
};

export const getFieldProps = (param, isUpdateForm, addOn, cluster, quota, addOnInstallation) => {
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
      component: AddOnsFormDropdown,
      options: [...paramOptions],
      type: 'select',
    };
  }
  switch (param.value_type) {
    case 'number':
      return {
        component: NumberInputField,
        type: 'text',
      };
    case 'boolean':
      return {
        component: CheckboxField,
        isHelperTextBeforeField: true,
      };
    default:
      return {
        component: TextInputField,
        type: 'text',
      };
  }
};

export const validationsForParameterField = (param, value) => {
  let validations = '';
  if (param.value_type === 'boolean') {
    // We can't match using the regexp here as it might contain chars not supported (Go vs JS),
    // instead we just do a simple check for '^true$' as the validation string
    if (param.validation !== undefined && param.validation === '^true$') {
      validations = requiredTrue(value);
    } else if (param.required) {
      validations = requiredTrue(value);
    }
  } else if (param.required) {
    validations = required(value);
  }
  if (param.value_type === 'number') {
    validations = validateNumericInput(value);
  }

  return validations;
};

export const getDefaultValueText = (param) => {
  if (param.options !== undefined && param.options.length > 0) {
    const defaultOption = param.options.find((o) => o.value === param.default_value);
    if (defaultOption !== undefined) {
      return defaultOption.name;
    }
  }
  return param.default_value;
};
