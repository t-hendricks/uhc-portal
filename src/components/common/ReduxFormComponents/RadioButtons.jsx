import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from '@patternfly/react-core';

class RadioButtons extends React.Component {
  state = {
    currentValue: '',
  }

  componentDidMount() {
    const {
      defaultValue,
      input,
    } = this.props;

    this.setState({ currentValue: defaultValue });
    input.onChange(defaultValue);
  }

  changeHandler = (value, event) => {
    const {
      input,
    } = this.props;

    input.onChange(event.target.value, event);
    this.setState({ currentValue: event.target.value });
  };

  render() {
    const {
      options,
      input,
    } = this.props;

    const {
      currentValue,
    } = this.state;

    return (
      options.map(option => (
        <Radio
          isChecked={currentValue === option.value}
          key={`${input.name}-${option.value}`}
          value={option.value}
          name={input.name}
          id={`${input.name}-${option.value}`}
          aria-label={option.label}
          label={option.label}
          onChange={this.changeHandler}
          isDisabled={option.disabled}
        />
      ))
    );
  }
}

RadioButtons.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape(
      {
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
      },
    ),
  ).isRequired,
};

export default RadioButtons;
