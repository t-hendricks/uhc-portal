import React from 'react';
import PropTypes from 'prop-types';

import {
  ControlLabel, HelpBlock, FormControl, FormGroup,
} from 'patternfly-react';

function DropDownSelect({
  options,
  label,
  helpText,
  meta: { error, touched },
  input,
  ...extraProps
}) {
  return (
    <React.Fragment>
      <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
        <ControlLabel>
          {label}
        </ControlLabel>
        <FormControl name={input.name} {...input} {...extraProps} componentClass="select">
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.name}
            </option>
          ))}
        </FormControl>
        <HelpBlock>
          {touched && error ? `${helpText} ${error}` : helpText}
        </HelpBlock>
      </FormGroup>
    </React.Fragment>
  );
}

DropDownSelect.propTypes = {
  options: PropTypes.array.isRequired,
};

export default DropDownSelect;
