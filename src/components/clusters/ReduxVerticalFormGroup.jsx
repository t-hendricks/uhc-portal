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
  ControlLabel, HelpBlock, FormControl, FormGroup,
} from 'patternfly-react';

// To be used inside redux-form Field component.
function ReduxVerticalFormGroup(props) {
  const {
    label,
    helpText,
    meta: { error, touched },
    input,
    ...extraProps // any extra props not specified above
  } = props;

  return (
    <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
      <ControlLabel>
        {label}
      </ControlLabel>
      <FormControl name={input.name} {...input} {...extraProps} />
      <HelpBlock>
        { touched && error ? `${helpText} ${error}` : helpText }
      </HelpBlock>
    </FormGroup>
  );
}
ReduxVerticalFormGroup.defaultProps = {
  helpText: '',
};
ReduxVerticalFormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  // props passed by redux-form
  // collection of redux-form callbacks to be destructured into an html input element
  input: PropTypes.object.isRequired,
  // redux-form metadata like error or active states
  meta: PropTypes.object.isRequired,
  // plus other props passed from the <Field> component to the control (extraProps, incl. children)…
};

export default ReduxVerticalFormGroup;
