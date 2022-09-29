import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, FormGroup } from '@patternfly/react-core';

class PodDistruptionBudgetGraceSelect extends React.Component {
  state = { isOpen: false };

  onToggle = (isOpen) => {
    this.setState({ isOpen });
  };

  onSelect = (_, selection) => {
    const { input } = this.props;
    this.setState({ isOpen: false });
    input.onChange(selection);
  };

  render() {
    const { isOpen } = this.state;
    const { input, isDisabled } = this.props;
    return (
      <FormGroup label="Grace period" className="ocm-c-upgrades-pdb-select">
        <Select
          isOpen={isOpen}
          selections={input.value}
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          isDisabled={isDisabled}
          direction="up"
        >
          <SelectOption value={15}>15 minutes</SelectOption>
          <SelectOption value={30}>30 minutes</SelectOption>
          <SelectOption value={60}>1 hour</SelectOption>
          <SelectOption value={2 * 60}>2 hours</SelectOption>
          <SelectOption value={4 * 60}>4 hours</SelectOption>
          <SelectOption value={8 * 60}>8 hours</SelectOption>
        </Select>
      </FormGroup>
    );
  }
}
PodDistruptionBudgetGraceSelect.propTypes = {
  isDisabled: PropTypes.bool,
  input: PropTypes.shape({
    value: PropTypes.number,
    onChange: PropTypes.func,
  }),
};

export default PodDistruptionBudgetGraceSelect;
