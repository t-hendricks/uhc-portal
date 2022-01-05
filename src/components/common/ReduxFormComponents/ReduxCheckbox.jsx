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
import {
  Checkbox, FormGroup, Switch, Split, SplitItem,
} from '@patternfly/react-core';
import PopoverHint from '../PopoverHint';

// To be used inside redux-form Field component.
function ReduxCheckbox(props) {
  const {
    label,
    meta: { error, touched },
    input,
    isSwitch = false,
    isHelperTextBeforeField = false,
    helpText,
    extendedHelpText,
    ...extraProps // any extra props not specified above
  } = props;

  const helperTextInvalid = () => {
    if (touched && error) {
      return error;
    }
    return '';
  };

  const InputComponent = isSwitch ? Switch : Checkbox;
  return (
    <FormGroup
      fieldId={input.name}
      helperTextInvalid={helperTextInvalid()}
      isHelperTextBeforeField={isHelperTextBeforeField}
      helperText={helpText}
      validated={touched && error ? 'error' : null}
    >
      <Split hasGutter>
        <SplitItem>
          <InputComponent
            isChecked={!!input.value}
            id={input.name}
            {...input}
            {...extraProps}
            label={label}
          />
        </SplitItem>
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
  isHelperTextBeforeField: PropTypes.bool,
  helpText: PropTypes.string,
};

export default ReduxCheckbox;
