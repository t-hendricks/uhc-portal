import React from 'react';
import PropTypes from 'prop-types';

import { FormGroup } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';

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
        <SelectDeprecated
          isOpen={isOpen}
          selections={input.value}
          onToggle={(_event, isOpen) => this.onToggle(isOpen)}
          onSelect={this.onSelect}
          isDisabled={isDisabled}
          direction="up"
        >
          <SelectOptionDeprecated value={15}>15 minutes</SelectOptionDeprecated>
          <SelectOptionDeprecated value={30}>30 minutes</SelectOptionDeprecated>
          <SelectOptionDeprecated value={60}>1 hour</SelectOptionDeprecated>
          <SelectOptionDeprecated value={2 * 60}>2 hours</SelectOptionDeprecated>
          <SelectOptionDeprecated value={4 * 60}>4 hours</SelectOptionDeprecated>
          <SelectOptionDeprecated value={8 * 60}>8 hours</SelectOptionDeprecated>
        </SelectDeprecated>
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
