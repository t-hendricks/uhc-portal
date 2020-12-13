// a redux-form Field-compatible compontent for selecting an availability zone

import React from 'react';
import PropTypes from 'prop-types';
import {
  Select, SelectOption, FormGroup,
} from '@patternfly/react-core';

const PLACEHOLDER_VALUE = 'Select availability zone';

class AvailabilityZoneSelection extends React.Component {
  state = { isOpen: false };

  onToggle = (isOpen) => {
    this.setState({ isOpen });
  }

  onSelect = (_, selection) => {
    const { input } = this.props;
    this.setState({ isOpen: false });
    if (selection === PLACEHOLDER_VALUE) {
      input.onChange('');
    } else {
      input.onChange(selection);
    }
  }

  render() {
    const { isOpen } = this.state;
    const {
      input, isDisabled, region, label, meta,
    } = this.props;
    return (
      <FormGroup
        label={label}
        className="ocm-c-create-osd-az-select"
        validated={meta.error ? 'error' : undefined}
        helperTextInvalid={meta.dirty && meta.error}
      >
        <Select
          isOpen={isOpen}
          selections={input.value || PLACEHOLDER_VALUE}
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          isDisabled={isDisabled}
        >
          <SelectOption key={0} value={PLACEHOLDER_VALUE} isPlaceholder />
          {['a', 'b', 'c', 'd', 'e', 'f'].map(letter => (
            <SelectOption key={letter} value={letter}>{`${region}${letter}`}</SelectOption>
          ))}
        </Select>
      </FormGroup>
    );
  }
}
AvailabilityZoneSelection.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  region: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
  }),
  meta: PropTypes.shape({
    dirty: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default AvailabilityZoneSelection;
