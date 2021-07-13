import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Tooltip } from '@patternfly/react-core';

class RadioButtons extends React.Component {
  componentDidMount() {
    const {
      defaultValue,
      disableDefaultValueHandling,
      input,
    } = this.props;

    if (!disableDefaultValueHandling) {
      input.onChange(defaultValue);
    }
  }

  componentDidUpdate() {
    const {
      options, defaultValue, input, disableDefaultValueHandling,
    } = this.props;

    if (!disableDefaultValueHandling) {
    // when we set the default value dynamically in the parent file
      // it was not updated until it is rendered.
      if (input.value === '') {
        input.onChange(defaultValue);
      }
      // if an option got disabled during the lifetime of the component, we should revert to default
      if (options.some(option => input.value === option.value && option.disabled
                               && option.value !== defaultValue)) {
        input.onChange(defaultValue);
      }
    }
  }

  changeHandler = (value, event) => {
    const { input, onChangeCallback } = this.props;
    const newValue = event.target.value;

    input.onChange(newValue, event);
    if (onChangeCallback) {
      onChangeCallback(input.name, newValue);
    }
  };

  render() {
    const {
      options,
      className,
      input,
      isDisabled,
    } = this.props;

    return (
      <>
        {options.map((option) => {
          const button = (
            <React.Fragment key={`${input.name}-${option.value}-fragment`}>
              <Radio
                className={className}
                isChecked={input.value === option.value}
                key={`${input.name}-${option.value}`}
                value={option.value}
                name={input.name}
                id={`${input.name}-${option.value}`}
                aria-label={option.ariaLabel || option.label}
                label={option.label}
                onChange={this.changeHandler}
                isDisabled={option.disabled || isDisabled}
                description={option.description}
              />
              {option.extraField ? option.extraField : null}
            </React.Fragment>
          );
          if (option.tooltipText) {
            return (
              <Tooltip content={option.tooltipText} position="right" key={`${input.name}-${option.value}-tooltip`}>
                {button}
              </Tooltip>
            );
          }
          return button;
        })}
      </>
    );
  }
}

RadioButtons.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  disableDefaultValueHandling: PropTypes.bool,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape(
      {
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
        ariaLabel: PropTypes.string,
        value: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        description: PropTypes.node,
        extraField: PropTypes.node,
      },
    ),
  ).isRequired,
};

export default RadioButtons;
