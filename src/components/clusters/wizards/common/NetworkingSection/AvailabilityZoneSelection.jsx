// a redux-form Field-compatible component for selecting an availability zone

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

const PLACEHOLDER_VALUE = 'Select availability zone';

class AvailabilityZoneSelection extends React.Component {
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
    const {
      input,
      isDisabled,
      region,
      label,
      meta: { error, touched },
    } = this.props;
    return (
      <FormGroup {...input} label={label} className="ocm-c-create-osd-az-select" isRequired>
        <SelectDeprecated
          isOpen={isOpen}
          selections={input.value || PLACEHOLDER_VALUE}
          onToggle={(_event, isOpen) => this.onToggle(isOpen)}
          onSelect={this.onSelect}
          isDisabled={isDisabled}
          aria-label={label}
        >
          <SelectOptionDeprecated key={0} value={PLACEHOLDER_VALUE} isPlaceholder />
          {['a', 'b', 'c', 'd', 'e', 'f'].map((letter) => {
            // AWS availability zones are comprised from the region name
            // followed by a single letter. For more information please see:
            // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones
            const avalabilityZone = region + letter;
            return (
              <SelectOptionDeprecated
                key={letter}
                value={avalabilityZone}
              >{`${avalabilityZone}`}</SelectOptionDeprecated>
            );
          })}
        </SelectDeprecated>

        <FormGroupHelperText touched={touched} error={error} />
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
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export { PLACEHOLDER_VALUE };

export default AvailabilityZoneSelection;
