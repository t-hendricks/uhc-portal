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
  Col, ControlLabel, HelpBlock, FormControl, FormGroup,
} from 'patternfly-react';

/*
  TODO: this hardcodes specific "horizontal form" layout.
  https://www.patternfly.org/pattern-library/forms-and-controls/field-labeling/,
  https://github.com/patternfly/patternfly-react/blob/master/packages/patternfly-react/src/components/Form/Stories/HorizontalFormField.js
  vs
  https://github.com/patternfly/patternfly-react/blob/master/packages/patternfly-react/src/components/Form/Stories/VerticalFormField.js
*/

const labelCols = 3;
const fieldCols = 12 - labelCols;

// To be used inside redux-form Field component.
function ReduxHorizontalFormGroup(props) {
  const {
    label,
    helpText,
    meta: { error, touched },
    input,
    ...extraProps
  } = props;

  return (
    <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
      <Col componentClass={ControlLabel} sm={labelCols}>
        {label}
      </Col>
      <Col sm={fieldCols}>
        <FormControl name={input.name} {...input} {...extraProps} />
        <HelpBlock>
          { touched && error ? `${helpText} ${error}` : helpText }
        </HelpBlock>
      </Col>
    </FormGroup>
  );
}
ReduxHorizontalFormGroup.defaultProps = {
  helpText: '',
};
ReduxHorizontalFormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  // props passed by redux-form
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  // plus other props to be passed to the field...
};

export default ReduxHorizontalFormGroup;
