// a redux-form Field-compatible component for selecting an availability zone

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
} from '@patternfly/react-core/deprecated';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

// AWS availability zones are comprised from the region name
// followed by a single letter. For more information please see:
// https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones
const azLetters = ['a', 'b', 'c', 'd', 'e', 'f'];

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
      enabledAvailabilityZones,
      region,
      label,
      meta: { error, touched },
    } = this.props;

    const availabilityZones = azLetters
      .map((letter) => ({
        zoneId: `${region}${letter}`,
        isDisabled:
          enabledAvailabilityZones && !enabledAvailabilityZones.includes(`${region}${letter}`),
      }))
      .sort((azA, azB) => {
        if (azA.isDisabled && !azB.isDisabled) {
          return 1;
        }
        if (azB.isDisabled && !azA.isDisabled) {
          return -1;
        }
        return azA.zoneId.localeCompare(azB.zoneId);
      });

    return (
      <FormGroup
        fieldId={input.name}
        label={label}
        className="ocm-c-create-osd-az-select"
        isRequired
      >
        <SelectDeprecated
          isOpen={isOpen}
          selections={input.value}
          onToggle={(_event, isOpen) => this.onToggle(isOpen)}
          onSelect={this.onSelect}
          isDisabled={isDisabled}
          placeholderText="Select availability zone"
          aria-label={label}
        >
          {availabilityZones.map(({ zoneId, isDisabled }) => (
            <SelectOptionDeprecated
              key={zoneId}
              value={zoneId}
              isDisabled={isDisabled}
              description={isDisabled ? 'This zone does not have all required subnets' : undefined}
            >
              {zoneId}
            </SelectOptionDeprecated>
          ))}
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
  enabledAvailabilityZones: PropTypes.arrayOf(PropTypes.string),
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  }),
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default AvailabilityZoneSelection;
