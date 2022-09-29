/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormGroup, Switch, Split, SplitItem } from '@patternfly/react-core';
import PopoverHint from '../PopoverHint';
import './ReduxCheckbox.scss';

// To be used inside redux-form Field component.
function ReduxCheckbox(props) {
  const {
    label,
    meta: { error, touched },
    input: { name, value, ...restInput },
    isSwitch = false,
    isHelperTextBeforeField = false,
    helpText,
    extendedHelpText,
    isRequired = false,
    showInitialValidationErrors = false,
    ...extraProps // any extra props not specified above
  } = props;

  const helperTextInvalid = () => {
    if ((touched || showInitialValidationErrors) && error) {
      return error;
    }
    return '';
  };

  const InputComponent = isSwitch ? Switch : Checkbox;
  return (
    <FormGroup
      fieldId={name}
      helperTextInvalid={helperTextInvalid()}
      isHelperTextBeforeField={isHelperTextBeforeField}
      helperText={helpText}
      validated={(touched || showInitialValidationErrors) && error ? 'error' : null}
    >
      <Split hasGutter>
        <SplitItem className={isRequired && 'pf-l-split__item-required'}>
          <InputComponent
            isChecked={!!value}
            id={name}
            name={name}
            {...restInput}
            {...extraProps}
            label={label}
            required={isRequired}
          />
        </SplitItem>
        {isRequired && (
          <SplitItem>
            <span className="pf-c-form__label-required redux-checkbox-required" aria-hidden="true">
              *
            </span>
          </SplitItem>
        )}
        {extendedHelpText && (
          <SplitItem>
            <PopoverHint hint={extendedHelpText} />
          </SplitItem>
        )}
      </Split>
    </FormGroup>
  );
}

ReduxCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  // props passed by redux-form
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  isSwitch: PropTypes.bool,
  // plus other props to be passed to the field...
  isDisabled: PropTypes.bool,
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isRequired: PropTypes.bool,
  // show validation errors immediately, regardless of whether field has been touched or not
  showInitialValidationErrors: PropTypes.bool,
  isHelperTextBeforeField: PropTypes.bool,
  helpText: PropTypes.string,
  onChange: PropTypes.func,
  isFilled: PropTypes.bool,
};

export default ReduxCheckbox;
