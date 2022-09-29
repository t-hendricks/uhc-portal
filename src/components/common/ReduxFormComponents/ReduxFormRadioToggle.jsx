import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Radio } from '@patternfly/react-core';

// To be used inside redux-form Field component.
class ReduxFormRadioToggle extends React.Component {
  render() {
    const {
      label1,
      label2,
      meta: { error, touched },
      input,
      ...extraProps // any extra props not specified above
    } = this.props;
    const { value } = this.state;

    return (
      <FormGroup controlId={input.name} validationState={touched && error ? 'error' : null}>
        <Radio
          {...input}
          {...extraProps}
          value="basic"
          isChecked={value === 'basic'}
          onChange={this.handleChange}
          label={label1}
          id={`${input.name}-1`}
        />{' '}
        <Radio
          value="advanced"
          isChecked={value === 'advanced'}
          onChange={this.handleChange}
          label={label2}
          id={`${input.name}-2`}
        />
      </FormGroup>
    );
  }
}
ReduxFormRadioToggle.propTypes = {
  label1: PropTypes.string.isRequired,
  label2: PropTypes.string.isRequired,
  // props passed by redux-form
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  // plus other props to be passed to the field...
};

export default ReduxFormRadioToggle;
